import getAwsCredentials from './auth/getAwsToken'
import { unzipSync } from 'zlib'
import Axios from 'axios'
import FormData from 'form-data'
import { S3 } from 'aws-sdk'
import fs from 'fs'
import { getToken } from './auth/getCharlesToken'

const s3 = new S3()

const envValues = {
  username: process.env.CHARLES_USER,
  password: process.env.CHARLES_PASS,
  keycloak: process.env.CHARLES_KEYCLOAK,
  moove: process.env.MOOVE_URL,
  bucket: process.env.BUCKET_NAME,
  workspace: process.env.WORKSPACE_ID
}

const checkEnvFiles = () => {
  const envKeys = Object.keys(envValues)
  const invalidKeys = envKeys.filter(i => !envValues[i])
  if (invalidKeys.length === 0) {
    return true
  }
  console.log('missing env variables', invalidKeys.toString())
  return false
}

const paramsFiles = (item: S3.CommonPrefix) => ({
  Bucket: envValues.bucket,
  Prefix: `${item.Prefix}`
})

const filterNewestFile = (filesGroup: S3.ListObjectsOutput) => {
  return filesGroup.Contents.reduce((acc, crr) => {
    if (crr.Size === 0) {
      return acc
    }
    if (acc) {
      if (new Date(acc.LastModified) < new Date(crr.LastModified)) {
        return crr
      } else {
        return acc
      }
    } else {
      return crr
    }
  }, null)
}

const getSubFolders = async () => {
  const paramsSubfolders = { Bucket: process.env.BUCKET_NAME, Delimiter: '/', Prefix: process.env.PREFIX }
  return s3.listObjects(paramsSubfolders).promise()
}

const getNewestFileFromSubFolder = async (folderPrefix: S3.CommonPrefix) => {
  const filePromise = await s3.listObjects(paramsFiles(folderPrefix)).promise()
  return {
    [folderPrefix.Prefix]: filterNewestFile(filePromise)
  }
}

const getObjectFromS3 = async (filesGroup) => {
  const key = Object.keys(filesGroup)[0]
  const file = filesGroup[key]
  if (!file) {
    console.log(`nothing found in this folder ${key}`)
  } else {
    const getObjParams = {
      Bucket: envValues.bucket,
      Key: file.Key
    }
    const getFile = await s3.getObject(getObjParams).promise()
    return {
      [key]: getFile
    }
  }
}

const checkIfIsCached = (eTag, circle) => {
  if (fs.existsSync('./cache.json')) {
    const jsonMoove = JSON.parse(fs.readFileSync('./cache.json').toString())
    if (jsonMoove[circle] === eTag) {
      return true
    }
    return false
  } else {
    return false
  }
}

const createCacheFile = (eTag, circle) => {
  if (fs.existsSync('./cache.json')) {
    const jsonMoove = JSON.parse(fs.readFileSync('./cache.json').toString())
    jsonMoove[circle] = eTag
    fs.writeFileSync('./cache.json', JSON.stringify(jsonMoove))
  } else {
    fs.writeFileSync('./cache.json', '{}')
    createCacheFile(eTag, circle)
  }
}

const triggerS3 = async () => {
  if (checkEnvFiles()) {
    try {
      getAwsCredentials()
      const subFolders = await getSubFolders()
      const { CommonPrefixes } = subFolders
      const filePromises = CommonPrefixes.map(async (folderPrefix) =>
        getNewestFileFromSubFolder(folderPrefix)
      )
      const resolvedFolders = await Promise.all(filePromises)
      const s3Files = resolvedFolders.map(async (filesGroup) => getObjectFromS3(filesGroup))
      const resolvedFiles = await Promise.all(s3Files)

      const mooveCalls = resolvedFiles.map(async (s3Object) => {
        if (s3Object) {
          const s3ObjectKey = Object.keys(s3Object)[0]
          if (checkIfIsCached(s3Object[s3ObjectKey].ETag, s3ObjectKey)) {
            console.log('Cached', s3Object[s3ObjectKey].ETag, s3ObjectKey)
          } else {
            console.log('not cached')
            const s3ObjectContent: S3.GetObjectOutput = s3Object[s3ObjectKey]
            getFinalData(s3ObjectContent, s3ObjectKey.slice(0, -1)).then(() => {
              createCacheFile(s3Object[s3ObjectKey].ETag, s3ObjectKey)
            })
              .catch((err) => console.log(err))
          }
        }
      })
      return Promise.all(mooveCalls)
    } catch (error) {
      console.log(error)
    }
  }
}

const buildFormData = (buffer: Buffer, circleId: string, name: string) => {
  const data = new FormData()
  data.append('authorId', 'c7e6dafe-aa7a-4536-be1b-34eaad4c2915')
  data.append('name', name)
  data.append('keyName', 'externalId')
  data.append('file', buffer, {
    filename: 'arquivo.csv',
    contentType: 'text/csv'
  })
  return data
}

const getFinalData = async (s3Object: S3.GetObjectOutput, circleId: string) => {
  const token = await getToken(envValues.username, envValues.password, envValues.keycloak)
  const circle = await Axios.get(
    `${envValues.moove}/v2/circles/${circleId}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': process.env.WORKSPACE_ID
      }
    }
  ).then(r => r).catch(er => er)
  if (circle?.status === 200) {
    const bufferFromResponse = Buffer.from(s3Object.Body)
    const unzipedFile = unzipSync(bufferFromResponse)
    const data = buildFormData(unzipedFile, circleId, circle.data.name)
    return Axios.put(
      `${envValues.moove}/v2/circles/${circleId}/csv`,
      data.getBuffer(),
      {
        headers: {
          authorization: `Bearer ${token}`,
          ...data.getHeaders(),
          'x-workspace-id': envValues.workspace
        }
      }
    )
  } else {
    throw new Error('circle not exists')
  }
}

if (process.env.LIST_BUCKETS && Number(process.env.LIST_BUCKETS)) {
  s3.listBuckets((err, data) => {
    if (err) {
      console.log(err)
    }
    console.log(data)
  })
} else {
  setInterval(triggerS3, Number(process.env.PERIOD) || 10000)
}

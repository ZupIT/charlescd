/* eslint-disable new-cap */
import GetReposFiles from './getReposFiles'

export default async (auth, owner, repo, path) => {
  const allFiles = await GetReposFiles(auth, owner, repo, `${path}/templates/`)

  const filesArray = await allFiles.reduce(async (accumulator, item) => {
    const current = await accumulator
    const filePath = path + '/templates/' + item.name
    const contentFile = await GetReposFiles(auth, owner, repo, filePath)
    const stringFile = new Buffer.from(contentFile.content, 'base64').toString()
    current[item.name] = stringFile
    return current
  }, {})

  return filesArray
}

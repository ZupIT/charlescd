import { useState } from 'react'
import CirclesAPI from 'core/api/circles'
import { getUserProfileData } from 'core/helpers/profile'
import { useDispatch } from 'react-redux'
import { onSaveError } from 'core/helpers/request'

const buildFormData = ({ file, keyName, name }) => {
  const payload = new FormData()
  payload.append('authorId', getUserProfileData('id'))
  file && payload.append('file', file)
  keyName && payload.append('keyName', keyName)
  payload.append('name', name)

  return payload
}

export const useUploader = () => {
  const initialProgress = 0
  const dispatch = useDispatch()
  const [uploadProgress, setUploadProgress] = useState(initialProgress)
  const [isUploading, setIsUploading] = useState(false)

  function onUploadProgress({ loaded, total }) {
    const maxPercentage = 100
    const uploadPercentage = Math.round((loaded * maxPercentage) / total)
    setUploadProgress(uploadPercentage)
  }

  function onSaveFinally() {
    setUploadProgress(initialProgress)
    setIsUploading(false)
  }

  function createCircleWithFile(data) {
    const payload = buildFormData(data)
    setIsUploading(true)

    return CirclesAPI.createCircleWithFile(payload, onUploadProgress)
      .catch(error => onSaveError(error, dispatch))
      .finally(onSaveFinally)
  }

  async function updateCircleWithFile(data, circleId) {
    const payload = buildFormData(data)
    setIsUploading(true)

    try {
      return await CirclesAPI.updateCircleWithFile(circleId, payload, onUploadProgress)
    } catch (error) {
      onSaveError(error, dispatch)

      return Promise.reject(error)
    } finally {
      onSaveFinally()
    }

  }

  return [{ uploadProgress, isUploading }, { createCircleWithFile, updateCircleWithFile }]
}

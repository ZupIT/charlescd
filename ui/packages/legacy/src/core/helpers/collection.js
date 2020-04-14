export function removeByIndex(arr, index) {
  const deleteCount = 1
  const result = [...arr]
  result.splice(index, deleteCount)

  return result
}

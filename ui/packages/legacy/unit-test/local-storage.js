function storageMock() {
  let storage = {}

  return {
    setItem(key, value) {
      storage[key] = value
    },
    getItem(key) {
      return storage[key]
    },
    removeItem(key) {
      delete storage[key]
    },
    key(item) {
      const keys = Object.keys(storage)

      return keys[item] || null
    },
    restore() {
      storage = {}
    },
    clear() {
      storage = {}
    },
  }
}

export default storageMock

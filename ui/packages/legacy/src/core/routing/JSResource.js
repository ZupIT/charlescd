const resourceMap = new Map()

class Resource {

  constructor(loader) {
    this._error = null
    this._loader = loader
    this._promise = null
    this._result = null
  }

  load() {
    let promise = this._promise
    if (promise == null) {
      promise = this._loader()
        .then((result) => {
          let newResult = result

          if (result.default) {
            newResult = result.default
          }
          this._result = newResult

          return newResult
        })
        .catch((error) => {
          this._error = error
          throw error
        })
      this._promise = promise
    }

    return promise
  }

  get() {
    return this._result != null ? this._result : null
  }

  read() {
    if (this._result != null) {
      return this._result
    } if (this._error != null) {
      throw this._error
    } else {
      throw this._promise
    }
  }

}


export default (moduleId, loader) => {
  let resource = resourceMap.get(moduleId)
  if (resource == null) {
    resource = new Resource(loader)
    resourceMap.set(moduleId, resource)
  }

  return resource
}

const storages          = {}
const expectedDependent = {}

function get(key){
  return new Promise((resolve, reject) => {
    resolve(_get(key))
  })
}

function _get(key){
  return storages[key].value
}

function set(key, value){
  return new Promise((resolve, reject) => {
    let storage   = storages[key]
    let promises  = []

    _set(key, value)
    storage.dependent.forEach((dependentKey) => {
      promises.push(sync(dependentKey))
    })

    Promise.all(promises).then(() => {
      resolve()
    })
  })
}

function _set(key, value){
  storages[key].value = value
}

//@TODO Lazy기능
function create(key, value, args, sync){
  _create(key, value, args, sync)
}

function createByObject({key, value, args, sync}){
  _create(key, value, args, sync)
}

function createByArray(array){
  array.forEach((obj) => {
    createByObject(obj)
  })
}

function _create(key, value, args, sync){
  args = (args) ? args : []
  sync = (sync) ? sync : function(){}

  storages[key]={
    dependent : [],
    args,
    sync,
    value
  }

  storages[key].args.forEach((argKey) => {
    if(storages[argKey] === undefined){
        expectedDependent[argKey] = (expectedDependent[argKey]) ? [] : expectedDependent[argKey]
        expectedDependent[argKey].push(key)
        return
    }
    storages[argKey].dependent.push(key)
  })

  if(expectedDependent[key]){
    storages[key].dependent = expectedDependent[key]
    delete expectedDependent[key]
  }
}

function sync(key){
  return new Promise((resolve, reject) => {
    let storage = storages[key]
    let promise = storage.args.map((argKey) => get(argKey))
    Promise.all(promise).then((args) => {
      storage.sync.apply({}, args).then((value) => {
        set(key, value).then(() => resolve())
      })
    })
  })
}

module.exports = {
  get,
  set,
  create,
  createByObject,
  createByArray,
  sync
}

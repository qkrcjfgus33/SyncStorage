const storages          = {}
const expectedDependent = {}

//@TODO 에러 출력처리
//@TODO 수정시간 등의 메타데이터를 추가한 알고리즘 구현 고려
//@TODO 중첩 LOCK 구현
//@TODO 영향받은 순서가 최신판이냐 그렇지 않느냐에 따라 적용이 되거나 안되게 해야됨

function get(key){
  return storages[key].getLock.then(() => _get(key))
}

function _get(key){
  return __get(key)
}

function __get(key){
  return storages[key].value
}

function set(key, value){
  __set(key, value)

  return storages[key].setLock.then(() => _set(key, value)).then(() => _setUnlock(key))
}

function _set(key, value){
  return new Promise((resolve, reject) => {
    let storage   = storages[key]
    let dependent = storage.dependent

    _deepAllLock(key)
    _setLock(key)

    let promises = dependent.map((dependentKey) => sync(dependentKey).then(_allUnlock))

    Promise.all(promises).then(() => {
      resolve()
    })
  })
}

function _setLock(key){
  //@TODO _setLock 함수 만들기
}

function _getLock(key){
  //@TODO _getLock 함수 만들기
}

function _allLock(key){
  //@TODO _allLock 함수 만들기
}

function _deepSetLock(key){
 storages[key].deepDependent.forEach((keyName) => _setLock(keyName))
}

function _deepGetLock(key){
 storages[key].deepDependent.forEach((keyName) => _getLock(keyName))
}

function _deepAllLock(key){
 storages[key].deepDependent.forEach((keyName) => _allLock(keyName))
}

function _setUnlock(key){
  //@TODO _setUnlock 함수 만들기
}

function _getUnlock(key){
  //@TODO _getUnlock 함수 만들기
}

function _allUnlock(key){
  //@TODO _allUnlock 함수 만들기
}

function __set(key, value){
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

//@TODO create시 sync 한번 실행.
//@TODO create 완료후 필요한 key가 다 설정 되었는지 expectedDependent에 남은 값은 없는지 체크
function _create(key, value, args, sync){
  args = (args) ? args : []
  sync = (sync) ? sync : function(){}

  storages[key]={
    dependent     : [],
    deepDependent : [],
    setLock       : Promise.resolve(),
    getLock       : Promise.resolve(),
    args,
    sync,
    value
  }

  //@TODO deepDependent 설정

  storages[key].args.forEach((argKey) => {
    if(storages[argKey] === undefined){
        expectedDependent[argKey] = (expectedDependent[argKey]) ? expectedDependent[argKey] : []
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
    let promise = storage.args.map((argKey) => _get(argKey))
    Promise.all(promise).then((args) => {
      storage.sync.apply({}, args).then((value) => {
        _set(key, value).then(() => resolve(key))
      })
    })
  })
}

function getDeffered(){
  let obj = {}
  new Promise(resolve, reject)
}

module.exports = {
  get,
  set,
  create,
  createByObject,
  createByArray,
  sync
}

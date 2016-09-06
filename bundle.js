function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const ss = require('./index');

/*
ss.create('a', 0, [], ()=>{

})

ss.create('b', 0, [], ()=>{

})

ss.create('c', 0, ['a', 'b'], (a, b)=>{
  return new Promise((resolve) => resolve(a+b))
});
*/

ss.createByArray([{
  key: 'a',
  value: 0
}, {
  key: 'b',
  value: 0
}, {
  key: 'c',
  value: 0,
  args: ['a', 'b'],
  sync: (a, b) => {
    return new Promise(resolve => resolve(a + b));
  }
}]);_asyncToGenerator(function* () {
  let val;

  val = yield ss.get('a');
  console.log('get a', val);

  val = yield ss.get('b');
  console.log('get b', val);

  yield ss.set('a', 3);
  console.log('set a = 3');

  val = yield ss.get('a');
  console.log('get a', val);

  val = yield ss.get('b');
  console.log('get b', val);

  val = yield ss.get('c');
  console.log('get c', val);

  yield ss.set('a', 6);
  console.log('set a = 6');

  yield ss.set('b', 3);
  console.log('set b = 3');

  val = yield ss.get('a');
  console.log('get a', val);

  val = yield ss.get('b');
  console.log('get b', val);

  val = yield ss.get('c');
  console.log('get c', val);
})();

const ss = require('./index')

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
  key   : 'a',
  value : 0
},{
  key   : 'b',
  value : 0
},{
  key   : 'c',
  value : 0,
  args  : ['a', 'b'],
  sync  : (a, b)=>{
    return new Promise((resolve) => resolve(a+b))
  }
}])

;(async function() {
let val

val = await ss.get('a')
console.log('get a', val)

val = await ss.get('b')
console.log('get b', val)



await ss.set('a', 3)
console.log('set a = 3')


val = await ss.get('a')
console.log('get a', val)

val = await ss.get('b')
console.log('get b', val)

val = await ss.get('c')
console.log('get c', val)



await ss.set('a', 6)
console.log('set a = 6')

await ss.set('b', 3)
console.log('set b = 3')


val = await ss.get('a')
console.log('get a', val)

val = await ss.get('b')
console.log('get b', val)

val = await ss.get('c')
console.log('get c', val)

})()

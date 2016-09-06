function get10(){
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 1000)
  })
}

get10().then(() => 20).then(val => console.log(val)). //20
  then(50).then(val => console.log(val)).  // undefined
  then(() => get10()).then(val => console.log(val)). // 10
  then(get10).then(val => console.log(val)). // 10
  then(get10()).then(val => console.log(val)) // undefined

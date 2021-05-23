import fetchApi from './fetch.js'
import { log } from './logger.js'
import { axios } from './axios.js'
axios.get('//8.142.60.190/timeout/1000').then(r => {
  console.log('get data', r)
}).catch(e => {
  console.log('get error', e)
})

// fetchApi('/posts').then(data => {
//   data.forEach(item => {
//     log(item)
//   })
// })



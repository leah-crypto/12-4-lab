// const express = require('express')
// require('dotenv').config()
// const path = require('path')
// const app = express()
// const cors = require('cors')
// const {ROLLBAR_TOKEN} = process.env

// app.use(express.static('public'))
// app.use(cors())
// //app.use(express.static(`${__dirname}/public))
// // include and initialize the rollbar library with your access token
// var Rollbar = require('rollbar')
// var rollbar = new Rollbar({
//   accessToken: ROLLBAR_TOKEN,
//   captureUncaught: true,
//   captureUnhandledRejections: true,
// })

// // record a generic message and send it to Rollbar

// rollbar.log('Hello world!')

// app.get('/',(req,res) => {
//     res.sendFile(path.join(__dirname,'../public/index.html'))
// })

// app.get('/', (req, res) => {
//     rollbar.info()
//     res.status(200).send()
// })

// // try {
// //     if(){

// //     }else if(){

// //     }else{

// //     }
// // }
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const {ROLLBAR_TOKEN} = process.env
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info()
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
        rollbar.error("someone tried to enter a blank student")
           res.status(400).send('You must enter a name.')
       } else {
        rollbar.error("student already exists")
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
    rollbar.error(err)
       console.log(err)
      
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    rollbar.critical(`someone deleted ${students[targetIndex]}`)
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

app.listen(4004, () => console.log(`godspeed 4004`))
const express = require('express')
const excelRouter = require('./router')
const hbs = require('hbs')
const path = require('path')

const app = express()

const port = process.env.PORT || 3000

app.use(express.static('./public'))

app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'hbs')

app.use(excelRouter)

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log('listening on port ' + port)
})
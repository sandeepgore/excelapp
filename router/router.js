const express = require('express')
const multer = require('multer')
const XLSX = require('xlsx')

const { createDupandUniq } = require('../js/app')

const router = new express.Router()

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(xls|xlsx)$/)) {
            cb(new Error('Please upload excel file'))
        }

        cb('', true)
    }
})

router.post('/upload', upload.single('excel'), async (req, res) => {
    try {
        const buffer = await req.file.buffer

        const workbook = XLSX.read(buffer, { type: "buffer" })
        const wb = await createDupandUniq(workbook)
        // console.log(wb)

        XLSX.writeFile(wb, 'dup&uniqkey.xlsx')
        res.download('dup&uniqkey.xlsx')

        //res.send("ok")
    } catch (error) {
        res.send({ error: error.message })
        console.log(error)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


module.exports = router
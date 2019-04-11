const XLSX = require('xlsx')
const _ = require('lodash')
const { saveAs } = require('file-saver')
const fs = require('fs')
const http = require('http')
//console.log(http)


const createDupandUniq = (workbook) => {
    var wb1

    const first_sheet_name = workbook.SheetNames[0]

    const worksheet = workbook.Sheets[first_sheet_name]

    const jsonObj = XLSX.utils.sheet_to_json(worksheet)

    const objKeys = Object.keys(jsonObj[0])

    var CombArr = []
    var obje = {}
    var competitors = objKeys
    var isHeader

    objKeys.forEach(x => {
        if (x == '__EMPTY')
            isHeader = true
    })

    if (isHeader) {
        competitors = []
        objKeys.forEach(x => {
            competitors = [...competitors, jsonObj[0][x]]
            console.log(competitors)
        })
        delete jsonObj[0]
    }

    //Create an array with all duplicated keywords removed from the same column
    objKeys.forEach(obj => {
        var arr = []
        jsonObj.forEach(x => {
            if (x[obj])
                arr.push(x[obj])
        })
        arr = _.uniq(arr)
        obje[obj] = [...arr]
        CombArr = [...CombArr, ...arr]
    })
    //console.log('obje', obje)

    //Find duplicate and unique keys
    const findDuplicateAndUniq = (arr, callback) => {
        var object = {}
        var duplicate = []
        var unique = []

        arr.forEach(x => {
            if (!object[x]) {
                object[x] = 0
            }
            object[x] += 1
        })

        duplicate = Object.keys(object).filter(x => object[x] >= 2).map(val => [val])
        uniquer = Object.keys(object).filter(x => object[x] < 2)

        Object.keys(obje).forEach(x => obje[x] = obje[x].filter(f => uniquer.includes(f.toString())))

        var verarr = []
        var long = 0
        Object.keys(obje).forEach(o => {
            if (long < obje[o].length) { long = obje[o].length }
        })

        for (var i = 0; i < long; i++) {
            var temp = []
            Object.keys(obje).forEach(o => {
                if (!obje[o][i]) {
                    return temp = [...temp, undefined]
                }
                temp = [...temp, obje[o][i]]
            })
            verarr = [...verarr, temp]
        }

        callback(duplicate, [competitors, ...verarr])

    }

    // Get duplicate and unique keywords and write them to file
    findDuplicateAndUniq(CombArr, (dupData, uniqData) => {
        var filename = "dup&uniqkey"
        var ws_name = "Duplicate Keys"
        var ws1_name = "Unique Keys"

        if (typeof console !== 'undefined') console.log(new Date())
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(dupData); ws1 = XLSX.utils.aoa_to_sheet(uniqData)

        /* add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name)
        XLSX.utils.book_append_sheet(wb, ws1, ws1_name)

        /* write workbook */
        if (typeof console !== 'undefined') console.log(new Date())

        var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }

        var wbout = XLSX.write(workbook, wopts)
        // XLSX.writeFile(wb,filename)
        wb1 = wb
        // /* the saveAs call downloads a file on the local machine */
        // saveAs(new fs([wbout], { type: "application/octet-stream" }), filename)

        // if (typeof console !== 'undefined') console.log(new Date())
    })
    return wb1

}

module.exports = { createDupandUniq }
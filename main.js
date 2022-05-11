const url='https://www.espncricinfo.com/series/ipl-2021-1249214/'
const request=require('request')
const cheerio=require('cheerio')
const fs=require('fs')
const path=require("path")
const allmatchobj=require('./allmatch')
const iplPath=path.join(__dirname,"ipl")
dirCreator(iplPath)
request(url,cb)

function cb(err , request, html){

    if(err){
        console.log(err)
    }
    else{
        extractLink(html)
    }
}

function extractLink(html){

    let $=cheerio.load(html)
    let eleArray=$('.ds-grow .ds-px-3.ds-py-2')
    let nxtlink=$((eleArray[1])).attr('href')
    let fullink='https://www.espncricinfo.com'+nxtlink
    allmatchobj.gAlmatch(fullink)

}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false)
    fs.mkdirSync(filepath)
}


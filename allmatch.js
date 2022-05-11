const request=require('request')
const cheerio=require('cheerio')
const scorecardobj=require('./scorecard')
function getallmatchesLink(url){

    request(url,function(err,response,html){
        if(err)
        console.log(err)
        else
        linkInfo(html)
    })
}

function linkInfo(html){
    let $=cheerio.load(html)
    let allMatchArray=$('.ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent .ds-inline-flex.ds-items-center.ds-leading-none a')
    for(let i=0;i<allMatchArray.length;i++){
        if($(allMatchArray[i]).text()=='Scorecard'){
            let nxtlink=$((allMatchArray[i])).attr('href')
            let fullink='https://www.espncricinfo.com'+nxtlink
            scorecardobj.ps(fullink)
        }
    }
}

module.exports={
    gAlmatch:getallmatchesLink
}
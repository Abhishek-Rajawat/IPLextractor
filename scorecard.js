//const url =
   // "https://www.espncricinfo.com/series/ipl-2021-1249214/mumbai-indians-vs-royal-challengers-bangalore-1st-match-1254058/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path=require("path")
const xlsx=require("xlsx")

function processScorecard(url){

    request(url, cb);
}


function cb(err, request, html) {
    if (err) {
        console.log(err);
    } else {
        extraLink(html);
    }
}

function extraLink(html) {
    let $ = cheerio.load(html);
    //result venue date
    let Infodata = $(
        ".ds-p-0 .ds-grow .ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid"
    );
    var teamName=''
    var opponentTeam=''
    let venue = Infodata.text().split(",")[1].trim();
    let date = Infodata.text().split(",")[2].trim() + ",2021";
    let resdata = $(
        ".ds-p-0 .ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title"
    );
    let result=resdata.text()

    let inningArray = $(".ds-mb-4 .ds-grow .ds-py-3");

    for (let i = 0; i < inningArray.length; i++) {
        teamName = $(inningArray[i]).text().split("INNINGS")[0].trim();
        let op = i == 0 ? 1 : 0;
        opponentTeam = $(inningArray[op]).text().split("INNINGS")[0].trim();
    }
    //console.log(teamName,' vs ', opponentTeam)
    //console.log(venue,' ',date)
    let c = 0;
    let inningtableArray = $(".ReactCollapse--collapse");
    for(let j=0;j<inningtableArray.length;j++){
    let batdetailrow = $(inningtableArray[j]).find(
        ".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table tbody tr "
    );
        teamName = $(inningArray[j]).text().split("INNINGS")[0].trim();
        let op = j == 0 ? 1 : 0;
        opponentTeam = $(inningArray[op]).text().split("INNINGS")[0].trim();
    for (let i = 0; i < batdetailrow.length; i++) {
        let batscorecol = $(batdetailrow[i]).find("td");
        let isWorthy = batscorecol.length;
        if (isWorthy == 8) {
            let playername = $(batscorecol[0]).text().trim();
            let runs = $(batscorecol[2]).text().trim();
            let fours = $(batscorecol[5]).text().trim();
            let sixes = $(batscorecol[6]).text().trim();
            let balls = $(batscorecol[3]).text().trim();
            let sr = $(batscorecol[7]).text().trim();
           
            processPlayer(teamName,playername,opponentTeam,runs,fours,sixes,balls,sr,venue,date,result)
        }
    }
}
}

function processPlayer(teamName,playername,opponentTeam,runs,fours,sixes,balls,sr,venue,date,result){
    let teampath=path.join(__dirname,"ipl",teamName)
    dirCreator(teampath)
    let filepath=path.join(teampath,playername+".xlsx")
    let content=excelReader(filepath,playername)
    let playerObj={
        opponentTeam,
        runs,
        balls,
        fours,
        sixes,
        sr,
        venue,
        date,
        result
    }
    content.push(playerObj)
    excelWriter(filepath,content,playername)


}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false)
    fs.mkdirSync(filepath)
}

function excelReader(filepath,sheetname){
    if(fs.existsSync(filepath)==false){
        return []
    }
    let wb=xlsx.readFile(filepath)
    let data=wb.Sheets[sheetname]
    let ans = xlsx.utils.sheet_to_json(data)
    return ans
}

function excelWriter(filepath,json,filename){
    let newWb=xlsx.utils.book_new(filepath)
    let newWs=xlsx.utils.json_to_sheet(json)
    xlsx.utils.book_append_sheet(newWb,newWs,filename)
    xlsx.writeFile(newWb,filepath)
}


module.exports={
    ps:processScorecard
}

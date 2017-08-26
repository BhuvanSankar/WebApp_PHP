/**
 * Austlit API example provided by AustLit. Useful for reference purposes.
 */

var API_SEARCH_URL = "http://www.austlit.edu.au/austlit/search?format=IdsOnly&facetValuesSize=0&facetSampleSize=0&passThru=y&count=COUNT&from=FROM&agentQuery=AGENT_QUERY&workQuery=WORK_QUERY&scope=SEARCH_TYPE";
var AUTHOR_NAME = '((ftaname0:API_AUTHOR_FIRST_NAME AND ftaname0:API_AUTHOR_LAST_NAME) OR (ftaname1:API_AUTHOR_FIRST_NAME AND ftaname1:API_AUTHOR_LAST_NAME))';
var AUTHOR_ID = '(austlitId:AUSTLIT_API_REPLACE)';
var AUTHOR_BIRTH_YEAR = '(abirthYear:AUSTLIT_API_REPLACE)';
var AUTHOR_PLACE_NAME = '(abirthPlace:"AUSTLIT_API_REPLACE")';
var AUTHOR_PLACE_ID = '(abirthPlaceId:AUSTLIT_API_REPLACE)';
var WORK_KEYWORD = '(AUSTLIT_API_REPLACE)';
var WORK_TITLE = '((ftwtitle:"AUSTLIT_API_REPLACE") OR (ftwotherTitle:"AUSTLIT_API_REPLACE"))';
var WORK_FORM = '(wform:"AUSTLIT_API_REPLACE")';
var WORK_GENRE = '(wgenre:"AUSTLIT_API_REPLACE")';
var WORK_TYPE = '(wworkType:"AUSTLIT_API_REPLACE")';
var WORK_PUB_DATE = '(wpubDate:AUSTLIT_API_REPLACE)';
var WORK_TOPIC = '(wtopic:"AUSTLIT_API_REPLACE")';
var WORK_TOPIC_ID = '(wtopicId:AUSTLIT_API_REPLACE)';
var WORK_TOPIC_TEMPORAL = '(wtopic:AUSTLIT_API_REPLACE)';
var WORK_AGENT_AS_TOPIC = '(ftwsubjectAgent:"name AUSTLIT_API_REPLACE"~5)';
var WORK_AGENTID_AS_TOPIC = '(ftwsubjectAgent:"agentId AUSTLIT_API_REPLACE"~5)';
var WORK_PUBLISHER_NAME = '(ftwmanifestation:"pubname AUSTLIT_API_REPLACE"~5)';
var WORK_PUBLISHER_ID = '(ftwmanifestation:"pubid AUSTLIT_API_REPLACE")';
var API_DEFAULT_NUMBER_OF_RESULTS = "50";
// var WORK_SETTING = ;
// %29%20AND%20%28%28ftwsubjectAgent:%22API_WORK_SUBJECT_AGENT%22~5%29%29

function runAustLitAPI(apivars, count, from, carryThrough, searchType) {
    try {
        runAustLitAPI_2(apivars.keyword, apivars.authorName, apivars.authorId, apivars.authorBirthYear, apivars.authorBirthPlaceName, apivars.authorBirthPlaceId, apivars.workTitle, apivars.workForm, apivars.workGenre, apivars.workType, apivars.workPubDate, apivars.workSubject, apivars.workSetting, apivars.workSubjectId, apivars.workSettingId, apivars.workTemporalSetting, apivars.authorAsSubject, apivars.authorIdAsSubject, apivars.publisherName, apivars.publisherId, count, from, carryThrough, searchType);
    } catch (err) {
        alert(err);
    }
}

function runAustLitAPI_2(keyword, authorName, authorId, authorBirthYear, authorBirthPlaceName, authorBirthPlaceId, workTitle, workForm, workGenre, workType, workPubDate, workSubject, workSetting, workSubjectId, workSettingId, workTemporalSetting, authorAsSubject, authorIdAsSubject, publisherName, publisherId, count, from, carryThrough, searchType) {

    if (!searchType) searchType = "work";
    else if (searchType == "author") searchType = "agent";

    var allAgentQueries = "";
    if (authorName) {
        var nameSplit = authorName.split(" ");
        var ftaname0 = "", ftaname1 = "";
        for (var i = 0; i < nameSplit.length; i++) {
            if (nameSplit[i]) {
                ftaname0 += (ftaname0 ? " AND " : "") + "ftaname0:" + nameSplit[i];
                ftaname1 += (ftaname1 ? " AND " : "") + "ftaname1:" + nameSplit[i];
            }
        }
        allAgentQueries += "((" + ftaname0 + ") OR (" + ftaname1 + "))";
    }
    if (authorId) allAgentQueries = getReplacedQuery(allAgentQueries, AUTHOR_ID, authorId);
    if (authorBirthYear) allAgentQueries = getReplacedQuery(allAgentQueries, AUTHOR_BIRTH_YEAR, (authorBirthYear.indexOf("-") > -1 ? "[" + authorBirthYear.replace("-", " TO ") + "]" : authorBirthYear));
    if (authorBirthPlaceName) allAgentQueries = getReplacedQuery(allAgentQueries, AUTHOR_PLACE_NAME, authorBirthPlaceName);
    if (authorBirthPlaceId) allAgentQueries = getReplacedQuery(allAgentQueries, AUTHOR_PLACE_ID, authorBirthPlaceId);

    var allWorkQueries = "";
    if (keyword) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_KEYWORD, keyword);
    if (workTitle) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TITLE, workTitle);
    if (workForm) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_FORM, workForm);
    if (workGenre) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_GENRE, workGenre);
    if (workType) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TYPE, workType);
    if (workPubDate) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_PUB_DATE, (workPubDate.indexOf("-") > -1 ? "[" + workPubDate.replace("-", " TO ") + "]" : workPubDate));
    if (workSubject) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TOPIC, workSubject);
    if (workSetting) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TOPIC, workSetting);
    if (workSubjectId) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TOPIC_ID, workSubjectId);
    if (workSettingId) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TOPIC_ID, workSettingId);
    if (workTemporalSetting) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_TOPIC_TEMPORAL, (workTemporalSetting.indexOf("-") > -1 ? "[" + workTemporalSetting.replace("-", " TO ") + "]" : workTemporalSetting));
    if (authorAsSubject) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_AGENT_AS_TOPIC, authorAsSubject);
    if (authorIdAsSubject) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_AGENTID_AS_TOPIC, authorIdAsSubject);
    if (publisherName) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_PUBLISHER_NAME, publisherName);
    if (publisherId) allWorkQueries = getReplacedQuery(allWorkQueries, WORK_PUBLISHER_ID, publisherId);

    if (!count) count = API_DEFAULT_NUMBER_OF_RESULTS;
    if (!from) from = "0";

    $.ajax({
        url: API_SEARCH_URL.replace("AGENT_QUERY", allAgentQueries).replace("WORK_QUERY", allWorkQueries).replace("COUNT", count).replace("FROM", from).replace("SEARCH_TYPE", searchType),
        dataType: 'html', cache: 'false', error: function (err1, err2, err3) {
            alert(err1 + " -- " + err2 + " ** " + err3);
        },
        context: {ct: carryThrough},
        success: function (htmlRet, textStatus) {
            getAustLitInfo($(htmlRet).find(".workIdsOnly.concise,.agentIdsOnly.concise").map(function () {
                return $(this).attr("austlitId");
            }).get(), this.ct);
        }
    });
}

function getAustLitInfo(ids, carryThrough) {
    $.ajax({
        url: "http://www.austlit.edu.au/austlit/export",
        data: {
            exportTemplate: "JSON",
            disposition: "file",
            downloadFileName: "export",
            downloadFileExtension: "json",
            nodes: ids
        },
        dataType: 'json', cache: 'false', error: function (err1, err2, err3) {
            alert(err1 + " -- " + err2 + " ** " + err3);
        },
        context: {ct: carryThrough}, type: "POST", traditional: true,
        success: function (data, textStatus) {
            processAustLitAPI(data, this.ct);
        }
    });
}

function getReplacedQuery(mainQuery, queryChunk, replacementString) {
    return mainQuery += (mainQuery ? " AND " : "") + queryChunk.replace(/AUSTLIT_API_REPLACE/g, replacementString);
}

/* A procressAustLitAPI function must be created in the client code */
/* to handle the results from the getAustLitInfo funcion            */
/*
 function processAustLitAPI(data) {
 alert(data);
 }*/
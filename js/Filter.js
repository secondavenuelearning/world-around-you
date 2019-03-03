import _ from 'underscore';
export default FiltersBar

/* ----------------------- Global variables ----------------------- */
var filters = {};
var filterRegex;
var fullResults;

var database = //placeholder data obj
[
    {
        Title: "Harry Potter and the Half Blood Prince",
        Sign: ["fsl_luzon", "asl"],
        Written: ["English", "British"],
        Author: "JK Rowling",
        Published: "7/16/2005",
        Updated: "7/19/2009"
    },
    {
        Title: "Harry Potter and the Cursed Child",
        Sign: ["fsl_luzon", "asl", "fsl_visayas"],
        Written: ["English", "British", "Tagalog"],
        Author: "Jack Thorne",
        Published: "7/30/2016",
        Updated: "7/30/2016"
    },
    {
        Title: "Joy of Cooking",
        Sign: ["fsl_mindanao", "fsl_visayas"],
        Written: ["English", "Tagalog"],
        Author: "Irma S. Rombauer",
        Published: "1/1/1931",
        Updated: "1/1/2006"
    }
];

/* ----------------------- Filter Building ----------------------- */
/*
Builds out filters bar for web pages that already have a div witht he "FIltersBar" id
*/
function FiltersBar()
{
    //save full possible results
    fullResults = $('.results').text();
    
//---SIGN LANGUAGE FILTER
    //build html for filter
    var signID = "SignLanguageFilter";
    var signs = GetValues("Sign", database);//["fsl_luzon", "fsl_visayas", "fsl_mindanao"]; //note: hardcoded for now - later will get from json files or database
    var signsHTML = BuildMultiSelectFilter(signID, "Sign Language", signs); //build out html for signs filter
    
    //update pahe html to ahve this filter
    $('.filterBar').append(signsHTML); //apend filter bar to have signs html
    
    //add click events for filter functionality
    $('#' + signID + ' > button').on('click', function() {ToggleOptionsVisible(signID)}); //toggle showing filter options
    $('#' + signID + ' > #options > input').on('click', function(e) {UpdateMultiSelectFilter(signID, e)}); //update filter
    
//---WRITTEN LANGUAGE FILTER
    //build html for filter
    var writtenID = "WrittenLanguageFilter";
    var written = ["English", "Tagalog"]; //note: hardcoded for now - later will get from json files or database
    var writtenHTML = BuildMultiSelectFilter(writtenID, "Written Language", written); //build out html for signs filter
    
    //update page html to have this filter
    $('.filterBar').append(writtenHTML); //apend filter bar to have signs html
    
    //add click events for filter functionality
    $('#' + writtenID + ' > button').on('click', function() {ToggleOptionsVisible(writtenID)});
    $('#' + writtenID + ' > #options > input').on('click', function(e) {UpdateMultiSelectFilter(writtenID, e)});
    
//---SORTING FILTER
    var sortID = "SortByFilter";
    var sortByFields = ["Title", "Author", "DatePublished", "LastUpdated", "Relevance"];
    var sortByHTML = BuildSelectFilter(sortID, "Sort By", sortByFields);
    $('.filterBar').append(sortByHTML);
    $('#' + sortID + ' > button').on('click', function() {ToggleOptionsVisible(sortID)});
}

/*
Returns HTML as string for a filter field
(filterID: tag to be used for divs id)
(filterName: text on the filter dropdown button, also for checkbox name)
(filterOptions: array of strings that define the values and text for each checkbox int he filter)
*/
function BuildMultiSelectFilter(filterID, filterName, filterOptions)
{
    //varibles for this filters data
    var thisFilter = 
    {
        Data: [],
        ID: filterID,
        Name: filterName,
        Regex: "",
        Type: "Multi"
        
    }
    
    //build base filter div
    var filterHTML = "<div class = \"filter\" id = \"" + filterID +"\">";
    filterHTML += "\n";
    filterHTML += "<button>" + filterName + "</button>";
    filterHTML += "\n";
    filterHTML += "<div id = \"options\">";
    filterHTML += "\n";
    
    //build options
    for(var i = 0; i < filterOptions.length; i++)
    {
        //build html
        var optionName = filterName + i.toString();
        filterHTML += "<input type = \"checkbox\" ";
        filterHTML += "name = \"" + optionName + "\"";
        filterHTML += "value = \"" + filterOptions[i] + "\">";
        filterHTML += filterOptions[i];
        filterHTML += "<br>";
        
        //update this filters data
        thisFilter.Data[filterOptions[i]] = false;
    }
    
    //close divs and the like
    filterHTML += "</div>";
    filterHTML += "\n";
    filterHTML += "</div>";
    
    //add this fully built filter to array of filters
    filters[thisFilter.ID] = thisFilter;
    
    //give back final built html
    return filterHTML;
}

/*
Returns HTML as string for a filter field
>filterID: tag to be used for divs id
>filterName: text on the filter dropdown button
>filterOptions: array of strings that define the values and text for each select option
*/
function BuildSelectFilter(filterID, filterName, filterOptions)
{
    //varibles for this filters data
    var thisFilter = 
    {
        Data:
        {
            Current: 0,
            Options: filterOptions
        },
        ID: filterID,
        Name: filterName,
        Regex: "",
        Type: "Single"
    }
    
    //build base filter div
    var filterHTML = "<div class = \"filter\" id = \"" + filterID +"\">";
    filterHTML += "\n";
    filterHTML += "<button>" + filterName + "</button>";
    filterHTML += "\n";
    filterHTML += "<select id = \"options\">";
    filterHTML += "\n";
    
    //build options
    for(var i = 0; i < filterOptions.length; i++)
    {
        //build html
        filterHTML += "<option ";
        filterHTML += "value = \"" + filterOptions[i] + "\">";
        filterHTML += filterOptions[i];
        filterHTML += "</option>";
    }
    
    //close divs and the like
    filterHTML += "</select>";
    filterHTML += "\n";
    filterHTML += "</div>";
    
    //add this fully built filter to array of filters
    filters[thisFilter.ID] = thisFilter;
    
    //give back final built html
    return filterHTML;
}

/* ----------------------- Options ----------------------- */
function ToggleOptionsVisible(target)
{
    //get proper options object
    var options = $('#' + target + '> #options');
    
    //get current mode
    var currentMode = options.css("display");
    
    //check if showing or not
    if(currentMode.toString() === "none")
    {
        options.css("display", "block");
    }
    else
    {
        options.css("display", "none");
    }
    
}

function GetValues(type, sourcedb)
{
    //instanitate variable to return and initla setup junk
    var source = sourcedb;
    var options = [];
    
    //loop through database for the givne type and add data as options
    var index = 0;
    source.forEach(function(val)
    {
        //check if value is an array itself- then get data points within array
        if(Array.isArray(val[type]))
        { 
            val[type].forEach(function(childVal)
            {
                //check if its a unique value
                if(!options.includes(childVal))
                {
                    //if so add to array of options
                    options[index] = childVal;
                    index++;
                }
            });
        }
        else
        {
            //check if its a unique value
            if(!options.includes(val[type]))
            {
                //if so add to array of options
                options[index] = val[type];
                index++;
            }
        }
        
        
    });
    
    //give back array of options
    return options;
}

/* ----------------------- Filter Functionality ----------------------- */
//Changes what vidoe results user gets based on sign
function UpdateMultiSelectFilter(filterData, target)
{
    //update filter data obj
    var obj = $(target.target)[0];
    filters[filterData].Data[obj.value] = obj.checked;
    
    //create regex string out fo active filters
    var thisFiltersRegex = "";
    Object.keys(filters[filterData].Data).forEach(function(option)
    {
        if(filters[filterData].Data[option] == true)
        {
            thisFiltersRegex += option + "|";
        }
    });
    
    //set this filters regex with this regex object (or "" for nothing)
    filters[filterData].Regex = thisFiltersRegex;
    
    //filter data
    Filter(fullResults);
}

function Filter(input)
{
    var results = input;
 
    //build regex object for all filters
    var filterKeys = Object.keys(filters);
    var finalRegex = "";
    filterKeys.forEach(function(key)
    {
        finalRegex += filters[key].Regex;
        
    });
 
    //legwork for actual filtering (build regex object and use it to cull results)
    if(finalRegex != "")
    {
        //remove extra |
        finalRegex = finalRegex.slice(0, finalRegex.length - 1);
        
        //build rgegx obj
        finalRegex = new RegExp(finalRegex, 'gi');
        
        //filter data through this regex
        var currentResults = "";
        results.replace(finalRegex, function(match)
        {
            currentResults += match + ',';
            return;
        });
        results = currentResults;

    }
    results = Sort(results);
    //end point
    $('.results').text(results);
}

function Sort(input)
{
    //convert string to array
    var results = input.split(',');
    
    //sort alphabetically
    results.sort();
    
    //give back sorted input
    return results;
}
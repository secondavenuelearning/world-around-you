import '../css/Filter.css!';
import _ from 'underscore';
export default FiltersBar

/* ----------------------- Global variables ----------------------- */
var filters = {};
var filterRegex;
var finalResults;

var database = //placeholder data obj
[
    {
        Title: "Harry Potter and the Half Blood Prince",
        Sign: ["fsl_luzon", "asl"],
        Written: ["English", "British"],
        Author: "JK Rowling",
        DatePublished: "7/16/2005",
        LastUpdated: "7/19/2009"
    },
    {
        Title: "Harry Potter and the Cursed Child",
        Sign: ["fsl_luzon", "asl", "fsl_visayas"],
        Written: ["English", "British", "Tagalog"],
        Author: "Jack Thorne",
        DatePublished: "7/30/2016",
        LastUpdated: "7/30/2016"
    },
    {
        Title: "Joy of Cooking",
        Sign: ["fsl_mindanao", "fsl_visayas"],
        Written: ["English", "Tagalog"],
        Author: "A",
        DatePublished: "1/1/1931",
        LastUpdated: "1/1/2006"
    }
];

/* ----------------------- Filter Building ----------------------- */
/*
Builds out filters bar for web pages that already have a div witht he "FIltersBar" id
*/
function FiltersBar()
{
    //save full possible results
    finalResults = database;
    console.log(finalResults);
    
    //add child
    $('.filterBar').append("<div class=\"filters\"></div>");
    
//---SIGN LANGUAGE FILTER
    //build html for filter
    var signID = "SignLanguageFilter";
    var signs = GetValues("Sign", database);//["fsl_luzon", "fsl_visayas", "fsl_mindanao"]; //note: hardcoded for now - later will get from json files or database
    var signsHTML = BuildMultiSelectFilter(signID, "Sign Language", signs, "Sign", "img/icons/language.png"); //build out html for signs filter
    
    //update pahe html to ahve this filter
    $('.filters').append(signsHTML); //apend filter bar to have signs html
    
    //add click events for filter functionality
    $('#' + signID + ' > button').on('click', function() {ToggleOptionsVisible(signID)}); //toggle showing filter options
    $('#' + signID + ' > #options > label > input').on('click', function(e) {UpdateMultiSelectFilter(signID, e)}); //update filter
    
//---WRITTEN LANGUAGE FILTER
    //build html for filter
    var writtenID = "WrittenLanguageFilter";
    var written = GetValues("Written", database); //note: hardcoded for now - later will get from json files or database
    var writtenHTML = BuildMultiSelectFilter(writtenID, "Written Language", written, "Written", "img/icons/language.png"); //build out html for signs filter
    
    //update page html to have this filter
    $('.filters').append(writtenHTML); //apend filter bar to have signs html
    
    //add click events for filter functionality
    $('#' + writtenID + ' > button').on('click', function() {ToggleOptionsVisible(writtenID)});
    $('#' + writtenID + ' > #options > label > input').on('click', function(e) {UpdateMultiSelectFilter(writtenID, e)});
    
//---SORTING FILTER
    var sortID = "SortByFilter";
    var sortByFields = ["Title", "Author", "DatePublished", "LastUpdated", "Relevance"];
    var sortByHTML = BuildSelectFilter(sortID, "Sort By", sortByFields, "img/icons/language.png");
    
    $('.filters').append(sortByHTML);
    
    $('#' + sortID + ' > button').on('click', function() {ToggleOptionsVisible(sortID)});
    $('#' + sortID + ' > #options').on('change', function(e) {UpdateSort(signID, e, sortID)});
}

/*
Returns HTML as string for a filter field
(filterID: tag to be used for divs id)
(filterName: text on the filter dropdown button, also for checkbox name)
(filterOptions: array of strings that define the values and text for each checkbox int he filter)
*/
function BuildMultiSelectFilter(filterID, filterName, filterOptions, filterTarget, icon)
{
    //varibles for this filters data
    var thisFilter = 
    {
        Data: [],
        ID: filterID,
        Name: filterName,
        Regex: "",
        FilterAgainst: filterTarget,
        Type: "Multi"
        
    }
    
    //build base filter div
    var filterHTML = "<div class = \"filter\" id = \"" + filterID +"\">";
    filterHTML += "\n";
    filterHTML += "<button><img src=\"" + icon + "\">"
    filterHTML += filterName + "</button>";
    filterHTML += "\n";
    filterHTML += "<div id = \"options\">";
    filterHTML += "\n";
    
    //build options
    for(var i = 0; i < filterOptions.length; i++)
    {
        //build html
        var optionName = filterName + i.toString();
        filterHTML += "<label class = \"container\">" + filterOptions[i];
        filterHTML += "<input type = \"checkbox\" ";
        filterHTML += "name = \"" + optionName + "\"";
        filterHTML += "value = \"" + filterOptions[i] + "\">";
        filterHTML += "<span class=\"checkmark\"></span>";
        filterHTML += "</label>";
        
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
function BuildSelectFilter(filterID, filterName, filterOptions, icon)
{
    //varibles for this filters data
    var thisFilter = 
    {
        Data: filterOptions,
        ID: filterID,
        Name: filterName,
        Regex: "",
        FilterAgainst: filterOptions[0],
        Type: "Single"
    }
    
    //build base filter div
    var filterHTML = "<div class = \"filter\" id = \"" + filterID +"\">";
    filterHTML += "\n";
    filterHTML += "<button><img src=\"" + icon + "\">"
    filterHTML += filterName + "</button>";
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
    Filter(database);
}

function Filter(input)
{
    var results = [];
    var resultIndex = 0;
    
    
    Object.keys(filters).forEach(function(key)
    {
        ////checking if actually need to filter
        var regexObj = filters[key].Regex;
        if(regexObj != "") 
        {    
            //we do- build regex and clear results
            regexObj = regexObj.slice(0, regexObj.length - 1);
            regexObj = new RegExp(regexObj, 'gi');
            
             //loop through each entry to check for matches to the inplace filters
            input.forEach(function(entry)
            {
                var match = false;

                //get relevant data and compare
                var data = entry[filters[key].FilterAgainst];
                if(Array.isArray(data)) //extra check for data being array as we need to iterate through its entires
                { 
                    data.forEach(function(dataPoint)
                    {
                        //check if data fits the regex model
                        if(regexObj.test(dataPoint))
                        {
                            match = true;
                        }
                    });

                }
                else //single line piece of data
                {
                    //check if data fits the regex model
                    if(regexObj.test(data))
                    {
                        match = true;
                    }
                }
                
                //check if the search reuslts in any matches - if so update results!
                if(match && !results.includes(entry))
                {
                    //it does- at the whole entry to the results
                    results[resultIndex] = entry;
                    resultIndex++; //prep for next result
                    input = results; //set input to results so next run uses updated data set
                }
            });
        }
        else
        {
            results = input;
        }
        
    });
        
    finalResults = Sort(results, "SortByFilter");
    console.log(results);
}

/* ----------------------- Sort Functionality ----------------------- */

function UpdateSort(filterKey, target)
{
    //change current sorting field
    filters[filterKey].FilterAgainst = target.target.value; console.log(filters[filterKey].FilterAgainst);
    
    //update the data to be sorted by this new target
    finalResults = Sort(finalResults, filterKey);
    console.log(finalResults);
}

function Sort(input, filterKey)
{ 
    //sort alphabetically
    input.sort(function(a, b)
    {
        //sort based on sortBy field selected
        var currentSort = filters[filterKey].FilterAgainst;
        if(a[currentSort] < b[currentSort])
        {
            return -1;
        }
        else
        {
            return 1;
        }
    });

    //give back sorted input
    return input;
}

/* ----------------------- Array extra functions ----------------------- */
//Adds includes method for browsers that dont support
// thanks: https://stackoverflow.com/questions/31221341/ie-does-not-support-includes-method
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    enumerable: false,
    value: function(obj) {
        var newArr = this.filter(function(el) {
          return el == obj;
        });
        return newArr.length > 0;
      }
  });
}
import _ from 'underscore';
export default FiltersBar

/* ----------------------- Global variables ----------------------- */
var filters = {};

/* ----------------------- Filter Building ----------------------- */
/*
Builds out filters bar for web pages that already have a div witht he "FIltersBar" id
*/
function FiltersBar()
{
//---SIGN LANGUAGE FILTER
    //build html for filter
    var signID = "SignLanguageFilter";
    var signs = ["fsl_luzon", "fsl_visayas", "fsl_mindanao"]; //note: hardcoded for now - later will get from json files or database
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
>filterID: tag to be used for divs id
>filterName: text on the filter dropdown button, also for checkbox name
>filterOptions: array of strings that define the values and text for each checkbox int he filter
*/
function BuildMultiSelectFilter(filterID, filterName, filterOptions)
{
    //varibles for this filters data
    var thisFilter = 
    {
        Data: [],
        ID: filterID,
        Name: filterName
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
        filterHTML += "<option ";
        filterHTML += "value = \"" + filterOptions[i] + "\">";
        filterHTML += filterOptions[i];
        filterHTML += "</option>";
    }
    
    //close divs and the like
    filterHTML += "</select>";
    filterHTML += "\n";
    filterHTML += "</div>";
    
    //give back final built html
    return filterHTML;
}

/* ----------------------- Fake DropDown ----------------------- */
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

/* ----------------------- Filter Functionality ----------------------- */
//Changes what vidoe results user gets based on sign
function UpdateMultiSelectFilter(filterData, target)
{
    //update filter data obj
    var obj = $(target.target)[0];
    filters[filterData].Data[obj.value] = obj.checked;
    
}

//variable to hold current sort by type- my attempt at a javascript enum
var SortBy = 
{
    Current: 0,
    
    Type:
    {
        Title: 0,
        Author: 1,
        PublishDate: 2,
        LastUpdated: 3,
        Relevance: 4 
    }
};

//Changes what videos users get based on the sortby type given (filtered against SortBy variable)
function FilterSortBy(type)
{

}
import _ from 'underscore';
export default FiltersBar

/* ----------------------- Filter Building ----------------------- */
/*
Builds out filters bar for web pages that already have a div witht he "FIltersBar" id
*/
function FiltersBar()
{
    //make filter section in html
    //$('.FilterBar')
    
    //get possible sign languages and build filter for signs
    var signs = ["fsl_luzon", "fsl_visayas", "fsl_mindanao"]; //note: hardcoded for now - later will get from json files or database
    var signsHTML = BuildMultiSelectFilter("SignLauageFilter", "Sign Language", signs); //build out html for signs filter
    $('#filterBar').append(signsHTML); //apend filter bar to have signs html
    
    var sortByFields = ["Title", "Author", "DatePublished", "LastUpdated", "Relevance"];
    var sortByHTML = BuildSelectFilter("SortByFilter", "Sort By", sortByFields);
    $('#filterBar').append(sortByHTML);
}

/*
Returns HTML as string for a filter field
>filterID: tag to be used for divs id
>filterName: text on the filter dropdown button, also for checkbox name
>filterOptions: array of strings that define the values and text for each checkbox int he filter
*/
function BuildMultiSelectFilter(filterID, filterName, filterOptions)
{
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
        var optionName = filterName + i.toString();
        filterHTML += "<input type = \"checkbox\" ";
        filterHTML += "name = \"" + optionName + "\"";
        filterHTML += "value = \"" + filterOptions[i] + "\">";
        filterHTML += filterOptions[i];
        filterHTML += "<br>";
    }
    
    //close divs and the like
    filterHTML += "</div>";
    filterHTML += "\n";
    filterHTML += "</div>";
    
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
        filterHTML += "<option type = \"checkbox\" ";
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

/* ----------------------- Filter Functionality ----------------------- */
//Changes what vidoe results user gets based on sign
function FilterSignLanuage()
{

}

//Chnages what vidoes users get based on written lang
function FilterWrittenLanguage()
{

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
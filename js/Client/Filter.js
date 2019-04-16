import '../../style/Filter.css!';
import _ from 'underscore';
import ImageHoverSwap from 'js/Client/HelperFunctions.js';
import CustomSelect  from 'js/Client/CustomSelect';
import LanguageSelector from 'js/Client/LanguageSelector';

export default FiltersBar

/* ----------------------- Global variables ----------------------- */
var filters = {};
var filterRegex;
var finalResults;
var toFilterWritten = [];
var toFilterSign = [];
var sortBy = '';
/* ----------------------- Filter Building ----------------------- */
/*
Builds out filters bar for web pages that already have a div with the "FiltersBar" id

id - element ID of element on the page to build filters into
filterTarget - Target element that will display Story Previews
filterList - List of Story Previews that will be filtered and/or sorted
*/
function FiltersBar(id, filterTarget, filterList)
{
    $.ajax({
        method: 'get',
        url: './api/writtenlanguages'
    }).done((writtenLanguages) => {
        $.ajax({
            method: 'get',
            url: './api/signlanguages'
        }).done((signLanguages) => {

            $(`#${id}`).append("<div id='theFilters' class=\"filters\"></div>");
            // Create list from of languages from stories in the database.
            var writtenLanguagesList = [];
            for(var index in writtenLanguages){
                if(!writtenLanguages[index]){
                    continue;
                }
                writtenLanguagesList.push(writtenLanguages[index].name);
            }
            var signLanguagesList = [];
            for(var index in writtenLanguages){
                if(!signLanguages[index]){
                    continue;
                }
                signLanguagesList.push(signLanguages[index].name);
            }

            let wlSelect = new CustomSelect('theFilters', {
                id: 'written-language-select', 
                options: writtenLanguagesList,
                multiSelect: true,
                defaultText: 'Written Language'
            }),
            slSelect = new CustomSelect('theFilters', {
                id: 'sign-language-select', 
                options: signLanguagesList,
                multiSelect: true,
                defaultText: 'Sign Language'
            }),
            sortBySelect = new CustomSelect('theFilters', {
                id: 'sort-by-select', 
                options: ["Title", "Author", "Date Published", "Last Updated"],
                defaultText: 'Sort By'
            });
            // Add icons now handled in Custom Select
            /*
            var icon = document.createElement("img");
            $(icon).attr('src', 'img/icons/General/icon_WrittenLang_White.svg');
            $('#written-language-select .custom-select-value' ).prepend(icon);
            icon = document.createElement("img");
            $(icon).attr('src', 'img/icons/General/icon_SignLang_White.svg'); 
            $('#sign-language-select .custom-select-value' ).prepend(icon);
            icon = document.createElement("img");
            $(icon).attr('src', 'img/icons/General/icon_Filter.svg'); 
            $('#sort-by-select .custom-select-value' ).prepend(icon);
            */
            $('#written-language-select').addClass('filter');
            $('#sign-language-select').addClass('filter');
            $('#sort-by-select').addClass('filter');
            // Events for filtering and sorting
            $(wlSelect).on('change', (evt, values) => {  
                toFilterWritten = values;
                updateFilter(filterTarget, filterList);
            });
            $(slSelect).on('change', (evt, values) => {
                toFilterSign = values;
                updateFilter(filterTarget, filterList);
            });
            $(sortBySelect).on('change', (evt, value) => {
                sortBy = value;
                updateFilter(filterTarget, filterList);
            });
        });
    });
}
/*
Function to apply a filter to the list of Story Previews.
*/
function updateFilter(filterTarget, filterList){
    var filteredList = [];
    let itemList = Array.from(filterList);

    //The algorithm prunes from the list of all stories and removes selections so they are not added twice.
    if(toFilterWritten.length > 0){
        for(var index = 0; index < itemList.length; index++){
            for(var filterIndex = 0; filterIndex < toFilterWritten.length; filterIndex++){
                if(itemList[index].story.metadata.writtenLanguages.includes(toFilterWritten[filterIndex])){
                    filteredList.push(itemList[index]);
                    itemList.splice(index, 1);
                    index--;
                    break;
                }
            }
        }
    }
    if(toFilterSign.length > 0){
        // If no filtering occured from the written language filter, load the entire unfiltered list.
        if(filteredList.length > 0){
            itemList = Array.from(filteredList);
            filteredList = [];
        }
        // Assuming an already filtered list from the written language filter above, this filter check will be faster than the written language filter.
        for(var index = 0; index < itemList.length; index++){
            for(var filterIndex = 0; filterIndex < toFilterSign.length; filterIndex++){
                if(itemList[index].story.metadata.signLanguages.includes(toFilterSign[filterIndex])){
                    filteredList.push(itemList[index]);
                    itemList.splice(index, 1);
                    index--;
                    break;
                }
            }
        }
    }
    // If no filter options were chosen, return the entire list, otherwise list will return empty.
    if(toFilterSign.length === 0 && toFilterWritten.length === 0){
        if(sortBy){
            runSort(itemList, filterTarget);
        }else{
            filterTarget.update(itemList);
        }
        document.getElementById(filterTarget.getId()).scrollIntoView();
        return;
    }

    if(sortBy){
        runSort(filteredList, filterTarget);
    }else{
        filterTarget.update(filteredList);
    }
    document.getElementById(filterTarget.getId()).scrollIntoView();
}
/*
Function to apply a sort to the list of Story Previews
*/
function runSort(filteredList, filterTarget){
    var aValue = '';
    var bValue = '';
    var localeCompareBool = false;
    var answer = '';
    filteredList.sort((a, b) => {
        // Get current language to search the list of story options by language
        let clt = LanguageSelector.currentLanguageText();
        switch(sortBy){
            case 'Title':
                aValue = a.story.metadata.title[clt];
                bValue = b.story.metadata.title[clt];
                localeCompareBool = true;       
                break;
            case 'Author':
                aValue = a.story.author;
                bValue = b.story.author;
                localeCompareBool = true;
                break;
            case 'Date Published':
                aValue = a.story.datecreated;
                bValue = b.story.datecreated;
                break;
            case 'Last Updated':
                aValue = a.story.datemodified;
                bValue = b.story.datemodified;
                break;
            default:
                aValue = a.story.metadata.title[clt];
                bValue = b.story.metadata.title[clt];       
                break;
        }
        // If value does not exist because of language preference or otherwise, sort item to the bottom.
        if(!aValue || aValue == null){
            return 1;
        }
        if(!bValue || bValue == null){
            return -1;
        }
        // Compares alphabetical sorting in different languages.
        if(localeCompareBool){
            answer = aValue.localeCompare(bValue, LanguageSelector.currentLanguage());
        }else{
            var aDate = new Date(aValue);
            var bDate = new Date(bValue);
            // Sort by newest first
            answer = aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        }
        return answer;
    });
    filterTarget.update(filteredList);
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
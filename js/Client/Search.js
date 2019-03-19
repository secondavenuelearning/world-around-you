import 'style/Stories.css!';
import FiltersBar from 'js/Client/Filter.js';
import StoryPreview from 'js/Client/StoryPreview';
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Search.html!text';


$(document).ready(function () {
    $('main').html(html);

    $('#search-input').val(location.search.replace('?search=', ''));
    var search = $('#search-input').val();


    $.ajax({
        method: 'get',
        url: `./api/search/${search}`
    }).done((stories) => {
        $('#search-input').on('keyup', (evt) => {
            if(evt.key == 'Enter')
                $('#search-wrapper').submit();
        });

        FiltersBar('filter-bar');

        for (var i = 0; i < stories.length; i++) {
            let sp = new StoryPreview(stories[i]);
            sp.appendTo('stories');
        }
        
        LanguageSelector.updateLanguageDisplay();
    });

});
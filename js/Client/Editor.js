import 'style/Editor.css!';
import _ from "underscore";
import LanguageSelector from 'js/Client/LanguageSelector';

import html from 'html/Client/Editor.html!text';

var storyId;
$(document).ready(function () {

    new Promise((resolve, reject) => {
        storyId = location.search.replace('?id=', '');
        if(storyId){
            resolve();
        }
        else{

        }
    }).then(() => {
        $('main').html(html);
        $.ajax({
            method: 'get',
            url: './api/stories'
        }).done((stories) => {
        }).fail((err) => {
        });
    });
});
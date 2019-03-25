import 'style/Login.css!';
import LanguageSelector from 'js/Client/LanguageSelector';
import html from 'html/Client/Login.html!text';

$(document).ready(function () {
    $('main').html(html);

    $('#login-form-submit').on('click', (evt) => {
    	evt.preventDefault();

    	let username = $('#login-username').val(),
    		password = $('#login-password').val();

    	$.ajax({
	        method: 'post',
	        url: './api/login',
	        data: {
	        	username,
	        	password
	        }
	    }).done((result) => {
	    	if(result === true) window.location = './Stories';
	    	else alert('[PH] Invalid Login Credentials')
	    }).fail((err) => {
        	alert('[PH] Something went wrong with the serve, please try again later');
	    });
    });
    LanguageSelector.updateLanguageDisplay();
});
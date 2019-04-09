import 'style/Editor.css!';
import 'style/Games/BusGameEditor.css!';

import _ from 'underscore';
import urlParams from 'js/Client/UrlParams';

import html from 'html/Client/Games/BusGameEditor.html!text';
const template = _.template(html);

let game = window.game,
	termList = [],
	selectedList = [],
	unsavedChanges = false,
	name;

$(document).ready(() => {
	new Promise((resolve, reject) => {
		if(game){
			resolve(game);
		}
		else{
			$.ajax({
				method: 'get',
				url: `api/game/data?id=${urlParams.id}`
			}).done((_game) => {
				resolve(_game);
			}).catch((err) => {
				console.error(err);
			});
		}
	}).then((_game) => {
		game = _game;
		_.each(game.story.data, (page) => {
			if(!page.glossary || !page.glossary[game.writtenLanguage]) return;

			_.each(page.glossary[game.writtenLanguage], (term, termName) => {
				if(!term.video || !term.video[game.signLanguage]) return;

				termList.push(termName);
			});
		});

		name = game.data ? game.data.name : 'No Name';
		selectedList = game.data.terms || [];

		Render();
	})
});

function Render() {
	termList = termList.sort(function (a, b) {
	    return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	selectedList = selectedList.sort(function (a, b) {
	    return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	
	$('main').html(template({
		game,
		termList,
		name,
		selectedList,
		unsavedChanges
	}));

	$('.term-button').on('click', (evt) => {
		let fnc = $(evt.currentTarget).attr('term-fnc'),
			value = $(evt.currentTarget).attr('term-name');

		if(fnc == 'add'){
			if(selectedList.indexOf(value) == -1)
				selectedList.push(value);
		}
		else{
			let index = selectedList.indexOf(value);
			if(index != -1)
				selectedList.splice(index, 1);
		}

		unsavedChanges = true;
		Render();
	});

	$('#name-input').on('keydown keyup', (evt) => {
		name = $('#name-input').val();
		unsavedChanges = true;
		$('.save-button').prop('disabled', false);
	});

	$('.save-button').on('click', (evt) => {
		$.ajax({
			method: 'post',
			url: '/api/story/gamedata',
			data: {
				id: game.id,
				data: {
					name,
					terms: selectedList
				}
			}
		}).done((result) => {
			unsavedChanges = false;
			Render();
		}).fail((err) => {
			console.error(err);
		});
	});
}
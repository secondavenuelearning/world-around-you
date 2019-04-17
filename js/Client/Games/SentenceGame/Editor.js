import 'style/Editor.css!';
import 'style/Games/SentenceGame/Editor.css!';

import _ from 'underscore';
import urlParams from 'js/Client/UrlParams';

import html from 'html/Client/Games/SentenceGame/Editor.html!text';
const template = _.template(html);

let game = window.game,
	name,
	termList = [],
	sentences = [],
	sentenceId = 0,
	unsavedChanges = false;

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
		sentences = game.data && game.data.sentences ? game.data.sentences : [];
		
		Render();
	})
});

function Render() {	
	let scroll = $('#term-selection')[0] ? $('#term-selection')[0].scrollTop : 0;

	var text, video, term;
	if(sentences[sentenceId]){
		_.each(game.story.data, function(page){
			if(!page.glossary || !page.glossary[game.writtenLanguage]) return;

			_.each(page.glossary[game.writtenLanguage], function(_term){
				if(_term.name == sentences[sentenceId].term){
					text = page.text[game.writtenLanguage];
					video = page.video[game.signLanguage];
					term = _term;
				}
			});
		});


		// highlight glossary term
		let regEx = new RegExp(sentences[sentenceId].term, 'i');
		text = text.replace(regEx, (match) => {
			return `<span class="glossary-term">${match}</span>`;
		});
	}

	$('main').html(template({
		game,
		name,
		termList,
		sentences,
		sentenceId,
		text,
		video,
		term,
		unsavedChanges
	}));
	if($('#term-selection')[0])
		$('#term-selection')[0].scrollTo(0, scroll);

	if($('.term-button.active')[0])
		$('.term-button.active')[0].scrollIntoViewIfNeeded();

	if(sentences[sentenceId]){
		// loop the video between the desired times
		let vid = $('#term-video video')[0];
		if(vid){
			vid.ontimeupdate = function(){
				let startTime = term.video[game.signLanguage].start || 0,
					endTime = term.video[game.signLanguage].end || vid.duration;

				if(vid.currentTime < startTime || vid.currentTime > endTime)
					vid.currentTime = startTime;
			}
		}
	}

	// Name input listeners
	$('#name-input').on('change keydown keyup', (evt) => {
		name = $('#name-input').val();
		unsavedChanges = true;
		$('.save-button').prop('disabled', false);
	});

	// Part 1 and Part 2 input listeners
	$('.part-input').on('focus blur', (evt) => {
		let input = $(evt.currentTarget),
			partNumber = input.attr('part-number');

		if(!sentences[sentenceId][`part${partNumber}`] || sentences[sentenceId][`part${partNumber}`] == ''){
			if(evt.type == 'focus'){
				let range, selection;
				if (document.body.createTextRange) {
					range = document.body.createTextRange();
					range.moveToElementText(input[0]);
					range.select();
				} 
				else if (window.getSelection) {
					selection = window.getSelection();
					range = document.createRange();
					range.selectNodeContents(input[0]);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
			else{
				input.html('Enter Text');
				input.addClass('placeholder')
			}
		}
	});
	$('.part-input').on('keydown keyup', (evt) => {
		let input = $(evt.currentTarget),
			partNumber = input.attr('part-number');

		let value = input.html();
		if(value == 'Enter Text') return;

		input.removeClass('placeholder')
		sentences[sentenceId][`part${partNumber}`] = value;
		unsavedChanges = true;
		$('.save-button').prop('disabled', false);
	});

	// Add term
	$('.add-term').on('click', (evt) => {
		sentences.push({
			term: termList[0],
			part1: '',
			part2: ''
		});

		sentenceId = sentences.length - 1;
		unsavedChanges = true;
		Render();
	});

	// Change current term
	$('.term-button').on('click', (evt) => {
		var index = $(evt.currentTarget).attr('sentence-index');
		sentenceId = index;

		Render();
	});

	// Delete term
	$('.term-delete-button').on('click', (evt) => {
		if(sentences.length == 1) return;

		var index = $(evt.currentTarget).attr('sentence-index');
		sentences.splice(index, 1);

		sentenceId = sentenceId > sentences.length - 1 ? sentenceId - 1 : sentenceId;
		unsavedChanges = true;
		Render();
	});

	// Change term being edited
	$('#term-select').on('change', (evt) => {
		sentences[sentenceId].term = $('#term-select').val();

		unsavedChanges = true;
		Render();
	});

	// Save callback
	$('.save-button').on('click', (evt) => {
		if(termList.length < 3) return;
		$.ajax({
			method: 'post',
			url: '/api/story/gamedata',
			data: {
				id: game.id,
				data: {
					name,
					sentences,
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
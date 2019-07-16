import 'style/Games.css!';
import _ from 'underscore';
import user from 'js/Client/User'
import urlParams from 'js/Client/UrlParams';

import CustomSelect from 'js/Client/CustomSelect';

import html from 'html/Client/Games.html!text';
const template = _.template(html);

import gameListHtml from 'html/Client/GameList.html!text';
const gameListTemplate = _.template(gameListHtml);

const storyId = urlParams.storyId;
let currentGameId,
currentWrittenLanguageId,
currentSignLanguageId,
currentSort,
games,
writtenLanguages,
signLanguages,
story,
storyGames;

$(document).ready(() => {


	$('main').html(template({
		user
	}));

	var promises = [];
	promises.push(MakeGetRequest(`/api/games`));
	promises.push(MakeGetRequest(`/api/writtenlanguages`));
	promises.push(MakeGetRequest(`/api/signlanguages`));
	promises.push(MakeGetRequest(`/api/story?id=${storyId}`));
	promises.push(MakeGetRequest(`/api/story/games?id=${storyId}`));


	Promise.all(promises).then((args) => {
		games = args[0];
		writtenLanguages = args[1];
		signLanguages = args[2];
		story = args[3];
		storyGames = args[4];

		let gameOptions = [],
		writtenOptions = [],
		signOptions = [];

		_.each(games, (game) => {
			gameOptions.push({
				value: game.id,
				label: game.name
			});
		});

		_.each(writtenLanguages, (lang) => {
			if(!story.metadata || !story.metadata.writtenLanguages || story.metadata.writtenLanguages.indexOf(lang.name) == -1)
				return;

			writtenOptions.push({
				value: lang.id,
				label: lang.name
			});
		});

		_.each(signLanguages, (lang) => {
			if(!story.metadata || !story.metadata.signLanguages || story.metadata.signLanguages.indexOf(lang.name) == -1)
				return;

			signOptions.push({
				value: lang.id,
				label: lang.name
			});
		});

		const gameSelect = new CustomSelect('game-search-filters', {
			id: 'game-select',
			options: gameOptions
		});
		$(gameSelect).on('change', (evt, value) => {
			currentGameId = value;
			RenderGameList();
		});

		const writtenSelect = new CustomSelect('game-search-filters', {
			id: 'written-language-select',
			options: writtenOptions
		});
		$(writtenSelect).on('change', (evt, value) => {
			currentWrittenLanguageId = value;
			RenderGameList();
		});

		const signSelect = new CustomSelect('game-search-filters', {
			id: 'sign-language-select',
			options: signOptions
		});
		$(signSelect).on('change', (evt, value) => {
			currentSignLanguageId = value;
			RenderGameList();
		});

		const gameSort = new CustomSelect('game-sort', {
			id: 'sort-select',
			defaultText: 'Sort By',
			options: [
			{value: 'name', label: 'Name'},
			{value: 'datecreated', label: 'Date Published'},
			{value: 'datemodified', label: 'Last Updated'},
			]
		});
		$(gameSort).on('change', (evt, value) => {
			currentSort = value;
			RenderGameList();
		});

		


		currentGameId = gameOptions[0].value;
		currentWrittenLanguageId = writtenOptions[0].value;
		currentSignLanguageId = signOptions[0].value;
		currentSort = 'datecreated';
		RenderGameList();
	});
});

function RenderGameList(){
	let gameData = [];
	_.each(storyGames, (game) => {
		if(game.gameId != currentGameId 
			|| game.writtenlanguageId != currentWrittenLanguageId 
			|| game.signlanguageId != currentSignLanguageId 
			|| (!game.data && !user))
			return;

		gameData.push(game);
	});

	gameData = gameData.sort((a, b) => {
		if(currentSort == 'datecreated' || currentSort == 'datemodified'){
			return a[currentSort] < b[currentSort] ? 1 : a[currentSort] > b[currentSort] ? -1 : 0;
		}
		else{
			if(!a.data) return 1;
			if(!b.data) return -1;

			return a.data.name < b.data.name ? 1 : a.data.name > b.data.name ? -1 : 0;
		}
	});

	$('#game-results').html(gameListTemplate({
		user,
		gameData
	}));

	let newLink = `./GameEditor?storyId=${storyId}&gameId=${currentGameId}&writtenlanguageId=${currentWrittenLanguageId}&signlanguageId=${currentSignLanguageId}`;
	$('#new-game-link').attr('href', newLink);

	$('.game-delete-button').on('click', (evt, value) => {
		MakeGetRequest('./GameDelete?gameId=' + evt.currentTarget.getAttribute("gameId")).then((result) => {
			location.reload(); 
		}).catch((err) => {
			return res.redirect('back');
		});
	});
}

function MakeGetRequest(url){
	return new Promise((resolve, reject) => {
		$.ajax({
			method: 'get',
			url
		}).done((result) => {
			resolve(result);
		}).fail((err) => {
			console.error(err);
		});
	});
}
import urlParams from 'js/Client/UrlParams';

if(urlParams.id){
	$.ajax({
		method: 'get',
		url: `api/game/data?id=${urlParams.id}`
	}).done((game) => {
		window.game = game;
		System.import(`./js/Client/Games/${game.path}/Editor.js`);
	}).catch((err) => {
		console.error(err);
	});
}
else if(urlParams.storyId && urlParams.gameId && urlParams.writtenlanguageId && urlParams.signlanguageId){
	$.ajax({
		method: 'post',
		url: './api/story/game',
		data: {
			id: urlParams.storyId,
			gameId: urlParams.gameId,
			writtenlanguageId: urlParams.writtenlanguageId,
			signlanguageId: urlParams.signlanguageId,
		}
	}).done((gamedataId) => {
		window.location = window.location.origin + window.location.pathname + `?id=${gamedataId}`;
	}).catch((err) => {
		console.error(err);
	});
}
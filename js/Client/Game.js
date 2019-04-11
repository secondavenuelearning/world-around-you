import urlParams from 'js/Client/UrlParams';

if(urlParams.id){
	$.ajax({
		method: 'get',
		url: `api/game/data?id=${urlParams.id}`
	}).done((game) => {
		window.game = game;
		System.import(`./js/Client/Games/${game.path}/Main.js`);
	}).catch((err) => {
		console.error(err);
	});
}
else{
	console.error('Game id not specified');
}
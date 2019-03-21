const COOKIENAME = 'way.user';

let user = false,
	cookies = decodeURIComponent(document.cookie).split(';');

for(let i in cookies){
	let cookie = cookies[i];
	if(!cookie.match(COOKIENAME)) continue;

	let regexp = new RegExp(COOKIENAME + '.*{');
	cookie = cookie.replace(regexp, '{');
	user = JSON.parse(cookie);
}

export default user;
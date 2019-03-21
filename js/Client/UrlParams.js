var params = {};

var queryArray = location.search.replace('?', '').split('&');
for(let i in queryArray){
	let string = queryArray[i];
	if(!string || string == '') continue;

	let splitString = string.split('='),
		key = splitString.shift(),
		value = splitString.join('=');

	params[key] = value;
}

export default params;
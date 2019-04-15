import _ from 'underscore';

let online = !window.offline;

if(online) $('body').append('<script src="/upup.min.js"></script>');

function SetStorage(storageName, obj){
    if (typeof(Storage) === "undefined"){
    	console.error('No storage for this browser.');
    	return;
    }

	localStorage.setItem(storageName, JSON.stringify(obj));
}

function GetStorage(storageName){
    if (typeof(Storage) === "undefined"){
    	console.error('No storage for this browser.');
    	return;
    }

    let jsonString = localStorage.getItem(storageName);
    return jsonString ? JSON.parse(jsonString) : null;
}

function AddToAssetList(storageName, listOrItem){
	let list = GetStorage(storageName) || [];

	if(typeof listOrItem == 'string'){
		list.push(listOrItem);
	}
	else{
		_.each(listOrItem, (item) => {
			if(list.indexOf(item) == -1)
				list.push(item);
		});
	}

	SetStorage(storageName, list);
	return list;
}

function RemoveFromAssetList(storageName, listOrItem){
	let list = GetStorage(storageName);

	if(typeof listOrItem == 'string'){
		let index = list.indexOf(listOrItem);
		if(index != -1) list.splice(index, 1);
	}
	else{
		_.each(listOrItem, (item) => {
			let index = list.indexOf(item);
			if(index != -1) list.splice(index, 1);
		});
	}

	SetStorage(storageName, list);
	return list;
}

function SaveServiceWorker(url, assets){
	if(UpUp){
		UpUp.start({
			'content-url': url,
			'assets': assets,
			'service-worker-url': '/upup.sw.min.js'
		});
	}
	else{
		console.error('No service worker found for your current browser.');
	}
}

export default {
	SetStorage,
	GetStorage,
	AddToAssetList,
	RemoveFromAssetList,
	SaveServiceWorker
}
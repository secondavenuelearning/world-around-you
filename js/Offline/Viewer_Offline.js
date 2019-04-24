!function(e){function t(e){Object.defineProperty(this,e,{enumerable:!0,get:function(){return this[v][e]}})}function r(e){if("undefined"!=typeof System&&System.isModule?System.isModule(e):"[object Module]"===Object.prototype.toString.call(e))return e;var t={default:e,__useDefault:e};if(e&&e.__esModule)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return new o(t)}function o(e){Object.defineProperty(this,v,{value:e}),Object.keys(e).forEach(t,this)}function n(e){return"@node/"===e.substr(0,6)?c(e,r(m(e.substr(6))),{}):p[e]}function u(e){var t=n(e);if(!t)throw new Error('Module "'+e+'" expected, but not contained in build.');if(t.module)return t.module;var r=t.linkRecord;return i(t,r),a(t,r,[]),t.module}function i(e,t){if(!t.depLoads){t.declare&&d(e,t),t.depLoads=[];for(var r=0;r<t.deps.length;r++){var o=n(t.deps[r]);t.depLoads.push(o),o.linkRecord&&i(o,o.linkRecord);var u=t.setters&&t.setters[r];u&&(u(o.module||o.linkRecord.moduleObj),o.importerSetters.push(u))}return e}}function d(t,r){var o=r.moduleObj,n=t.importerSetters,u=!1,i=r.declare.call(e,function(e,t){if(!u){if("object"==typeof e)for(var r in e)"__useDefault"!==r&&(o[r]=e[r]);else o[e]=t;u=!0;for(var i=0;i<n.length;i++)n[i](o);return u=!1,t}},{id:t.key});"function"!=typeof i?(r.setters=i.setters,r.execute=i.execute):(r.setters=[],r.execute=i)}function l(e,t,r){return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:r,setters:void 0,execute:void 0,moduleObj:{}}}}function f(e,t,r,o){var n={};return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:void 0,execute:o,executingRequire:r,moduleObj:{default:n,__useDefault:n},setters:void 0}}}function s(e,t,r){return function(o){for(var n=0;n<e.length;n++)if(e[n]===o){var u,i=t[n],d=i.linkRecord;return u=d?-1===r.indexOf(i)?a(i,d,r):d.moduleObj:i.module,"__useDefault"in u?u.__useDefault:u}}}function a(t,r,n){if(n.push(t),t.module)return t.module;var u;if(r.setters){for(var i=0;i<r.deps.length;i++){var d=r.depLoads[i],l=d.linkRecord;l&&-1===n.indexOf(d)&&(u=a(d,l,l.setters?n:[]))}r.execute.call(y)}else{var f={id:t.key},c=r.moduleObj;Object.defineProperty(f,"exports",{configurable:!0,set:function(e){c.default=c.__useDefault=e},get:function(){return c.__useDefault}});var p=s(r.deps,r.depLoads,n);if(!r.executingRequire)for(var i=0;i<r.deps.length;i++)p(r.deps[i]);var v=r.execute.call(e,p,c.__useDefault,f);void 0!==v?c.default=c.__useDefault=v:f.exports!==c.__useDefault&&(c.default=c.__useDefault=f.exports);var m=c.__useDefault;if(m&&m.__esModule)for(var b in m)Object.hasOwnProperty.call(m,b)&&(c[b]=m[b])}var f=t.module=new o(r.moduleObj);if(!r.setters)for(var i=0;i<t.importerSetters.length;i++)t.importerSetters[i](f);return f}function c(e,t){return p[e]={key:e,module:t,importerSetters:[],linkRecord:void 0}}var p={},v="undefined"!=typeof Symbol?Symbol():"@@baseObject";o.prototype=Object.create(null),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(o.prototype[Symbol.toStringTag]="Module");var m="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,y={};return Object.freeze&&Object.freeze(y),function(e,t,n,i){return function(d){d(function(d){var s={_nodeRequire:m,register:l,registerDynamic:f,registry:{get:function(e){return p[e].module},set:c},newModule:function(e){return new o(e)}};c("@empty",new o({}));for(var a=0;a<t.length;a++)c(t[a],r(arguments[a],{}));i(s);var v=u(e[0]);if(e.length>1)for(var a=1;a<e.length;a++)u(e[a]);return n?v.__useDefault:(v instanceof o&&Object.defineProperty(v,"__esModule",{value:!0}),v)})}}}("undefined"!=typeof self?self:"undefined"!=typeof global?global:this)

(["a"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
!function(e){function r(e,r){for(var n=e.split(".");n.length;)r=r[n.shift()];return r}function n(n){if("string"==typeof n)return r(n,e);if(!(n instanceof Array))throw new Error("Global exports must be a string or array.");for(var t={},o=0;o<n.length;o++)t[n[o].split(".").pop()]=r(n[o],e);return t}function t(r){if(-1===a.indexOf(r)){try{var n=e[r]}catch(e){a.push(r)}this(r,n)}}var o,i=$__System,a=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB","mozInnerScreenY","mozInnerScreenX"];i.registry.set("@@global-helpers",i.newModule({prepareGlobal:function(r,i,a){var f=e.define;e.define=void 0;var l;if(a){l={};for(var s in a)l[s]=e[s],e[s]=a[s]}return i||(o={},Object.keys(e).forEach(t,function(e,r){o[e]=r})),function(){var r,a=i?n(i):{},s=!!i;if(i||Object.keys(e).forEach(t,function(e,n){o[e]!==n&&void 0!==n&&(i||(a[e]=n,void 0!==r?s||r===n||(s=!0):r=n))}),a=s?a:r,l)for(var c in l)e[c]=l[c];return e.define=f,a}}}))}("undefined"!=typeof self?self:"undefined"!=typeof global?global:this);

$__System.registerDynamic("b", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.registerDynamic("c", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register('d', ['e'], function (_export) {
	'use strict';

	var _, online;

	function SetStorage(storageName, obj) {
		if (typeof Storage === "undefined") {
			console.error('No storage for this browser.');
			return;
		}

		localStorage.setItem(storageName, JSON.stringify(obj));
	}

	function GetStorage(storageName) {
		if (typeof Storage === "undefined") {
			console.error('No storage for this browser.');
			return;
		}

		var jsonString = localStorage.getItem(storageName);
		return jsonString ? JSON.parse(jsonString) : null;
	}

	function AddToAssetList(storageName, listOrItem) {
		var list = GetStorage(storageName) || [];

		if (typeof listOrItem == 'string') {
			list.push(listOrItem);
		} else {
			_.each(listOrItem, function (item) {
				if (list.indexOf(item) == -1) list.push(item);
			});
		}

		SetStorage(storageName, list);
		return list;
	}

	function RemoveFromAssetList(storageName, listOrItem) {
		var list = GetStorage(storageName);

		if (typeof listOrItem == 'string') {
			var index = list.indexOf(listOrItem);
			if (index != -1) list.splice(index, 1);
		} else {
			_.each(listOrItem, function (item) {
				var index = list.indexOf(item);
				if (index != -1) list.splice(index, 1);
			});
		}

		SetStorage(storageName, list);
		return list;
	}

	function SaveServiceWorker(url, assets) {
		if (UpUp) {
			UpUp.start({
				'content-url': url,
				'assets': assets,
				'service-worker-url': '/upup.sw.min.js'
			});
		} else {
			console.error('No service worker found for your current browser.');
		}
	}

	return {
		setters: [function (_e) {
			_ = _e['default'];
		}],
		execute: function () {
			online = !window.offline;

			if (online) $('body').append('<script src="/upup.min.js"></script>');
			_export('default', {
				SetStorage: SetStorage,
				GetStorage: GetStorage,
				AddToAssetList: AddToAssetList,
				RemoveFromAssetList: RemoveFromAssetList,
				SaveServiceWorker: SaveServiceWorker
			});
		}
	};
});

$__System.register('f', [], function (_export) {
	'use strict';

	var params, queryArray, i, string, splitString, key, value;
	return {
		setters: [],
		execute: function () {
			params = {};
			queryArray = location.search.replace('?', '').split('&');

			for (i in queryArray) {
				string = queryArray[i];

				if (!string || string == '') continue;

				splitString = string.split('=');
				key = splitString.shift();
				value = splitString.join('=');

				params[key] = value;
			}

			_export('default', params);
		}
	};
});

$__System.registerDynamic("10", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register("11", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div id=\"<%- id %>\" class=\"story-preview\">\r\n\t<div class=\"cover-image-container\" style=\"background-image: url(<%- story.coverimage %>)\">\r\n\t\t<button class=\"info-button\">i</button>\r\n\t</div>\r\n\r\n\t<div class=\"meta-data-container\">\r\n\t\t<a href=\"./<%- launchToEditor ? 'Editor' : 'View' %>?id=<%- story.id %>\">\r\n\t\t\t<% _.each(story.metadata.title, function(title, lang){ %>\r\n\t\t\t\t<div class=\"title\" lang=\"<%- lang %>\"><%- title %></div>\r\n\t\t\t<% }) %>\r\n\t\t\t<div class=\"author\"><%- story.author %></div>\r\n\t\t\t<% _.each(story.metadata.description, function(description, lang){ %>\r\n\t\t\t\t<div class=\"description\" lang=\"<%- lang %>\"><%- description %></div>\r\n\t\t\t<% }) %>\r\n\t\t</a>\r\n\t\t<% if(online){ %>\r\n\t\t\t<a class=\"story-game-button\" href=\"./Games?storyId=<%- story.id %>\"></a>\r\n\t\t<% } %>\r\n\t</div>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.registerDynamic("12", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register('13', [], function (_export) {
	'use strict';

	return {
		setters: [],
		execute: function () {
			_export('default', [{ code: 'en', text: 'English' }, { code: 'tl', text: 'Tagalog' }]);
		}
	};
});

$__System.register("14", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div id=\"language-selector\">\r\n     <img src = \"../../img/icons/General/icon_Globe_White.svg\">\r\n\t<select id=\"language-select\">\r\n        \r\n\t\t<% _.each(languages, function(language){ %>\r\n          \r\n\t\t\t<option value=\"<%- language.code %>\"><%- language.text %></option>\r\n\t\t<% }) %>\r\n\t</select>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register('15', ['12', '13', '14', 'e'], function (_export) {
	'use strict';

	var languages, html, _, template, _currentLanguage, _currentLanguageText, $el, appendTo, updateLanguageDisplay;

	return {
		setters: [function (_2) {}, function (_3) {
			languages = _3['default'];
		}, function (_4) {
			html = _4['default'];
		}, function (_e) {
			_ = _e['default'];
		}],
		execute: function () {

			languages.sort(function (a, b) {
				return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
			});

			template = _.template(html);
			_currentLanguage = $('html').attr('lang');
			$el = $(template({
				languages: languages,
				currentLanguage: _currentLanguage
			}));

			_.each(languages, function (lang) {
				if (lang.code == _currentLanguage) _currentLanguageText = lang.text;
			});

			$('*[lang="' + _currentLanguage + '"]:not(html)').show();

			appendTo = function appendTo(elementOrId) {
				// grab the jquery element
				var $elementOrId = $(typeof elementOrId == 'string' ? '#' + elementOrId : elementOrId);

				// append the story preview element
				$elementOrId.append($el);

				$('#language-select').off('change');
				$('#language-select').on('change', function (evt) {
					_currentLanguage = $(evt.currentTarget).val();
					$('#language-select option').each(function (i, el) {
						if ($(el).prop('selected')) _currentLanguageText = $(el).html().toLowerCase();
					});
					updateLanguageDisplay();
					$(document).trigger('languageChange');
				});
			};

			updateLanguageDisplay = function updateLanguageDisplay() {
				$('*[lang]:not(html)').hide();
				$('html').attr('lang', _currentLanguage);

				// conver any text to an actual language code
				_.each(languages, function (langObj) {
					$('*[lang="' + langObj.text + '"]').attr('lang', langObj.code);
				});

				$('*[lang="' + _currentLanguage + '"]:not(html)').show();
			};

			_export('default', {
				appendTo: appendTo,
				updateLanguageDisplay: updateLanguageDisplay,
				currentLanguage: function currentLanguage() {
					return _currentLanguage.toLowerCase();
				},
				currentLanguageText: function currentLanguageText() {
					return _currentLanguageText.toLowerCase();
				}
			});
		}
	};
});

$__System.register('16', ['10', '11', '15', 'e'], function (_export) {
	'use strict';

	var html, LanguageSelector, _, index, template, online, interval;

	function resizePrviews() {
		clearInterval(interval);
		interval = setTimeout(function () {
			$('.story-preview').not('.carousel .story-preview').each(function (i, el) {
				//dont apply this to carousel previews
				var $el = $(el);

				$el.css('width', '');
				var width = parseFloat($el.width());

				$el.css('height', 9 / 16 * width + 'px');
			});
		}, 40);
	}

	function StoryPreview(story, launchToEditor) {
		// get the index for this current instance
		this.id = 'story-preview-' + index++;
		this.story = story;
		this.launchToEditor = launchToEditor === true ? true : false;

		// get the html from the template
		var element = template({
			id: this.id,
			story: this.story,
			launchToEditor: this.launchToEditor,
			online: online
		});

		// create the jquery element
		this.$element = $(element);
	}

	return {
		setters: [function (_2) {}, function (_3) {
			html = _3['default'];
		}, function (_4) {
			LanguageSelector = _4['default'];
		}, function (_e) {
			_ = _e['default'];
		}],
		execute: function () {
			index = 0;
			template = _.template(html);
			online = !window.offline;
			interval = 0;
			$(window).resize(resizePrviews);StoryPreview.prototype.appendTo = function (elementOrId) {
				// grab the jquery element
				var $elementOrId = $(typeof elementOrId == 'string' ? '#' + elementOrId : elementOrId);

				// append the story preview element
				$elementOrId.append(this.$element);
				resizePrviews();
				LanguageSelector.updateLanguageDisplay();
			};

			_export('default', StoryPreview);
		}
	};
});

$__System.registerDynamic("17", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register("18", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div id=\"carousel-<%- id %>\" class=\"carousel\">\r\n    <button class=\"carousel-nav left\" > <img class=\"carousel-nav-img\" src = \"../../img/icons/General/icon_Page_Back.svg\" style=\"\"/></button>\r\n    <div class=\"image-holder\" ></div>\r\n    <button class=\"carousel-nav right\"><img class=\"carousel-nav-img\" src = \"../../img/icons/General/icon_Page_Next.svg\" /></button>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register('19', ['e'], function (_export) {
    'use strict';

    var _;

    function ImageHoverSwap(hoverID, imageID, img, imgHover) {
        //add hover event that swaps images
        $(hoverID).hover(function () //mouse enter
        {
            //set source to use hover version
            $(imageID).attr('src', imgHover);
        }, function () //mosue exit
        {
            //set source to use normal version
            $(imageID).attr('src', img);
        });
    }
    return {
        setters: [function (_e) {
            _ = _e['default'];
        }],
        execute: function () {
            _export('default', ImageHoverSwap);
        }
    };
});

$__System.register("1a", ["17", "18", "19", "e"], function (_export) {
    "use strict";

    var html, ImageHoverSwap, _, imageLink, index, numberToShow;

    function createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justImage) {
        if (justImage == true) {
            for (var x = 0; x < pictures.length; x++) {
                var imageTagRepeat = document.createElement("IMG");
                imageTagRepeat.setAttribute("id", "test");
                imageTagRepeat.setAttribute("src", pictures[x].story.coverImage);

                var percentage = 100 / showCount;
                var leftStart = 180 * (percentage / 100) * x;
                imageTagRepeat.style.left = leftStart.toString() + "px";
                imageTagRepeat.style.width = percentage.toString() + "%";

                if (showCount == 1) {
                    imageTagRepeat.style.backgroundColor = "#0098ba";
                } else {
                    imageTagRepeat.style.backgroundColor = "gray";
                }

                holder.appendChild(imageTagRepeat);

                panels[x] = imageTagRepeat;
            }
        } else {
            for (var x = 0; x < pictures.length; x++) {
                var pannel = $("<div class=\"carousel-panel\" style=\"width: " + 100 / showCount + "%\"></div>");

                // var percentage = 100 / showCount;
                // var leftStart = (180 * (percentage / 100)) * x;
                // imageTagRepeat.style.left = leftStart.toString() + "px";
                // imageTagRepeat.style.width = percentage.toString() + "%";
                // $(pictures[x]).attr("width", "100%");

                if (showCount == 1) {
                    // imageTagRepeat.style.paddingLeft = "10px";
                    // imageTagRepeat.style.paddingRight = "10px";

                    // imageTagRepeat.style.height = "600px";
                } else {
                        // imageTagRepeat.style.height = "252px";
                    }
                pannel.append($(pictures[x].$element));

                holder.appendChild(pannel[0]);
                panels[x] = pannel[0];
            }
        }
    }

    function drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, direction, offset, isOverlay) {
        for (var x = 0; x < panels.length; x++) {
            var adjust = 0;
            if (isOverlay) {
                adjust = 0;
            }

            if (x >= startIndex && x <= endIndex) {
                //            $(panels[x]).attr("display", "inline-block");
                panels[x].style.display = "inline-block";
            } else {
                panels[x].style.display = "inline-block";
                //            $(panels[x]).attr("display", "inline-block");
            }
            var amountToTranslate = -100 * offset - adjust;

            if (direction == "right") {
                //           // $(panels[x]).attr("transform", "translateX(" + amountToTranslate + "%)");
                panels[x].style.transform = "translateX(" + amountToTranslate + "%)";
            } else if (direction == "left") {
                //            $(panels[x]).attr("transform", "translateX(" + amountToTranslate + "%)");
                panels[x].style.transform = "translateX(" + amountToTranslate.toString() + "%)";
            } else {}
        }
    }

    function Carousel(id, imageList, showing, justimage, isOverlay, titleText) {
        // this.id = index++;
        //var html = $("#template").html();
        var panelCount;
        var panels = [];
        var pictures = [];
        var identifier;
        var startIndex = 0;
        var endIndex;
        var showCount;
        var holder;
        var offset = 0;
        numberToShow = showing;
        var parent;
        var test = 0;
        endIndex = showing - 1;
        showCount = showing;
        pictures = imageList;

        panelCount = imageList.length;

        identifier = id;

        var template = _.template(html);

        var templateResult = template({
            name: "George",
            second: "Chase",
            image1: imageLink,
            id: index++
        });

        $(id).html(templateResult);

        var tempIndex = index - 1;

        parent = document.getElementById("carousel-" + tempIndex.toString());

        if (showing == 1) {
            $(parent).addClass("single");
        }

        parent.parentElement.style.backgroundColor = "#0098ba";
        //  parent.parentElement.style.paddingLeft = "10%";
        //parent.parentElement.style.paddingRight = "10%";
        // parent.parentElement.style.textAlign = "center";

        holder = parent.querySelector("div");

        var buttonRight = parent.getElementsByClassName("right")[0];

        buttonRight.onclick = function () {
            //$('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).removeAttr('id');
            $('#' + itemsID + " #current").removeAttr('id');
            if (endIndex >= imageList.length - 1) {
                offset = 0;
                startIndex = 0;
                endIndex = startIndex + showing - 1;
            } else {

                offset += showing;
                startIndex = startIndex + showing;
                endIndex = endIndex + showing;
            }

            drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", offset, isOverlay);

            //update indicator
            $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).attr('id', 'current');
        };
        var buttonLeft = parent.getElementsByClassName("left")[0];
        buttonLeft.onclick = function () {
            $('#' + itemsID + " #current").removeAttr('id');

            if (startIndex <= 0) {
                offset = imageList.length - 1;
                startIndex = imageList.length - 1;
                endIndex = imageList.length - 1;
            } else {

                offset -= showing;
                startIndex = startIndex - showing;
                endIndex = endIndex - showing;
            }console.log(offset + " " + startIndex);

            drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "left", offset, isOverlay);

            $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(Math.floor(startIndex / showing)).attr('id', 'current');
        };
        BuildTitle(isOverlay, holder, titleText);
        createPanelList(panels, showCount, startIndex, endIndex, pictures, holder, justimage);
        drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", 0, isOverlay);

        var itemsID = "carousel-" + tempIndex.toString();
        BuildIndexIndicator(isOverlay, holder, panelCount / showing, panels, startIndex, endIndex, showing, offset);
        $('#' + itemsID + ' > .image-holder > .page-indicator > .dots').children().eq(0).attr('id', 'current');

        $('#' + itemsID + " .dots").delegate('div', 'click', function () {
            $('#' + itemsID + " #current").removeAttr('id');
            /*
             $(this).attr('id', 'current');
             startIndex = showing * $(this).index();
             endIndex = startIndex + (showing-1);
             console.log(startIndex);
             offset = parseInt($(this).index()) + panels;
             console.log(offset);
             drawPanels(panels, 0,0,0,0,0,"left",offset,true);
             */
            $(this).attr('id', 'current');
            offset = parseInt($(this).index()) * showing;
            startIndex = showing * $(this).index();

            endIndex = startIndex + showing - 1;

            drawPanels(panels, showCount, startIndex, endIndex, pictures, holder, "right", offset, isOverlay);
        });

        //add special functionality for overlays
        if (isOverlay) {
            //on hover hide title and index indicator
            $(holder).hover(function () {
                $('#' + itemsID + ' > .image-holder > .pageTitle').css('opacity', '0');
            }, function () {
                $('#' + itemsID + ' > .image-holder > .pageTitle').css('opacity', '1');
            });
        }

        //add hover functionality to icons
        ImageHoverSwap(id + " .carousel-nav.left", id + " .carousel-nav.left .carousel-nav-img", "../../img/icons/General/icon_Page_Back.svg", "../../img/icons/General/icon_Page_Back_HoverDown.svg");

        ImageHoverSwap(id + " .carousel-nav.right", id + " .carousel-nav.right .carousel-nav-img", "../../img/icons/General/icon_Page_Next.svg", "../../img/icons/General/icon_Page_Next_HoverDown.svg");
    }

    /*Builds indicator for where in carousel pages user is
    (isOverlay: bool for is this indicator acts as an overlay ontop of carousel items, or exists in the space round items)
    (carouselItemID: html id of the holder for this carousels items)
    (pages: number of pages - should be total items / number showing)
    */
    function BuildIndexIndicator(isOverlay, carouselItemID, pages, panels, startIndex, endIndex, showing, offset) {
        //build html
        var indicatorHTML = "<div class = \"page-indicator";
        if (isOverlay) {
            indicatorHTML += " overlay\">";
        } else {
            indicatorHTML += "\">";

            //give holder tag for a makeover if its not an aoverlay
            $(carouselItemID).addClass("outerIndicator");
        }
        indicatorHTML += "<div class = \"dots\""; // dots bar
        indicatorHTML += "style=\"width: " + pages * 20 + "px;\">"; //size of each dot, multipled by dots
        if (pages > 1) {
            for (var i = 0; i < pages; i++) {
                indicatorHTML += "<div class = \"dot\"> </div>"; //actual dot
            }
        } else {
                $('.carousel-nav').css('visibility', 'hidden');
            }
        indicatorHTML += "</div></div>";

        //add built html to page
        $(carouselItemID).append(indicatorHTML);
        /* var dots = document.getElementsByClassName("dot");
         console.log(dots);
          
         for(var x = 0; x<dots.length;x++){
           var temp = x;
             dots[x].onclick = function(){
                 
                
          
              
             };
         }
         */
    }
    function BuildTitle(isOverlay, carouselItemID, title) {
        //build html
        var indicatorHTML = "<div class = \"pageTitle";
        if (isOverlay) {
            indicatorHTML += " overlay\"><span>" + " " + title + "</span>";
        } else {
            indicatorHTML += "\">" + " " + title;

            //give holder tag for a makeover if its not an aoverlay
            $(carouselItemID).addClass("outerIndicator");
        }

        indicatorHTML += "</div>";

        //add built html to page
        $(carouselItemID).append(indicatorHTML);
    }

    return {
        setters: [function (_2) {}, function (_3) {
            html = _3["default"];
        }, function (_4) {
            ImageHoverSwap = _4["default"];
        }, function (_e) {
            _ = _e["default"];
        }],
        execute: function () {
            imageLink = 'img/carousel/1.jpg';
            index = 0;
            numberToShow = 0;

            _export("default", Carousel);
        }
    };
});

$__System.registerDynamic("1b", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.registerDynamic("1c", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register("1d", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<% defaultText = defaultText ? defaultText : (multiSelect ? '' : (typeof options[0] == 'string' ? options[0] : options[0].label)) %>\r\n<div id=\"<%- id %>\" class=\"custom-select\">\r\n\t<button class=\"custom-select-value\"><%- defaultText %></button>\r\n\t<div class=\"custom-select-options\">\r\n\t\t<% _.each(options, function(option){ %>\r\n\t\t\t<div>\r\n\t\t\t\t<% if(multiSelect){  %>\r\n\t\t\t\t\t<input type=\"checkbox\" value=\"<%- typeof option == 'string' ? option : option.value %>\"><label><%- typeof option == 'string' ? option : option.label %></label>\r\n\t\t\t\t<% } else { %>\r\n\t\t\t\t\t<button value=\"<%- typeof option == 'string' ? option : option.value %>\"><%- typeof option == 'string' ? option : option.label %></button>\r\n\t\t\t\t<% } %>\r\n\t\t\t</div>\r\n\t\t<% }) %>\r\n\t</div>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register('1e', ['1c', 'e', '1d'], function (_export) {
	'use strict';

	var _, html, template;

	function CustomSelect(parentId, settings) {
		var $el = $(template({
			id: settings.id,
			options: settings.options,
			multiSelect: settings.multiSelect,
			defaultText: settings.defaultText || ''
		}));

		$('#' + parentId).append($el);
		var CS = this;

		// Function to handle closing the CustomSelect when clicking outside the element
		var closeOnClick = function closeOnClick(event) {
			if (event.target.closest('.custom-select-options') == null) {
				$el.find('.custom-select-options').hide(200);
				$(document).off('click', closeOnClick);
			}
		};
		$el.find('.custom-select-value').on('click', function () {
			$el.find('.custom-select-options').toggle(200);
			event.stopPropagation();
			$(document).on('click', closeOnClick);
		});

		$el.find('.custom-select-options button').on('click', function (evt) {
			var value = $(evt.currentTarget).val(),
			    label = $(evt.currentTarget).html();

			$el.find('.custom-select-value').html(label);

			CS.value = value;
			$(CS).trigger('change', [value]);

			$el.find('.custom-select-options').hide(200);
		});

		$el.find('.custom-select-options input').on('change', function (evt) {
			var values = [];
			$el.find('input').each(function (i, el) {
				if (el.checked) values.push(el.value);
			});

			CS.values = values;
			$(CS).trigger('change', [values]);
		});
	}

	return {
		setters: [function (_c) {}, function (_e) {
			_ = _e['default'];
		}, function (_d) {
			html = _d['default'];
		}],
		execute: function () {
			template = _.template(html);

			_export('default', CustomSelect);
		}
	};
});

$__System.register("1f", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div id=\"story-viewer\">\r\n\t<div id=\"page-counter\">\r\n\t\t<span id=\"current\">1</span>\r\n\t\t<span id=\"total\"><%- Object.keys(story.data).length + 1 %></span>\r\n\t</div>\r\n\t<div id=\"page-content\">\r\n\t</div>\r\n\t<div id=\"page-controller\">\r\n\t</div>\r\n\t<button id=\"fullscreen-toggle\"></button>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register("20", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div class=\"story-viewer-nav sixth\">\r\n\t<% if(previousPageNumber){ %>\r\n\t\t<button id=\"story-viewer-previous\" class=\"story-viewer-nav-button\" page-dir=\"-1\">\r\n\t\t\t<div class=\"icon <%- previousIcon %>\"></div>\r\n\t\t\t<div class=\"num\"><%- previousPageNumber %></div>\r\n\t\t</button>\r\n\t<% } %>\r\n</div>\r\n<div class=\"story-viewer-page two-thirds\">\r\n\t<% if(currentIcon == 'image'){ %>\r\n\t\t<div id=\"page-overlay\">\r\n\t\t\t<span class=\"icon <%- currentIcon %>\"></span>\r\n\t\t\t<span class=\"num\"><%- currentPageNumber %></span>\r\n\t\t</div>\r\n\t\t<div class=\"image-container\">\r\n\t\t\t<img src=\"<%- page.image %>\" />\r\n\t\t</div>\r\n\t<% } else { %>\r\n\t\t<div class=\"video-container text-open\">\r\n\t\t\t<video src=\"<%- page.video[currentSignLanguage] %>\" controls loop autoplay muted></video>\r\n\t\t</div>\r\n\t\t<div id=\"text-toggle-container\" class=\"text-open\">\r\n\t\t\t<button id=\"text-toggle\"></button>\r\n\t\t</div>\r\n\t\t<div id=\"text-container\" class=\"text-open\">\r\n\t\t\t<%= page.text[currentWrittenLanguage] %>\r\n\t\t</div>\r\n\t<% } %>\r\n</div>\r\n<div class=\"story-viewer-nav sixth\">\r\n\t<% if(nextPageNumber){ %>\r\n\t\t<button id=\"story-viewer-next\" class=\"story-viewer-nav-button\" page-dir=\"1\">\r\n\t\t\t<div class=\"icon <%- nextIcon %>\"></div>\r\n\t\t\t<div class=\"num\"><%- nextPageNumber %></div>\r\n\t\t</button>\r\n\t<% } %>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register("21", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div id=\"glossary-modal\">\r\n\t<div id=\"term-container\">\r\n\t\t<div id=\"media-container\" class=\"third\">\r\n\t\t\t<% if(term.video && term.video[currentSignLanguage]){ %>\r\n\t\t\t\t<div class=\"video-container\">\r\n\t\t\t\t\t<video id=\"glossary-video\" autoplay muted loop src=\"<%- page.video[currentSignLanguage] %>\">\r\n\t\t\t\t\t</video>\r\n\t\t\t\t</div>\r\n\t\t\t<% } %>\r\n\t\t\t<% if(term.image){ %>\r\n\t\t\t\t<div class=\"image-container\">\r\n\t\t\t\t\t<img src=\"<%- term.image %>\">\r\n\t\t\t\t</div>\r\n\t\t\t<% } %>\r\n\t\t</div>\r\n\t\t<div id=\"definition-container\" class=\"two-thirds\">\r\n\t\t\t<h1 id=\"word\"><%- term.name %></h1>\r\n\t\t\t<p id=\"definition\"><%= term.definition %></p>\r\n\t\t</div>\r\n\t\t<button id=\"exit-modal\"></button>\r\n\t</div>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register('22', ['20', '21', '1b', 'e', '1e', '1f'], function (_export) {
	'use strict';

	var pageHtml, glossaryHtml, _, CustomSelect, html, template, pagTemplate, glossaryTemplate, story, page, pageIndex, subPageIndex, currentWrittenLanguage, currentSignLanguage, writtenLang, writtenOptions, signLang, signOptions, textArea, visuals, fullscreen;

	/* ----------------------- Constructor ----------------------- */
	function SetStory(_story) {
		story = _story;
		currentWrittenLanguage = story.metadata.writtenLanguages[0];
		currentSignLanguage = story.metadata.signLanguages[0];
	}

	function Render(id) {
		$('#' + id).html(template({
			story: story
		}));

		$('#fullscreen-toggle').on('click', function (evt) {
			if (document.fullscreen || document.msFullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					/* Firefox */
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					/* Chrome, Safari and Opera */
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) {
					/* IE/Edge */
					document.msExitFullscreen();
				}
			} else {
				var viewer = $('#story-viewer')[0];
				if (viewer.requestFullscreen) {
					viewer.requestFullscreen();
				} else if (viewer.mozRequestFullScreen) {
					/* Firefox */
					viewer.mozRequestFullScreen();
				} else if (viewer.webkitRequestFullscreen) {
					/* Chrome, Safari and Opera */
					viewer.webkitRequestFullscreen();
				} else if (viewer.msRequestFullscreen) {
					/* IE/Edge */
					viewer.msRequestFullscreen();
				}
			}
		});

		var wlSelect = new CustomSelect('page-controller', {
			id: 'written-language-select',
			options: story.metadata.writtenLanguages,
			defaultText: currentWrittenLanguage
		}),
		    slSelect = new CustomSelect('page-controller', {
			id: 'sign-language-select',
			options: story.metadata.signLanguages,
			defaultText: currentSignLanguage
		});

		$(wlSelect).on('change', function (evt, value) {
			currentWrittenLanguage = value;
			RenderPage();
		});
		$(slSelect).on('change', function (evt, value) {
			currentSignLanguage = value;
			RenderPage();
		});

		RenderPage();
	}

	function RenderPage() {
		var currentPageNumber = pageIndex + 2,
		    page = pageIndex == -1 ? { image: story.coverimage } : story.data[pageIndex],
		    maxSubIndex = page.image && page.video ? 1 : 0,
		    previousPage = pageIndex == 0 ? { image: story.coverimage } : story.data[pageIndex - 1],
		    nextPage = story.data[pageIndex + 1];

		var currentIcon = undefined,
		    previousIcon = undefined,
		    previousPageNumber = undefined,
		    nextIcon = undefined,
		    nextPageNumber = undefined;

		if (pageIndex == -1) {
			currentIcon = 'image';
			nextIcon = nextPage.image ? 'image' : 'sign';
			nextPageNumber = 2;
		} else {
			if (subPageIndex != maxSubIndex) {
				currentIcon = 'image';

				previousPageNumber = currentPageNumber - 1;
				previousIcon = previousPage.video ? 'sign' : 'image';

				nextPageNumber = currentPageNumber;
				nextIcon = 'sign';
			} else {
				currentIcon = 'sign';

				previousPageNumber = maxSubIndex == 1 ? currentPageNumber : currentPageNumber - 1;
				previousIcon = maxSubIndex == 1 ? 'image' : previousPage.video ? 'sign' : 'image';

				if (nextPage) {
					nextPageNumber = currentPageNumber + 1;
					nextIcon = nextPage.image ? 'image' : 'sign';
				}
			}
		}

		$('#page-content').html(pagTemplate({
			page: page,
			currentIcon: currentIcon,
			currentPageNumber: currentPageNumber,
			previousIcon: previousIcon,
			previousPageNumber: previousPageNumber,
			nextIcon: nextIcon,
			nextPageNumber: nextPageNumber,
			currentWrittenLanguage: currentWrittenLanguage,
			currentSignLanguage: currentSignLanguage
		}));

		$('#page-counter #current').html(currentPageNumber);

		$('.story-viewer-nav-button').on('click', function (evt) {
			var dir = $(evt.currentTarget).attr('page-dir');

			if (dir > 0) {
				if (subPageIndex == maxSubIndex) {
					pageIndex++;
					subPageIndex = 0;
				} else {
					subPageIndex++;
				}
			} else if (dir < 0) {
				if (subPageIndex == maxSubIndex && maxSubIndex > 0) {
					subPageIndex--;
				} else {
					pageIndex--;
					subPageIndex = previousPage.image && previousPage.video ? 1 : 0;
				}
			}
			RenderPage();
		});

		$('#text-toggle').on('click', function (evt) {
			$('.video-container').toggleClass('text-open');
			$('#text-toggle-container').toggleClass('text-open');
			$('#text-container').toggleClass('text-open');
		});

		GenerateGlossaryButtons(page);
	}

	function GenerateGlossaryButtons(page) {
		if (!page) return;

		var glossaryTerms = page.glossary ? page.glossary[currentWrittenLanguage] : [],
		    text = $('#text-container').html();

		if (!text) return;

		_.each(glossaryTerms, function (term, name) {
			var regEx = new RegExp(name, 'i');
			text = text.replace(regEx, function (match) {
				return '<span class="glossary" glossary-term="' + name + '">' + match + '</span>';
			});
		});

		$('#text-container').html(text);

		//add button functionality
		$('.glossary').on('click', function (evt) {

			//parse data to modal pop up
			var termName = $(evt.currentTarget).attr('glossary-term'),
			    term = glossaryTerms[termName];

			$('#story-viewer').append(glossaryTemplate({
				term: term,
				page: page,
				currentWrittenLanguage: currentWrittenLanguage,
				currentSignLanguage: currentSignLanguage
			}));

			$('#exit-modal').on('click', function (evt) {
				$('#glossary-modal').remove();
			});

			// loop the video between the desired times
			var vid = $('#glossary-video')[0];
			if (vid) {
				vid.ontimeupdate = function () {
					var startTime = term.video[currentSignLanguage].start || 0,
					    endTime = term.video[currentSignLanguage].end || vid.duration;

					if (vid.currentTime < startTime || vid.currentTime > endTime) vid.currentTime = startTime;
				};
			}
		});
	}

	return {
		setters: [function (_2) {
			pageHtml = _2['default'];
		}, function (_3) {
			glossaryHtml = _3['default'];
		}, function (_b) {}, function (_e) {
			_ = _e['default'];
		}, function (_e2) {
			CustomSelect = _e2['default'];
		}, function (_f) {
			html = _f['default'];
		}],
		execute: function () {
			template = _.template(html);
			pagTemplate = _.template(pageHtml);
			glossaryTemplate = _.template(glossaryHtml);

			/* ----------------------- Global Variables ----------------------- */
			story = undefined;
			page = undefined;
			pageIndex = -1;
			subPageIndex = 0;
			currentWrittenLanguage = undefined;
			currentSignLanguage = undefined;
			writtenLang = "English";
			signLang = "fsl_luzon";
			fullscreen = false;

			_export('default', {
				SetStory: SetStory,
				Render: Render
			});
		}
	};
});

$__System.registerDynamic("23", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.registerDynamic('24', [], true, function ($__require, exports, module) {
  /* */
  "format cjs";
  //     Underscore.js 1.9.1
  //     http://underscorejs.org
  //     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  var global = this || self,
      GLOBAL = global;
  (function () {

    // Baseline setup
    // --------------

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this || {};

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;

    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function () {};

    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
      if (obj instanceof _) return obj;
      if (!(this instanceof _)) return new _(obj);
      this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType) {
      if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }

    // Current version.
    _.VERSION = '1.9.1';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function (func, context, argCount) {
      if (context === void 0) return func;
      switch (argCount == null ? 3 : argCount) {
        case 1:
          return function (value) {
            return func.call(context, value);
          };
        // The 2-argument case is omitted because we’re not using it.
        case 3:
          return function (value, index, collection) {
            return func.call(context, value, index, collection);
          };
        case 4:
          return function (accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
      }
      return function () {
        return func.apply(context, arguments);
      };
    };

    var builtinIteratee;

    // An internal function to generate callbacks that can be applied to each
    // element in a collection, returning the desired result — either `identity`,
    // an arbitrary callback, a property matcher, or a property accessor.
    var cb = function (value, context, argCount) {
      if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
      if (value == null) return _.identity;
      if (_.isFunction(value)) return optimizeCb(value, context, argCount);
      if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
      return _.property(value);
    };

    // External wrapper for our callback generator. Users may customize
    // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
    // This abstraction hides the internal-only argCount argument.
    _.iteratee = builtinIteratee = function (value, context) {
      return cb(value, context, Infinity);
    };

    // Some functions take a variable number of arguments, or a few expected
    // arguments at the beginning and then a variable number of values to operate
    // on. This helper accumulates all remaining arguments past the function’s
    // argument length (or an explicit `startIndex`), into an array that becomes
    // the last argument. Similar to ES6’s "rest parameter".
    var restArguments = function (func, startIndex) {
      startIndex = startIndex == null ? func.length - 1 : +startIndex;
      return function () {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
          rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
          case 0:
            return func.call(this, rest);
          case 1:
            return func.call(this, arguments[0], rest);
          case 2:
            return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
          args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
      };
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function (prototype) {
      if (!_.isObject(prototype)) return {};
      if (nativeCreate) return nativeCreate(prototype);
      Ctor.prototype = prototype;
      var result = new Ctor();
      Ctor.prototype = null;
      return result;
    };

    var shallowProperty = function (key) {
      return function (obj) {
        return obj == null ? void 0 : obj[key];
      };
    };

    var has = function (obj, path) {
      return obj != null && hasOwnProperty.call(obj, path);
    };

    var deepGet = function (obj, path) {
      var length = path.length;
      for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
      }
      return length ? obj : void 0;
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object.
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = shallowProperty('length');
    var isArrayLike = function (collection) {
      var length = getLength(collection);
      return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function (obj, iteratee, context) {
      iteratee = optimizeCb(iteratee, context);
      var i, length;
      if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
          iteratee(obj[i], i, obj);
        }
      } else {
        var keys = _.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
          iteratee(obj[keys[i]], keys[i], obj);
        }
      }
      return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function (obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          results = Array(length);
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
    };

    // Create a reducing function iterating left or right.
    var createReduce = function (dir) {
      // Wrap code that reassigns argument variables in a separate function than
      // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
      var reducer = function (obj, iteratee, memo, initial) {
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            index = dir > 0 ? 0 : length - 1;
        if (!initial) {
          memo = obj[keys ? keys[index] : index];
          index += dir;
        }
        for (; index >= 0 && index < length; index += dir) {
          var currentKey = keys ? keys[index] : index;
          memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
      };

      return function (obj, iteratee, memo, context) {
        var initial = arguments.length >= 3;
        return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
      };
    };

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);

    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
      var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
      var key = keyFinder(obj, predicate, context);
      if (key !== void 0 && key !== -1) return obj[key];
    };

    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
      var results = [];
      predicate = cb(predicate, context);
      _.each(obj, function (value, index, list) {
        if (predicate(value, index, list)) results.push(value);
      });
      return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
      return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length;
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        if (!predicate(obj[currentKey], currentKey, obj)) return false;
      }
      return true;
    };

    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function (obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length;
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
      }
      return false;
    };

    // Determine if the array or object contains a given item (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      if (typeof fromIndex != 'number' || guard) fromIndex = 0;
      return _.indexOf(obj, item, fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = restArguments(function (obj, path, args) {
      var contextPath, func;
      if (_.isFunction(path)) {
        func = path;
      } else if (_.isArray(path)) {
        contextPath = path.slice(0, -1);
        path = path[path.length - 1];
      }
      return _.map(obj, function (context) {
        var method = func;
        if (!method) {
          if (contextPath && contextPath.length) {
            context = deepGet(context, contextPath);
          }
          if (context == null) return void 0;
          method = context[path];
        }
        return method == null ? method : method.apply(context, args);
      });
    });

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
      return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
      return _.filter(obj, _.matcher(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
      return _.find(obj, _.matcher(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function (obj, iteratee, context) {
      var result = -Infinity,
          lastComputed = -Infinity,
          value,
          computed;
      if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = isArrayLike(obj) ? obj : _.values(obj);
        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value != null && value > result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        _.each(obj, function (v, index, list) {
          computed = iteratee(v, index, list);
          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = v;
            lastComputed = computed;
          }
        });
      }
      return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function (obj, iteratee, context) {
      var result = Infinity,
          lastComputed = Infinity,
          value,
          computed;
      if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = isArrayLike(obj) ? obj : _.values(obj);
        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value != null && value < result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        _.each(obj, function (v, index, list) {
          computed = iteratee(v, index, list);
          if (computed < lastComputed || computed === Infinity && result === Infinity) {
            result = v;
            lastComputed = computed;
          }
        });
      }
      return result;
    };

    // Shuffle a collection.
    _.shuffle = function (obj) {
      return _.sample(obj, Infinity);
    };

    // Sample **n** random values from a collection using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
      if (n == null || guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        return obj[_.random(obj.length - 1)];
      }
      var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
      var length = getLength(sample);
      n = Math.max(Math.min(n, length), 0);
      var last = length - 1;
      for (var index = 0; index < n; index++) {
        var rand = _.random(index, last);
        var temp = sample[index];
        sample[index] = sample[rand];
        sample[rand] = temp;
      }
      return sample.slice(0, n);
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function (obj, iteratee, context) {
      var index = 0;
      iteratee = cb(iteratee, context);
      return _.pluck(_.map(obj, function (value, key, list) {
        return {
          value: value,
          index: index++,
          criteria: iteratee(value, key, list)
        };
      }).sort(function (left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index - right.index;
      }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function (behavior, partition) {
      return function (obj, iteratee, context) {
        var result = partition ? [[], []] : {};
        iteratee = cb(iteratee, context);
        _.each(obj, function (value, index) {
          var key = iteratee(value, index, obj);
          behavior(result, value, key);
        });
        return result;
      };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, value, key) {
      if (has(result, key)) result[key].push(value);else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, value, key) {
      result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, value, key) {
      if (has(result, key)) result[key]++;else result[key] = 1;
    });

    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
      if (!obj) return [];
      if (_.isArray(obj)) return slice.call(obj);
      if (_.isString(obj)) {
        // Keep surrogate pair characters together
        return obj.match(reStrSymbol);
      }
      if (isArrayLike(obj)) return _.map(obj, _.identity);
      return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function (obj) {
      if (obj == null) return 0;
      return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = group(function (result, value, pass) {
      result[pass ? 0 : 1].push(value);
    }, true);

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
      if (array == null || array.length < 1) return n == null ? void 0 : [];
      if (n == null || guard) return array[0];
      return _.initial(array, array.length - n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function (array, n, guard) {
      return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function (array, n, guard) {
      if (array == null || array.length < 1) return n == null ? void 0 : [];
      if (n == null || guard) return array[array.length - 1];
      return _.rest(array, Math.max(0, array.length - n));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function (array, n, guard) {
      return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function (array) {
      return _.filter(array, Boolean);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, strict, output) {
      output = output || [];
      var idx = output.length;
      for (var i = 0, length = getLength(input); i < length; i++) {
        var value = input[i];
        if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
          // Flatten current level of array or arguments object.
          if (shallow) {
            var j = 0,
                len = value.length;
            while (j < len) output[idx++] = value[j++];
          } else {
            flatten(value, shallow, strict, output);
            idx = output.length;
          }
        } else if (!strict) {
          output[idx++] = value;
        }
      }
      return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
      return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = restArguments(function (array, otherArrays) {
      return _.difference(array, otherArrays);
    });

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // The faster algorithm will not work with an iteratee if the iteratee
    // is not a one-to-one function, so providing an iteratee will disable
    // the faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
      if (!_.isBoolean(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
      }
      if (iteratee != null) iteratee = cb(iteratee, context);
      var result = [];
      var seen = [];
      for (var i = 0, length = getLength(array); i < length; i++) {
        var value = array[i],
            computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted && !iteratee) {
          if (!i || seen !== computed) result.push(value);
          seen = computed;
        } else if (iteratee) {
          if (!_.contains(seen, computed)) {
            seen.push(computed);
            result.push(value);
          }
        } else if (!_.contains(result, value)) {
          result.push(value);
        }
      }
      return result;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = restArguments(function (arrays) {
      return _.uniq(flatten(arrays, true, true));
    });

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
      var result = [];
      var argsLength = arguments.length;
      for (var i = 0, length = getLength(array); i < length; i++) {
        var item = array[i];
        if (_.contains(result, item)) continue;
        var j;
        for (j = 1; j < argsLength; j++) {
          if (!_.contains(arguments[j], item)) break;
        }
        if (j === argsLength) result.push(item);
      }
      return result;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = restArguments(function (array, rest) {
      rest = flatten(rest, true, true);
      return _.filter(array, function (value) {
        return !_.contains(rest, value);
      });
    });

    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices.
    _.unzip = function (array) {
      var length = array && _.max(array, getLength).length || 0;
      var result = Array(length);

      for (var index = 0; index < length; index++) {
        result[index] = _.pluck(array, index);
      }
      return result;
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = restArguments(_.unzip);

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values. Passing by pairs is the reverse of _.pairs.
    _.object = function (list, values) {
      var result = {};
      for (var i = 0, length = getLength(list); i < length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    };

    // Generator function to create the findIndex and findLastIndex functions.
    var createPredicateIndexFinder = function (dir) {
      return function (array, predicate, context) {
        predicate = cb(predicate, context);
        var length = getLength(array);
        var index = dir > 0 ? 0 : length - 1;
        for (; index >= 0 && index < length; index += dir) {
          if (predicate(array[index], index, array)) return index;
        }
        return -1;
      };
    };

    // Returns the first index on an array-like that passes a predicate test.
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iteratee, context) {
      iteratee = cb(iteratee, context, 1);
      var value = iteratee(obj);
      var low = 0,
          high = getLength(array);
      while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
      }
      return low;
    };

    // Generator function to create the indexOf and lastIndexOf functions.
    var createIndexFinder = function (dir, predicateFind, sortedIndex) {
      return function (array, item, idx) {
        var i = 0,
            length = getLength(array);
        if (typeof idx == 'number') {
          if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
          } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
          }
        } else if (sortedIndex && idx && length) {
          idx = sortedIndex(array, item);
          return array[idx] === item ? idx : -1;
        }
        if (item !== item) {
          idx = predicateFind(slice.call(array, i, length), _.isNaN);
          return idx >= 0 ? idx + i : -1;
        }
        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          if (array[idx] === item) return idx;
        }
        return -1;
      };
    };

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
      if (stop == null) {
        stop = start || 0;
        start = 0;
      }
      if (!step) {
        step = stop < start ? -1 : 1;
      }

      var length = Math.max(Math.ceil((stop - start) / step), 0);
      var range = Array(length);

      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
      }

      return range;
    };

    // Chunk a single array into multiple arrays, each containing `count` or fewer
    // items.
    _.chunk = function (array, count) {
      if (count == null || count < 1) return [];
      var result = [];
      var i = 0,
          length = array.length;
      while (i < length) {
        result.push(slice.call(array, i, i += count));
      }
      return result;
    };

    // Function (ahem) Functions
    // ------------------

    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments.
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
      if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
      var self = baseCreate(sourceFunc.prototype);
      var result = sourceFunc.apply(self, args);
      if (_.isObject(result)) return result;
      return self;
    };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = restArguments(function (func, context, args) {
      if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
      var bound = restArguments(function (callArgs) {
        return executeBound(func, bound, context, this, args.concat(callArgs));
      });
      return bound;
    });

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder by default, allowing any combination of arguments to be
    // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
    _.partial = restArguments(function (func, boundArgs) {
      var placeholder = _.partial.placeholder;
      var bound = function () {
        var position = 0,
            length = boundArgs.length;
        var args = Array(length);
        for (var i = 0; i < length; i++) {
          args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
        }
        while (position < arguments.length) args.push(arguments[position++]);
        return executeBound(func, bound, this, this, args);
      };
      return bound;
    });

    _.partial.placeholder = _;

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = restArguments(function (obj, keys) {
      keys = flatten(keys, false, false);
      var index = keys.length;
      if (index < 1) throw new Error('bindAll must be passed function names');
      while (index--) {
        var key = keys[index];
        obj[key] = _.bind(obj[key], obj);
      }
    });

    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
      var memoize = function (key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!has(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
      };
      memoize.cache = {};
      return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = restArguments(function (func, wait, args) {
      return setTimeout(function () {
        return func.apply(null, args);
      }, wait);
    });

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
      var timeout, context, args, result;
      var previous = 0;
      if (!options) options = {};

      var later = function () {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };

      var throttled = function () {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };

      throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
      };

      return throttled;
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
      var timeout, result;

      var later = function (context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
      };

      var debounced = restArguments(function (args) {
        if (timeout) clearTimeout(timeout);
        if (immediate) {
          var callNow = !timeout;
          timeout = setTimeout(later, wait);
          if (callNow) result = func.apply(this, args);
        } else {
          timeout = _.delay(later, wait, this, args);
        }

        return result;
      });

      debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
      };

      return debounced;
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
      return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function (predicate) {
      return function () {
        return !predicate.apply(this, arguments);
      };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
      var args = arguments;
      var start = args.length - 1;
      return function () {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--) result = args[i].call(this, result);
        return result;
      };
    };

    // Returns a function that will only be executed on and after the Nth call.
    _.after = function (times, func) {
      return function () {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    };

    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function (times, func) {
      var memo;
      return function () {
        if (--times > 0) {
          memo = func.apply(this, arguments);
        }
        if (times <= 1) func = null;
        return memo;
      };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);

    _.restArguments = restArguments;

    // Object Functions
    // ----------------

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    var collectNonEnumProps = function (obj, keys) {
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;
      var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

      // Constructor is a special case.
      var prop = 'constructor';
      if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
          keys.push(prop);
        }
      }
    };

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    _.keys = function (obj) {
      if (!_.isObject(obj)) return [];
      if (nativeKeys) return nativeKeys(obj);
      var keys = [];
      for (var key in obj) if (has(obj, key)) keys.push(key);
      // Ahem, IE < 9.
      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    };

    // Retrieve all the property names of an object.
    _.allKeys = function (obj) {
      if (!_.isObject(obj)) return [];
      var keys = [];
      for (var key in obj) keys.push(key);
      // Ahem, IE < 9.
      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function (obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var values = Array(length);
      for (var i = 0; i < length; i++) {
        values[i] = obj[keys[i]];
      }
      return values;
    };

    // Returns the results of applying the iteratee to each element of the object.
    // In contrast to _.map it returns an object.
    _.mapObject = function (obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      var keys = _.keys(obj),
          length = keys.length,
          results = {};
      for (var index = 0; index < length; index++) {
        var currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
    };

    // Convert an object into a list of `[key, value]` pairs.
    // The opposite of _.object.
    _.pairs = function (obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var pairs = Array(length);
      for (var i = 0; i < length; i++) {
        pairs[i] = [keys[i], obj[keys[i]]];
      }
      return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
      var result = {};
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        result[obj[keys[i]]] = keys[i];
      }
      return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`.
    _.functions = _.methods = function (obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
    };

    // An internal function for creating assigner functions.
    var createAssigner = function (keysFunc, defaults) {
      return function (obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
          var source = arguments[index],
              keys = keysFunc(source),
              l = keys.length;
          for (var i = 0; i < l; i++) {
            var key = keys[i];
            if (!defaults || obj[key] === void 0) obj[key] = source[key];
          }
        }
        return obj;
      };
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);

    // Assigns a given object with all the own properties in the passed-in object(s).
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);

    // Returns the first key on an object that passes a predicate test.
    _.findKey = function (obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = _.keys(obj),
          key;
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (predicate(obj[key], key, obj)) return key;
      }
    };

    // Internal pick helper function to determine if `obj` has key `key`.
    var keyInObj = function (value, key, obj) {
      return key in obj;
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = restArguments(function (obj, keys) {
      var result = {},
          iteratee = keys[0];
      if (obj == null) return result;
      if (_.isFunction(iteratee)) {
        if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
        keys = _.allKeys(obj);
      } else {
        iteratee = keyInObj;
        keys = flatten(keys, false, false);
        obj = Object(obj);
      }
      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i];
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
      return result;
    });

    // Return a copy of the object without the blacklisted properties.
    _.omit = restArguments(function (obj, keys) {
      var iteratee = keys[0],
          context;
      if (_.isFunction(iteratee)) {
        iteratee = _.negate(iteratee);
        if (keys.length > 1) context = keys[1];
      } else {
        keys = _.map(flatten(keys, false, false), String);
        iteratee = function (value, key) {
          return !_.contains(keys, key);
        };
      }
      return _.pick(obj, iteratee, context);
    });

    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);

    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function (prototype, props) {
      var result = baseCreate(prototype);
      if (props) _.extendOwn(result, props);
      return result;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
      if (!_.isObject(obj)) return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
      interceptor(obj);
      return obj;
    };

    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function (object, attrs) {
      var keys = _.keys(attrs),
          length = keys.length;
      if (object == null) return !length;
      var obj = Object(object);
      for (var i = 0; i < length; i++) {
        var key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };

    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    eq = function (a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b) return a !== 0 || 1 / a === 1 / b;
      // `null` or `undefined` only equal to itself (strict comparison).
      if (a == null || b == null) return false;
      // `NaN`s are equivalent, but non-reflexive.
      if (a !== a) return b !== b;
      // Exhaust primitive checks
      var type = typeof a;
      if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
      return deepEq(a, b, aStack, bStack);
    };

    // Internal recursive comparison function for `isEqual`.
    deepEq = function (a, b, aStack, bStack) {
      // Unwrap any wrapped objects.
      if (a instanceof _) a = a._wrapped;
      if (b instanceof _) b = b._wrapped;
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className !== toString.call(b)) return false;
      switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return '' + a === '' + b;
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive.
          // Object(NaN) is equivalent to NaN.
          if (+a !== +a) return +b !== +b;
          // An `egal` comparison is performed for other numeric values.
          return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a === +b;
        case '[object Symbol]':
          return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      }

      var areArrays = className === '[object Array]';
      if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor,
            bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
          return false;
        }
      }
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

      // Initializing stack of traversed objects.
      // It's done here since we only need them for objects and arrays comparison.
      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
      }

      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);

      // Recursively compare objects and arrays.
      if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
          if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
      } else {
        // Deep compare objects.
        var keys = _.keys(a),
            key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (_.keys(b).length !== length) return false;
        while (length--) {
          // Deep compare each member
          key = keys[length];
          if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();
      return true;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
      return eq(a, b);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
      if (obj == null) return true;
      if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
      return _.keys(obj).length === 0;
    };

    // Is a given value a DOM element?
    _.isElement = function (obj) {
      return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
      return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function (obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
      _['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']';
      };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
      _.isArguments = function (obj) {
        return has(obj, 'callee');
      };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
    var nodelist = root.document && root.document.childNodes;
    if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
      _.isFunction = function (obj) {
        return typeof obj == 'function' || false;
      };
    }

    // Is a given object a finite number?
    _.isFinite = function (obj) {
      return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`?
    _.isNaN = function (obj) {
      return _.isNumber(obj) && isNaN(obj);
    };

    // Is a given value a boolean?
    _.isBoolean = function (obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function (obj) {
      return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function (obj) {
      return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, path) {
      if (!_.isArray(path)) {
        return has(obj, path);
      }
      var length = path.length;
      for (var i = 0; i < length; i++) {
        var key = path[i];
        if (obj == null || !hasOwnProperty.call(obj, key)) {
          return false;
        }
        obj = obj[key];
      }
      return !!length;
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
      root._ = previousUnderscore;
      return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function (value) {
      return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function (value) {
      return function () {
        return value;
      };
    };

    _.noop = function () {};

    // Creates a function that, when passed an object, will traverse that object’s
    // properties down the given `path`, specified as an array of keys or indexes.
    _.property = function (path) {
      if (!_.isArray(path)) {
        return shallowProperty(path);
      }
      return function (obj) {
        return deepGet(obj, path);
      };
    };

    // Generates a function for a given object that returns a given property.
    _.propertyOf = function (obj) {
      if (obj == null) {
        return function () {};
      }
      return function (path) {
        return !_.isArray(path) ? obj[path] : deepGet(obj, path);
      };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function (attrs) {
      attrs = _.extendOwn({}, attrs);
      return function (obj) {
        return _.isMatch(obj, attrs);
      };
    };

    // Run a function **n** times.
    _.times = function (n, iteratee, context) {
      var accum = Array(Math.max(0, n));
      iteratee = optimizeCb(iteratee, context, 1);
      for (var i = 0; i < n; i++) accum[i] = iteratee(i);
      return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () {
      return new Date().getTime();
    };

    // List of HTML entities for escaping.
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function (map) {
      var escaper = function (match) {
        return map[match];
      };
      // Regexes for identifying a key that needs to be escaped.
      var source = '(?:' + _.keys(map).join('|') + ')';
      var testRegexp = RegExp(source);
      var replaceRegexp = RegExp(source, 'g');
      return function (string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // Traverses the children of `obj` along `path`. If a child is a function, it
    // is invoked with its parent as context. Returns the value of the final
    // child, or `fallback` if any child is undefined.
    _.result = function (obj, path, fallback) {
      if (!_.isArray(path)) path = [path];
      var length = path.length;
      if (!length) {
        return _.isFunction(fallback) ? fallback.call(obj) : fallback;
      }
      for (var i = 0; i < length; i++) {
        var prop = obj == null ? void 0 : obj[path[i]];
        if (prop === void 0) {
          prop = fallback;
          i = length; // Ensure we don't continue iterating.
        }
        obj = _.isFunction(prop) ? prop.call(obj) : prop;
      }
      return obj;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'": "'",
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };

    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function (match) {
      return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function (text, settings, oldSettings) {
      if (!settings && oldSettings) settings = oldSettings;
      settings = _.defaults({}, settings, _.templateSettings);

      // Combine delimiters into one regular expression via alternation.
      var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;

        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }

        // Adobe VMs need the match returned to produce the correct offset.
        return match;
      });
      source += "';\n";

      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

      source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

      var render;
      try {
        render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }

      var template = function (data) {
        return render.call(this, data, _);
      };

      // Provide the compiled source as a convenience for precompilation.
      var argument = settings.variable || 'obj';
      template.source = 'function(' + argument + '){\n' + source + '}';

      return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function (obj) {
      var instance = _(obj);
      instance._chain = true;
      return instance;
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var chainResult = function (instance, obj) {
      return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
      _.each(_.functions(obj), function (name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function () {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return chainResult(this, func.apply(_, args));
        };
      });
      return _;
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
      var method = ArrayProto[name];
      _.prototype[name] = function () {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
        return chainResult(this, obj);
      };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function (name) {
      var method = ArrayProto[name];
      _.prototype[name] = function () {
        return chainResult(this, method.apply(this._wrapped, arguments));
      };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
      return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
      return String(this._wrapped);
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof undefined == 'function' && define.amd) {
      define('underscore', [], function () {
        return _;
      });
    }
  })();
});
$__System.registerDynamic("e", ["24"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("24");
});
$__System.register('25', ['23', 'e'], function (_export) {
	'use strict';

	var _, selectedPage, maxPage, storiesDiv, thisID;

	/*
  Add stories to the grid and apply pagination if needed
  No default sorting applied in this function, stories are shown in order they first entered the database, i.e. Date first created
  
  stories - a list of story previews either raw from the database, or filtered and/or sorted
  */
	function addStories(stories) {
		var childrenCount = document.getElementById(storiesDiv).childElementCount;
		var countNode = 0;
		var newDiv;
		var pageNum = 0;
		for (var index in stories) {
			// Only 9 stories per page
			if (index % 9 == 0) {
				pageNum++;
				newDiv = document.createElement("div");
				newDiv.id = 'grid-page' + pageNum;
				$(newDiv).addClass("grid-page");
				// Handles multiple pages
				if (pageNum > 1) {
					$(newDiv).addClass("grid-page");
					newDiv.style.transform = "translateX(100vw)";
					var gridButton;
					var gridButtons;
					// Creates pagination only if it doesn't exist already
					if (pageNum == 2) {
						gridButtons = document.createElement("div");
						gridButtons.id = "grid-buttons";
						$('#' + storiesDiv).append(gridButtons);
						gridButton = document.createElement("button");
						$(gridButton).attr("type", "button");
						$(gridButton).addClass("grid-button");
						$(gridButton).addClass("grid-button-selected");
						gridButton.innerHTML = "1";
						gridButton.id = "grid-" + 1 + "-button";
						gridButton.addEventListener("click", swapGridPage);
						$(gridButtons).append(gridButton);
						// Previous button
						gridButton = document.createElement("button");
						$(gridButton).attr("type", "button");
						gridButton.id = "grid-prev-button";
						gridButton.addEventListener("click", swapGridPage);
						$(gridButtons).prepend(gridButton);
					}
					// Handle page numbers when pagination exists already
					gridButton = document.createElement("button");
					$(gridButton).attr("type", "button");
					$(gridButton).addClass("grid-button");
					gridButton.innerHTML = pageNum;
					gridButton.id = "grid-" + pageNum + "-button";
					gridButton.addEventListener("click", swapGridPage);
					$(gridButtons).append(gridButton);
				}
				$('#' + storiesDiv).append(newDiv);
			}
			stories[index].appendTo(newDiv.id);
		}
		// Next button
		gridButton = document.createElement("button");
		$(gridButton).attr("type", "image");
		$(gridButton).attr("src", "img/icons/General/icon_Page_Next.svg");
		gridButton.id = "grid-next-button";
		gridButton.innerHTML = "";
		gridButton.addEventListener("click", swapGridPage);
		$(gridButtons).append(gridButton);
		maxPage = pageNum;
		// Timeout to make sure elements have been populated
		setTimeout(function () {
			resizeStories();
		}, 100);
	}

	function swapGridPage(event) {
		var targetPage;
		// Test for next and previous buttons
		if (event.target.id == "grid-prev-button") {
			targetPage = selectedPage - 1;
		} else if (event.target.id == "grid-next-button") {
			targetPage = selectedPage + 1;
		} else {
			targetPage = parseInt(event.target.id.match(/\d+/g));
		}
		// Return if button clicked was same page you are on
		if (targetPage === selectedPage) {
			return;
		}
		// Apply animations for page change
		if (targetPage > selectedPage) {
			document.getElementById('grid-page' + selectedPage).style.animationName = 'gridLeftFadeOut';
			document.getElementById('grid-page' + targetPage).style.animationName = 'gridLeftFadeIn';
			$(".grid-button:nth-child(" + (selectedPage + 1) + ")").removeClass("grid-button-selected");
			selectedPage = targetPage;
			$(".grid-button:nth-child(" + (selectedPage + 1) + ")").addClass("grid-button-selected");
		} else {
			document.getElementById('grid-page' + selectedPage).style.animationName = 'gridRightFadeOut';
			document.getElementById('grid-page' + targetPage).style.animationName = 'gridRightFadeIn';
			$(".grid-button:nth-child(" + (selectedPage + 1) + ")").removeClass("grid-button-selected");
			selectedPage = targetPage;
			$(".grid-button:nth-child(" + (selectedPage + 1) + ")").addClass("grid-button-selected");
		}
		// Take care of next and previous buttons
		if (selectedPage === 1) {
			$("#grid-prev-button").css("visibility", "hidden");
		} else {
			$("#grid-prev-button").css("visibility", "visible");
		}

		if (selectedPage === maxPage) {
			$("#grid-next-button").css("visibility", "hidden");
		} else {
			$("#grid-next-button").css("visibility", "visible");
		}
	}

	// For resizing the stories div
	function resizeStories() {
		// Timeout to make sure elements have been populated
		setTimeout(function () {
			var height = $('#grid-page1').height();
			$('#' + storiesDiv).css('height', height + 40 + 'px');
		}, 100);
	}
	/*
 Builds out grid of story previews for web pages that already have a div that will contain this grid
 
 id - element ID of element on the page to build the grid into
 stories - list of story previews that will be displayed
 */
	function StoryGrid(id, stories) {
		thisID = id;
		storiesDiv = id;
		if (stories[0] == null) {
			return;
		}
		// Add stories to grid, calculate and setup pagination
		addStories(stories);

		// Resize div for stories and pagination
		$(window).off('.storygrid');
		$(window).on('resize.storygrid', resizeStories);
	}

	// After filtering or sorting, create a new story grid with the correct story previews displayed
	return {
		setters: [function (_2) {}, function (_e) {
			_ = _e['default'];
		}],
		execute: function () {
			selectedPage = 1;
			maxPage = -1;
			thisID = '';
			StoryGrid.prototype.update = function (stories) {
				$('#' + storiesDiv).html("");
				selectedPage = 1;
				maxPage = -1;
				StoryGrid(storiesDiv, stories);
			};

			StoryGrid.prototype.getId = function () {
				return thisID;
			};

			_export('default', StoryGrid);
		}
	};
});

$__System.register("26", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<% if(story){ %>\r\n\t<div id=\"viewer\">\r\n\t</div>\r\n\t<div id=\"details\">\r\n\t\t<div id=\"title\">\r\n\t\t\t<% _.each(story.metadata.title, function(title, lang){ %>\r\n\t\t\t\t<span lang=\"<%- lang %>\"><%- title %></span>\r\n\t\t\t<% }) %>\r\n\t\t</div>\r\n\t\t<div id=\"author\"><%- story.author %></div>\r\n\t\t<% if(online){ %>\r\n\t\t\t<div id=\"social\">\r\n\t\t\t\t<button id=\"social-views\" class=\"social\">Views <span id=\"views\"><%- story.metadata.views %></span></button>\r\n\t\t\t\t<button id=\"social-likes\" class=\"social\">Likes <span id=\"likes\"><%- story.metadata.likes %></span></button>\r\n\t\t\t\t<button id=\"social-save\" class=\"social socialExport\">Save</button>\r\n\t\t\t\t<button id=\"social-share\" class=\"social socialExport\">Share</button>\r\n\t\t\t</div>\r\n\t\t<% } %>\r\n\t\t<div id=\"description\">\r\n\t\t\t<% _.each(story.metadata.description, function(description, lang){ %>\r\n\t\t\t\t<span lang=\"<%- lang %>\"><%- description %></span>\r\n\t\t\t<% }) %>\r\n\t\t</div>\r\n\t\t<div id=\"genres\" class=\"metadata-list\"> Genres:\r\n\t\t\t<% _.each(story.metadata.genres, function(genreList, lang){ %>\r\n\t\t\t\t<span lang=\"<%- lang %>\">\r\n\t\t\t\t\t<% _.each(genreList, function(genre){ %>\r\n\t\t\t\t\t\t<% if(online){ %>\r\n\t\t\t\t\t\t\t<a class=\"genre\" href=\"./Search?search=<%- genre %>\"><%- genre %></a>\r\n\t\t\t\t\t\t<% } else{ %>\r\n\t\t\t\t\t\t\t<span class=\"genre\"><%- genre %></span>\r\n\t\t\t\t\t\t<% } %>\r\n\t\t\t\t\t<% }) %>\r\n\t\t\t\t</span>\r\n\t\t\t<% }) %>\r\n\t\t</div>\r\n\t\t<div id=\"tags\" class=\"metadata-list\"> Tags:\r\n\t\t\t<% _.each(story.metadata.tags, function(tagList, lang){ %>\r\n\t\t\t\t<span lang=\"<%- lang %>\">\r\n\t\t\t\t\t<% _.each(tagList, function(tag){ %>\r\n\t\t\t\t\t\t<% if(online){ %>\r\n\t\t\t\t\t\t\t<a class=\"tag\" href=\"./Search?search=<%- tag %>\">#<%- tag %></a>\r\n\t\t\t\t\t\t<% } else{ %>\r\n\t\t\t\t\t\t\t<span class=\"tag\">#<%- tag %></span>\r\n\t\t\t\t\t\t<% } %>\r\n\t\t\t\t\t<% }) %>\r\n\t\t\t\t</span>\r\n\t\t\t<% }) %>\r\n\t\t</div>\r\n\t</div>\r\n<% } %>\r\n\r\n<% if(online){ %>\r\n\t<div id=\"more-author\"></div>\r\n\t<div id=\"more-stories\"></div>\r\n<% } else { %>\r\n\t<div id=\"offline-stories-title\">Offline Stories</div>\r\n\t<div id=\"offline-stories\"></div>\r\n<% } %>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register('a', ['15', '16', '22', '25', '26', 'b', 'c', 'e', 'd', 'f', '1a'], function (_export) {
	'use strict';

	var LanguageSelector, StoryPreview, StoryViewer, StoryGrid, html, _, OfflineWorker, urlParams, Carousel, template, OFFLINEPAGEASSETS, storyId, story, liked, offlineIds;

	function displaySimilarGenres(stories) {
		var similarGenreStories = [],
		    lang = LanguageSelector.currentLanguageText();

		_.each(story.metadata.genres[lang], function (genre) {
			_.each(stories, function (_story) {
				if (_story.added) return;

				var added = false;
				_.each(_story.metadata.genres[lang], function (_genre) {
					if (_genre == genre && _story.id != story.id) added = true;
				});

				_story.added = added;
				if (added) similarGenreStories.push(new StoryPreview(_story));
			});
		});

		if (similarGenreStories.length > 0) {
			$('#more-stories').show();
			new Carousel('#more-stories', similarGenreStories, 4, false, false, 'Similar Stories');
		} else {
			$('#more-stories').hide();
		}
	}

	function getStoryAssetList() {

		var AddToList = function AddToList(objOrString, currentList) {
			if (typeof objOrString == 'string') {
				if (currentList.indexOf(objOrString) == -1 && objOrString.match(/\.[a-z0-9]{3,4}$|\.[a-z0-9]{3,4}?[0-9]*$/gi)) {
					currentList.push(objOrString);
				}

				return currentList;
			} else if (typeof objOrString == 'object') {
				_.each(objOrString, function (obj, fieldName) {
					if (fieldName == 'datecreated' || fieldName == 'datemodified') return;
					AddToList(obj, currentList);
				});

				return currentList;
			}
		};

		var assetList = AddToList(story, []);
		return assetList;
	}

	function showStory() {
		var online = !window.offline;

		// add the main html to the page
		$('main').html(template({
			story: story,
			online: online
		}));

		if (story) {
			// Render the story viewer
			StoryViewer.SetStory(story);
			StoryViewer.Render('viewer');
		}

		LanguageSelector.updateLanguageDisplay();

		// We dont need the rest of the functions if this is the offline mode
		if (!online) {
			showOfflineStories();
			return;
		}

		var assetList = OfflineWorker.AddToAssetList('Viewer', OFFLINEPAGEASSETS);
		OfflineWorker.SaveServiceWorker('/html/Client/ViewerOffline.html', assetList);

		// add a view to the counter
		$.ajax({
			method: 'post',
			url: '/api/story/view',
			data: {
				id: story.id
			}
		});

		// like button function
		$('#social-likes').on('click', function () {
			if (liked) return;

			liked = true;

			$.ajax({
				method: 'post',
				url: '/api/story/like',
				data: {
					id: story.id
				}
			}).done(function (stories) {
				$('#likes').html(story.metadata.likes + 1);
			}).fail(function (err) {
				console.error(err);
			});
		});

		// Share button function
		$('#social-share').on('click', function (evt) {
			var copyInput = $('<input type="text" style="position: absolute; z-index: -1" value="' + window.location.href + '" />');

			$('body').append(copyInput);

			copyInput[0].select();

			document.execCommand("copy");

			copyInput.remove();

			alert('link copied.');
		});

		// Bookmark / Offline Save functionality
		$('#social-save').on('click', function (evt) {
			// Save the story JSON
			OfflineWorker.SetStorage(storyId, story);

			// Save the story assets with the service worker
			var storyAssets = getStoryAssetList(),
			    originalList = OfflineWorker.GetStorage('Viewer'),
			    itemsToRemove = [];

			// Remove old assets from the list
			_.each(storyAssets, function (assetName) {
				assetName = assetName.replace(/\?t=[0-9]*/gi, '');
				_.each(originalList, function (_assetName, i) {
					if (assetName == _assetName.replace(/\?t=[0-9]*/gi, '')) itemsToRemove.push(_assetName);
				});
			});
			OfflineWorker.RemoveFromAssetList('Viewer', itemsToRemove);

			// Add new story items to list
			var assetList = OfflineWorker.AddToAssetList('Viewer', storyAssets);
			OfflineWorker.SaveServiceWorker('/html/Client/ViewerOffline.html', assetList);

			if (offlineIds.indexOf(storyId) == -1) {
				offlineIds.unshift(storyId);
				OfflineWorker.SetStorage('storyIds', offlineIds);
			}

			// TODO: Add the story to the user's bookmark if there is a user
			// NOTE: Maybe we should have a separate button for this?
		});

		LanguageSelector.updateLanguageDisplay();

		// load and render similar stories
		$.ajax({
			method: 'get',
			url: '/api/stories'
		}).done(function (stories) {
			var similarAuthorStories = [];

			_.each(stories, function (_story) {
				if (_story.author != story.author || _story.id == story.id) return;
				similarAuthorStories.push(new StoryPreview(_story));
			});

			if (similarAuthorStories.length > 0) {
				$('#more-author').show();
				new Carousel('#more-author', similarAuthorStories, 4, false, false, 'More from this Author');
			} else {
				$('#more-author').hide();
			}
			displaySimilarGenres(stories);
			$(document).on('languageChange', function () {
				displaySimilarGenres(stories);
			});

			LanguageSelector.updateLanguageDisplay();
		}).fail(function (err) {
			console.error(err);
		});
	}

	function showOfflineStories() {
		var storyPreviews = [];
		_.each(offlineIds, function (id) {
			var _story = OfflineWorker.GetStorage(id);
			if (!_story) return;

			var sp = new StoryPreview(_story);
			storyPreviews.push(sp);
		});

		if (storyPreviews.length > 0) {
			var storyGrid = new StoryGrid("offline-stories", storyPreviews);
		} else {
			$('#offline-stories').addClass('empty');
			$('#offline-stories').html('You have no saved stories.');
		}
	}

	return {
		setters: [function (_2) {
			LanguageSelector = _2['default'];
		}, function (_3) {
			StoryPreview = _3['default'];
		}, function (_4) {
			StoryViewer = _4['default'];
		}, function (_5) {
			StoryGrid = _5['default'];
		}, function (_6) {
			html = _6['default'];
		}, function (_b) {}, function (_c) {}, function (_e) {
			_ = _e['default'];
		}, function (_d) {
			OfflineWorker = _d['default'];
		}, function (_f) {
			urlParams = _f['default'];
		}, function (_a) {
			Carousel = _a['default'];
		}],
		execute: function () {
			template = _.template(html);
			OFFLINEPAGEASSETS = ['/upup.min.js', '/upup.sw.min.js', '/js/jquery-min.js', '/js/jquery-ui.min.js', '/js/Offline/Header_Offline.js', '/js/Offline/Viewer_Offline.js', '/img/icons/NavBar/WAY_logo.svg', '/img/icons/General/icon_Globe_White.svg', '/img/icons/General/icon_Page_Back.svg', '/img/icons/General/icon_Page_Next.svg', '/img/icons/General/icon_Close.svg', '/img/icons/General/icon_WrittenLang_White.svg', '/img/icons/General/icon_SignLang_White.svg', '/img/icons/General/icon_DropDnArrow.svg', '/img/icons/StoryViewer/bkgd_pageCounter.svg', '/img/icons/StoryViewer/icon_SV_CoverImage.svg', '/img/icons/StoryViewer/icon_SV_FullScreen.svg', '/img/icons/StoryViewer/icon_SV_FullScreen_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg', '/img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_Page_Image.svg', '/img/icons/StoryViewer/icon_SV_Page_Image_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_Page_SignLang.svg', '/img/icons/StoryViewer/icon_SV_Page_SignLang_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_ShowText.svg', '/img/icons/StoryViewer/icon_SV_ShowText_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_HideText.svg', '/img/icons/StoryViewer/icon_SV_HideText_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_WrittenLang.svg', '/img/icons/StoryViewer/icon_SV_WrittenLang_hoverDown.svg', '/img/icons/StoryViewer/icon_SV_SignLang.svg', '/img/icons/StoryViewer/icon_SV_SignLang_hoverDown.svg'];
			storyId = undefined;
			story = undefined;
			liked = false;
			offlineIds = [];
			$(document).ready(function () {
				storyId = parseInt(urlParams.id);
				offlineIds = OfflineWorker.GetStorage('storyIds') || [];

				if (!window.offline) {
					$.ajax({
						method: 'get',
						url: '/api/story?id=' + storyId
					}).done(function (_story) {
						story = _story;
						showStory();
					}).fail(function (err) {
						console.error(err);
					});
				} else {
					story = OfflineWorker.GetStorage(storyId);
					showStory();
					if (!story && !isNaN(storyId)) {
						console.error('Story id (' + storyId + ') not saved for offline viewing.');
					}
				}
			});
		}
	};
});

(function(c){if (typeof document == 'undefined') return; var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[a](d.createTextNode(c));})
("*{box-sizing:border-box;font-family:Segoe UI,Arial,Helvetica,sans-serif}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{box-shadow:inset 0 0 2px 1px #004e74}::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px 2px #004e74}body,html{margin:0;height:100%;width:100%}footer,header,main{position:fixed;width:100%}header{height:90px;background-color:#fff;top:0;box-shadow:0 4px 7px rgba(0,0,0,.5);z-index:100}main{height:calc(100% - 90px - 25px);overflow:auto;position:fixed;top:90px}footer{height:25px;background-color:#0098ba;bottom:0;box-shadow:0 -1px 2px 0 rgba(0,0,0,.5)}header #language-selector{position:absolute;top:0;right:0}button{border:none}button:hover{cursor:pointer}button:focus{outline:none}[lang]:not(html){display:none}#sectionHead,.bold{font-weight:700}#sectionHead{background-color:#a0eaf7;color:#004e74;text-align:center;font-size:25px;font-family:Segoe UI,Arial,Helvetica,sans-serif;padding-top:10px}#throbber{position:absolute;top:0;left:0;height:100%;width:100%;background-color:hsla(0,0%,100%,.5)}#throbber img{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.half,.quarter,.sixth,.third,.three-quarters,.two-thirds{float:left;width:calc(50% - 20px);margin:9.99px}.third{width:calc(33.33333% - 20px)}.two-thirds{width:calc(66.66667% - 20px)}.quarter{width:calc(25% - 20px)}.three-quarters{width:calc(75% - 20px)}.sixth{width:calc(16.66667% - 20px)}.offline footer{padding:2px 10px;text-align:right;color:#fff}@media (max-height:768px),screen and (max-width:1024px){body{font-size:10pt}header{height:75px}main{height:calc(100% - 75px - 25px);top:75px}}@media screen and (max-width:800px){body,footer,header,main{position:absolute;min-width:800px}}#viewer{width:100%;height:70%}#details{width:50%;margin:5px auto 25px;text-align:left}#title{margin:5px 0;font-size:2em}#author{margin:5px 0;font-size:1.2em}.social{margin:5px 0;margin-right:10px;border-radius:25px;border:2px solid #0098ba;background-color:#fff;color:#0098ba;padding:5px 10px;padding-left:40px;background-repeat:no-repeat;background-size:30px 30px;background-position:5px;font-size:1.1em}.socialExport{color:#fff;background-color:#0098ba;border-color:#0098ba;width:110px}#social-views{background-image:url('/img/icons/SocialMedia/icon_SM_Views.svg')}#social-likes{background-image:url('/img/icons/SocialMedia/icon_SM_Likes.svg')}#social-save{background-image:url('/img/icons/SocialMedia/icon_SM_Save.svg')}#social-share{background-image:url('/img/icons/SocialMedia/icon_SM_Share.svg')}#description{margin:10px 0}.metadata-list{margin:5px 0;color:#004e75}.metadata-list a,.metadata-list span span{display:inline-block;border-radius:25px;background-color:#004e75;padding:5px 10px;font-size:1em;color:#fff;text-decoration:none}.metadata-list a:hover{text-decoration:underline}.category{border-radius:25px;border:2px;border-color:#004e74;border-style:solid;text-align:center;padding-right:10px;margin-right:10px;padding-left:10px;background-color:#004e74;display:inline-block;color:#fff}#more-author .dot,#more-stories .dot{height:15px;width:15px}#more-author,#more-stories{height:25%}.carousel-nav-img{width:45px!important}.carousel-nav.right .carousel-nav-img{margin-left:-65%!important}.carousel-nav.left .carousel-nav-img{margin-left:65%!important}.image-holder .pageTitle{text-align:left;height:35px!important;padding-bottom:5px;padding-top:2px!important;font-size:1.4em}#offline-stories-title{height:50px;padding:10px;background-color:#0098ba;text-align:center;font-size:1.5em;color:#fff}#offline-stories{height:calc(100% - 50px)}#offline-stories.empty{padding:25px}.story-preview{position:relative;display:inline-block;float:left;width:33.33333%;max-height:100%;padding:15px}.story-preview .cover-image-container,.story-preview .meta-data-container{position:absolute;height:calc(100% - 30px);width:calc(100% - 30px);background-color:#004e74;background-size:contain;background-repeat:no-repeat;background-position:50%}.story-preview .meta-data-container{display:none;background-color:#004E74F0;padding:10px}.story-preview .meta-data-container a{display:block;width:calc(100% - 35px);height:100%;overflow:auto;color:#fff;text-decoration:none}.story-preview:hover .meta-data-container{display:block}.story-preview .info-button{display:none;position:absolute;z-index:1;bottom:10px;left:10px}.story-preview .title{font-size:1.25em;margin-bottom:5px}.story-preview .author{font-size:.75em;margin-bottom:5px}.story-preview .description{font-size:1em}.story-preview .meta-data-container a.story-game-button{position:absolute;bottom:10px;right:10px;width:35px;height:35px;border:none;background:none;background-repeat:no-repeat;background-image:url('../img/icons/NavBar/nav_games.svg')}.story-preview .meta-data-container a.story-game-button:hover{background-image:url('../img/icons/NavBar/nav_games_hoverDown2.svg')}#language-selector select{background-color:#004e74;color:#fff;height:35px;width:200px;font-size:1.1em;padding:5px;padding-left:40px;text-align:center;border:none;border-bottom-left-radius:15px;-webkit-appearance:none;text-align-last:center;-ms-text-align-last:center;-moz-text-align-last:center}#language-selector select:focus{border-radius:0}#language-selector img{position:absolute;left:10px;top:2px;height:25px}.carousel{height:100%;width:100%}.carousel .carousel-nav{position:relative;float:left;height:100%;width:10%;border:none;background:none}.carousel .image-holder{position:relative;float:left;height:calc(100% - 30px);width:80%;overflow:hidden;white-space:nowrap;display:inline-block}.carousel .carousel-panel{height:100%;-webkit-transition:all 2s ease 0s;transition:all 2s ease 0s}#new-stories .carousel .carousel-panel{padding-bottom:35px}.carousel .image-holder.outerIndicator{margin:15px;height:calc(100% - 30px);width:calc(80% - 30px);border:15px solid #004e74;border-bottom-width:0;border-top-width:0;padding-bottom:40px;border-radius:7px;background-color:#004e74}.carousel.single .left{margin-left:10%}.carousel.single .right{margin-right:10%}.carousel.single .image-holder{width:60%;background-color:#004e74}.carousel.single .image-holder.outerIndicator{width:calc(40% - 30px)}.image-holder img{display:inline-block}.carousel .carousel-nav-img{width:50%;-webkit-transition:background-color .6s,border-color .6s,width .3s,height .3s;transition:background-color .6s,border-color .6s,width .3s,height .3s;padding:5px;border-style:solid;border-radius:50%;border-color:#0098ba;background-color:#0098ba}.pageTitle.overlay{background-color:rgba(0,78,116,.85);padding-top:0;z-index:1;width:100%;height:35px;-webkit-transition:opacity .5s;transition:opacity .5s;color:#fff;top:35px;pointer-events:none;font-weight:700}#new-stories .pageTitle.overlay{top:7px}.pageTitle.overlay span{font-size:23px}.pageTitle{padding-top:5px;height:25px;color:#fff;text-align:center;font-family:Segoe UI,Arial,Helvetica,sans-serif}.page-indicator.overlay,.pageTitle{background-color:#004e74;width:100%;position:relative}.page-indicator.overlay{z-index:1;height:36px;opacity:1;top:-72px}.page-indicator{background-color:#004e74;width:100%;position:absolute;left:0;bottom:0}.dots{display:block;position:relative;text-align:center;width:auto!important}.dot{display:inline-block;border-style:solid;border-radius:50%;border-color:#0098ba;background-color:#0098ba;height:17px;width:17px;margin:7px 5px 5px}.dot#current{border-color:#fff;background-color:#fff;-webkit-transition:background-color 2s,border-color 2s;transition:background-color 2s,border-color 2s}.carousel.single .overlay~.carousel-panel .story-preview .cover-image-container{width:100%}.carousel.single .overlay~.carousel-panel .meta-data-container{-webkit-transform:translate(0);transform:translate(0);width:100%}.image-holder .story-preview{width:100%;height:100%;background-color:#004e74;padding:0}.image-holder .story-preview .cover-image-container{width:calc(100% - 30px)}.hovereable{display:inline-block;height:100%}.image-holder .meta-data-container{white-space:normal;width:100%}.carousel.single .story-game-button{width:60px;height:60px;bottom:50px;right:20px}#story-viewer{position:relative;height:100%;width:100%;padding-top:5px;background-color:#004e74;color:#fff}.story-viewer-nav,.story-viewer-page{transition:height,width .5s;-moz-transition:height,width .5s;-webkit-transition:height,width .5s;-ms-transition:height,width .5s}#page-counter{height:50px;margin:5px;text-align:center;background-image:url(img/icons/StoryViewer/bkgd_pageCounter.svg);background-size:contain;background-repeat:no-repeat;background-position:50%}#page-counter span{font-size:35px;font-weight:700;width:100px;display:inline-block}#page-counter #current{color:#0098ba}#page-counter #total{color:#004e75}#page-content{height:calc(100% - 120px)}#page-content>div{height:calc(100% - 20px);position:relative}.story-viewer-nav-button{height:100%;width:100%;padding:0;background:no-repeat;border:none;color:#0098ba;background-repeat:no-repeat;background-position:50px;background-size:25px 45px;text-align:left}.story-viewer-nav-button>div{font-size:40px;height:50px;background-repeat:no-repeat;background-position:0;background-size:45px 45px}.story-viewer-nav-button .num{position:absolute;width:100%}.story-viewer-nav-button .icon.image{background-image:url(img/icons/StoryViewer/icon_SV_Page_Image.svg)}.story-viewer-nav-button .icon.sign{background-image:url(img/icons/StoryViewer/icon_SV_Page_SignLang.svg)}.story-viewer-nav-button:hover{color:#fff;font-weight:700;background-size:30px 50px}.story-viewer-nav-button:hover .icon{background-size:50px 50px}.story-viewer-nav-button:hover .icon.image{background-image:url(img/icons/StoryViewer/icon_SV_Page_Image_hoverDown.svg)}.story-viewer-nav-button:hover .icon.sign{background-image:url(img/icons/StoryViewer/icon_SV_Page_SignLang_hoverDown.svg)}#story-viewer-next{background-image:url(img/icons/General/icon_Page_Next.svg)}#story-viewer-previous{background-image:url(img/icons/General/icon_Page_Back.svg);text-align:right;background-position:right 50px center}#story-viewer-previous>div{background-position:100%}.story-viewer-page{background-color:#002e45;overflow:hidden}#page-overlay{position:absolute;width:100%;height:40px;z-index:1;opacity:.7;background-color:#002e45;text-align:center}.image-container{height:100%;width:100%;position:relative;overflow:hidden}.image-container img{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-height:100%;max-width:100%}.video-container{height:calc(100% - 40px);position:relative;overflow:hidden;padding:5px;transition:height .5s;-moz-transition:height .5s;-webkit-transition:height .5s;-ms-transition:height .5s}.video-container video{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-height:calc(100% - 10px);max-width:calc(100% - 10px)}.video-container.text-open{height:calc(60% - 40px)}#text-toggle-container{height:40px}#text-toggle{display:block;height:40px;width:40px;margin:0 auto;background:none;background-image:url(img/icons/StoryViewer/icon_SV_HideText.svg)}#text-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_HideText_hoverDown.svg)}#text-toggle-container.text-open #text-toggle{background-image:url(img/icons/StoryViewer/icon_SV_ShowText.svg)}#text-toggle-container.text-open #text-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_ShowText_hoverDown.svg)}#text-container{height:0;overflow:hidden;padding:15px 50px;background-color:#0098ba;line-height:1.75em;font-size:1.5em;transition:height .5s;-moz-transition:height .5s;-webkit-transition:height .5s;-ms-transition:height .5s}#text-container.text-open{height:40%;overflow:auto}#page-controller{height:60px;padding:10px;text-align:center;background-color:#0098ba;box-shadow:inset 0 4px 7px rgba(0,78,117,.7)}#fullscreen-toggle{position:absolute;height:40px;width:40px;right:10px;bottom:10px;border:none;background:none;background-image:url(img/icons/StoryViewer/icon_SV_FullScreen.svg)}#fullscreen-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_hoverDown.svg)}#story-viewer:fullscreen #fullscreen-toggle{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg)}#story-viewer:fullscreen #fullscreen-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg)}#story-viewer:fullscreen .story-viewer-nav{width:80px}#story-viewer:fullscreen .story-viewer-page{width:calc(100% - 220px)}#story-viewer:fullscreen .custom-select-options{padding-top:5px;padding-bottom:20px;top:auto;bottom:calc(100% - 15px)}#story-viewer:full-screen #fullscreen-toggle{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg)}#story-viewer:full-screen #fullscreen-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg)}#story-viewer:full-screen .story-viewer-nav{width:80px}#story-viewer:full-screen .story-viewer-page{width:calc(100% - 220px)}#story-viewer:full-screen .custom-select-options{padding-top:5px;padding-bottom:20px;top:auto;bottom:calc(100% - 15px)}#story-viewer:-webkit-full-screen #fullscreen-toggle{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg)}#story-viewer:-webkit-full-screen #fullscreen-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg)}#story-viewer:-webkit-full-screen .story-viewer-nav{width:80px}#story-viewer:-webkit-full-screen .story-viewer-page{width:calc(100% - 220px)}#story-viewer:-webkit-full-screen .custom-select-options{padding-top:5px;padding-bottom:20px;top:auto;bottom:calc(100% - 15px)}#story-viewer:-moz-full-screen #fullscreen-toggle{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg)}#story-viewer:-moz-full-screen #fullscreen-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg)}#story-viewer:-moz-full-screen .story-viewer-nav{width:80px}#story-viewer:-moz-full-screen .story-viewer-page{width:calc(100% - 220px)}#story-viewer:-moz-full-screen .custom-select-options{padding-top:5px;padding-bottom:20px;top:auto;bottom:calc(100% - 15px)}#story-viewer:-ms-fullscreen #fullscreen-toggle{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse.svg)}#story-viewer:-ms-fullscreen #fullscreen-toggle:hover{background-image:url(img/icons/StoryViewer/icon_SV_FullScreen_Reverse_hoverDown.svg)}#story-viewer:-ms-fullscreen .story-viewer-nav{width:80px}#story-viewer:-ms-fullscreen .story-viewer-page{width:calc(100% - 220px)}#story-viewer:-ms-fullscreen .custom-select-options{padding-top:5px;padding-bottom:20px;top:auto;bottom:calc(100% - 15px)}.glossary{cursor:default;position:relative;background-color:#004e74;border:2px solid #004e74;border-radius:15px;transition:border-color .5s;-moz-transition:border-color .5s;-webkit-transition:border-color .5s;-ms-transition:border-color .5s;padding:0 5px;padding-top:0}.glossary:hover{border-color:#fff}#glossary-modal{position:fixed;top:0;left:0;height:100%;width:100%;background-color:rgba(0,0,0,.5);z-index:100}#term-container{position:absolute;top:12.5%;left:12.5%;background-color:#fefefe;border-radius:20px;padding:10px;width:75%;height:75%}#term-container>div{height:calc(100% - 20px)}#media-container>div{height:calc(50% - 10px);background-color:#004e74;border-radius:10px}#media-container>div+div{margin-top:20px}#definition-container{background-color:#a0eaf7;border-radius:10px;color:#004e74;padding:10px 25px;font-size:1.25em}#exit-modal{position:absolute;width:50px;height:50px;background:none;background-image:url('img/icons/General/icon_Close.svg');right:10px}#exit-modal:hover{background-image:url('img/icons/General/icon_Close_hoverDown.svg')}.custom-select .custom-select-value{background-repeat:no-repeat;background-size:30px 30px;background-position:10px}.custom-select{position:relative;display:inline-block}.custom-select-value{position:relative;z-index:1;width:250px;height:40px;margin:0 5px;color:#fff;background-color:#004e74;background-size:30px 30px;background-position:left 10px center;background-repeat:no-repeat;font-size:1.2em;padding:5px 40px;text-align:center;border:none;border-radius:40px;border:2px solid #004e74}.custom-select-value:hover{border-color:#fff}.custom-select-value:after{content:'';position:absolute;top:0;right:10px;height:40px;width:30px;background-image:url(img/icons/General/icon_DropDnArrow.svg);background-repeat:no-repeat;background-position:50%;background-size:contain}.custom-select-options{position:absolute;display:none;left:25px;top:calc(100% - 15px);width:calc(100% - 50px)!important;background-color:#a0eaf7;box-shadow:0 4px 7px rgba(0,0,0,.5),4px 0 7px rgba(0,0,0,.5);padding:5px 15px;padding-top:20px;border-radius:15px}.custom-select-options>div{margin:5px auto}.custom-select-options button,.custom-select-options input,.custom-select-options label{font-size:1.2em;text-align:left;color:#004e74}.custom-select-options button{display:block;width:100%;padding:3px;background:none}.custom-select-options button:hover{color:#fff;background-color:#004e74;font-weight:700}#written-language-select .custom-select-value{background-image:url('img/icons/General/icon_WrittenLang_White.svg')}#sign-language-select .custom-select-value{background-image:url('img/icons/General/icon_SignLang_White.svg')}#sort-by-select .custom-select-value{background-image:url('img/icons/General/icon_Filter.svg')}#grid-buttons{position:absolute;bottom:5px;right:0}.grid-button{border-radius:50%;background-color:#a1ebf3;border:none;margin-left:5px;width:30px;height:30px;font-weight:700;font-size:1.3em;color:#004e74}.grid-button-selected{background-color:#004e75;position:relative;border:none;color:#fff}#grid-next-button{border-radius:50%;margin-left:20px;padding:7px;border:none;height:27px;width:18px;background:transparent url('img/icons/General/icon_Page_Next_hoverDown.svg') no-repeat 50%}#grid-next-button:active{background:transparent url('img/icons/General/icon_Page_Next_Grid_hoverDown.svg') no-repeat 50%}#grid-prev-button{border-radius:50%;background-color:#a1ebf3;margin-right:15px;padding:7px;visibility:hidden;border:none;height:27px;width:18px;background:transparent url('img/icons/General/icon_Page_Back_hoverDown.svg') no-repeat 50%}#grid-prev-button:active{background:transparent url('img/icons/General/icon_Page_Back_Grid_hoverDown.svg') no-repeat 50%}.grid-page{position:absolute;-webkit-animation-duration:.75s;animation-duration:.75s;width:100%;opacity:1;animation-timing-function:linear;animation-delay:0s;animation-fill-mode:forwards;animation-iteration-count:1;-webkit-animation-iteration-count:1;-webkit-animation-timing-function:linear;-webkit-animation-delay:0s;-webkit-animation-fill-mode:forwards;display:inline-block}#stories{overflow:hidden;overflow-x:hidden;position:relative;width:80%;margin:10px auto}@-webkit-keyframes gridLeftFadeOut{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}to{opacity:0;-webkit-transform:translateX(-100vw);transform:translateX(-100vw)}}@keyframes gridLeftFadeOut{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}to{opacity:0;-webkit-transform:translateX(-100vw);transform:translateX(-100vw)}}@-webkit-keyframes gridLeftFadeIn{0%{opacity:0;-webkit-transform:translateX(100vw);transform:translateX(100vw)}to{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}}@keyframes gridLeftFadeIn{0%{opacity:0;-webkit-transform:translateX(100vw);transform:translateX(100vw)}to{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}}@-webkit-keyframes gridRightFadeOut{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}to{opacity:0;-webkit-transform:translateX(100vw);transform:translateX(100vw)}}@keyframes gridRightFadeOut{0%{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}to{opacity:0;-webkit-transform:translateX(100vw);transform:translateX(100vw)}}@-webkit-keyframes gridRightFadeIn{0%{opacity:0;-webkit-transform:translateX(-100vw);transform:translateX(-100vw)}to{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}}@keyframes gridRightFadeIn{0%{opacity:0;-webkit-transform:translateX(-100vw);transform:translateX(-100vw)}to{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}}@media (max-height:768px),screen and (max-width:1024px){#stories{width:100%!important}}\n/*# sourceMappingURL=__.css.map */");
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    factory();
});
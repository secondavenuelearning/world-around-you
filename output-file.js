!function(e){function t(e){Object.defineProperty(this,e,{enumerable:!0,get:function(){return this[v][e]}})}function r(e){if("undefined"!=typeof System&&System.isModule?System.isModule(e):"[object Module]"===Object.prototype.toString.call(e))return e;var t={default:e,__useDefault:e};if(e&&e.__esModule)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return new o(t)}function o(e){Object.defineProperty(this,v,{value:e}),Object.keys(e).forEach(t,this)}function n(e){return"@node/"===e.substr(0,6)?c(e,r(m(e.substr(6))),{}):p[e]}function u(e){var t=n(e);if(!t)throw new Error('Module "'+e+'" expected, but not contained in build.');if(t.module)return t.module;var r=t.linkRecord;return i(t,r),a(t,r,[]),t.module}function i(e,t){if(!t.depLoads){t.declare&&d(e,t),t.depLoads=[];for(var r=0;r<t.deps.length;r++){var o=n(t.deps[r]);t.depLoads.push(o),o.linkRecord&&i(o,o.linkRecord);var u=t.setters&&t.setters[r];u&&(u(o.module||o.linkRecord.moduleObj),o.importerSetters.push(u))}return e}}function d(t,r){var o=r.moduleObj,n=t.importerSetters,u=!1,i=r.declare.call(e,function(e,t){if(!u){if("object"==typeof e)for(var r in e)"__useDefault"!==r&&(o[r]=e[r]);else o[e]=t;u=!0;for(var i=0;i<n.length;i++)n[i](o);return u=!1,t}},{id:t.key});"function"!=typeof i?(r.setters=i.setters,r.execute=i.execute):(r.setters=[],r.execute=i)}function l(e,t,r){return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:r,setters:void 0,execute:void 0,moduleObj:{}}}}function f(e,t,r,o){var n={};return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:void 0,execute:o,executingRequire:r,moduleObj:{default:n,__useDefault:n},setters:void 0}}}function s(e,t,r){return function(o){for(var n=0;n<e.length;n++)if(e[n]===o){var u,i=t[n],d=i.linkRecord;return u=d?-1===r.indexOf(i)?a(i,d,r):d.moduleObj:i.module,"__useDefault"in u?u.__useDefault:u}}}function a(t,r,n){if(n.push(t),t.module)return t.module;var u;if(r.setters){for(var i=0;i<r.deps.length;i++){var d=r.depLoads[i],l=d.linkRecord;l&&-1===n.indexOf(d)&&(u=a(d,l,l.setters?n:[]))}r.execute.call(y)}else{var f={id:t.key},c=r.moduleObj;Object.defineProperty(f,"exports",{configurable:!0,set:function(e){c.default=c.__useDefault=e},get:function(){return c.__useDefault}});var p=s(r.deps,r.depLoads,n);if(!r.executingRequire)for(var i=0;i<r.deps.length;i++)p(r.deps[i]);var v=r.execute.call(e,p,c.__useDefault,f);void 0!==v?c.default=c.__useDefault=v:f.exports!==c.__useDefault&&(c.default=c.__useDefault=f.exports);var m=c.__useDefault;if(m&&m.__esModule)for(var b in m)Object.hasOwnProperty.call(m,b)&&(c[b]=m[b])}var f=t.module=new o(r.moduleObj);if(!r.setters)for(var i=0;i<t.importerSetters.length;i++)t.importerSetters[i](f);return f}function c(e,t){return p[e]={key:e,module:t,importerSetters:[],linkRecord:void 0}}var p={},v="undefined"!=typeof Symbol?Symbol():"@@baseObject";o.prototype=Object.create(null),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(o.prototype[Symbol.toStringTag]="Module");var m="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,y={};return Object.freeze&&Object.freeze(y),function(e,t,n,i){return function(d){d(function(d){var s={_nodeRequire:m,register:l,registerDynamic:f,registry:{get:function(e){return p[e].module},set:c},newModule:function(e){return new o(e)}};c("@empty",new o({}));for(var a=0;a<t.length;a++)c(t[a],r(arguments[a],{}));i(s);var v=u(e[0]);if(e.length>1)for(var a=1;a<e.length;a++)u(e[a]);return n?v.__useDefault:(v instanceof o&&Object.defineProperty(v,"__esModule",{value:!0}),v)})}}}("undefined"!=typeof self?self:"undefined"!=typeof global?global:this)

(["a"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
!function(e){function r(e,r){for(var n=e.split(".");n.length;)r=r[n.shift()];return r}function n(n){if("string"==typeof n)return r(n,e);if(!(n instanceof Array))throw new Error("Global exports must be a string or array.");for(var t={},o=0;o<n.length;o++)t[n[o].split(".").pop()]=r(n[o],e);return t}function t(r){if(-1===a.indexOf(r)){try{var n=e[r]}catch(e){a.push(r)}this(r,n)}}var o,i=$__System,a=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB","mozInnerScreenY","mozInnerScreenX"];i.registry.set("@@global-helpers",i.newModule({prepareGlobal:function(r,i,a){var f=e.define;e.define=void 0;var l;if(a){l={};for(var s in a)l[s]=e[s],e[s]=a[s]}return i||(o={},Object.keys(e).forEach(t,function(e,r){o[e]=r})),function(){var r,a=i?n(i):{},s=!!i;if(i||Object.keys(e).forEach(t,function(e,n){o[e]!==n&&void 0!==n&&(i||(a[e]=n,void 0!==r?s||r===n||(s=!0):r=n))}),a=s?a:r,l)for(var c in l)e[c]=l[c];return e.define=f,a}}}))}("undefined"!=typeof self?self:"undefined"!=typeof global?global:this);

$__System.registerDynamic("b", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register("c", [], function (_export, _context) {
  "use strict";

  var __useDefault;

  return {
    setters: [],
    execute: function () {
      _export("__useDefault", __useDefault = "<div id=\"<%- id %>\" class=\"story-preview\">\r\n\t<a href=\"./<%- launchToEditor ? 'Editor' : 'View' %>?id=<%- story.id %>\">\r\n\t\t<div class=\"cover-image-container\" style=\"background-image: url(<%- story.coverImage %>)\">\r\n\t\t\t<button class=\"info-button\">i</button>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"meta-data-container\">\r\n\t\t\t<% _.each(story.metadata.title, function(title, lang){ %>\r\n\t\t\t\t<div class=\"title\" lang=\"<%- lang %>\"><%- title %></div>\r\n\t\t\t<% }) %>\r\n\t\t\t<div class=\"author\"><%- story.author %></div>\r\n\t\t\t<% _.each(story.metadata.description, function(description, lang){ %>\r\n\t\t\t\t<div class=\"description\" lang=\"<%- lang %>\"><%- description %></div>\r\n\t\t\t<% }) %>\r\n\t\t</div>\r\n\t</a>\r\n</div>");

      _export("__useDefault", __useDefault);

      _export("default", __useDefault);
    }
  };
});
$__System.register('d', ['b', 'e', 'c'], function (_export) {
	'use strict';

	var _, html, index, template, interval;

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
			launchToEditor: this.launchToEditor
		});

		// create the jquery element
		this.$element = $(element);
	}

	return {
		setters: [function (_b) {}, function (_e) {
			_ = _e['default'];
		}, function (_c) {
			html = _c['default'];
		}],
		execute: function () {
			index = 0;
			template = _.template(html);
			interval = 0;
			$(window).resize(resizePrviews);StoryPreview.prototype.appendTo = function (elementOrId) {
				// grab the jquery element
				var $elementOrId = $(typeof elementOrId == 'string' ? '#' + elementOrId : elementOrId);

				// append the story preview element
				$elementOrId.append(this.$element);
				resizePrviews();
			};

			_export('default', StoryPreview);
		}
	};
});
$__System.registerDynamic("f", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.register("10", [], function (_export, _context) {
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
$__System.register("11", ["10", "12", "f", "e"], function (_export) {
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
        var panels = [,,];
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
            $(this).attr('id', 'current');
            startIndex = showing * $(this).index();
            endIndex = startIndex + (showing - 1);
            console.log(startIndex);
            offset = $(this).index();
            drawPanels(panels, 0, 0, 0, 0, 0, "left", $(this).index(), true);
        });

        //add special functionality for overlays
        if (isOverlay) {
            //on hover hide title and index indicator
            $(holder).hover(function () {
                $('#' + itemsID + ' > .image-holder > .pageTitle').css('opacity', '0');
            }, function () {
                $('#' + itemsID + ' > .image-holder > .pageTitle').css('opacity', '.7');
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
        for (var i = 0; i < pages; i++) {
            indicatorHTML += "<div class = \"dot\"> </div>"; //actual dot
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
        setters: [function (_2) {
            html = _2["default"];
        }, function (_3) {
            ImageHoverSwap = _3["default"];
        }, function (_f) {}, function (_e) {
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
$__System.register('13', ['12', '14', 'e'], function (_export) {
    var ImageHoverSwap, _Object$keys, _, storyData, pageIndex, totalPages, writtenLang, writtenOptions, signLang, signOptions, textArea, visuals, fullscreen;

    /* ----------------------- Constructor ----------------------- */

    function StoryViewer(storyObj) {
        //save passed in story json globally
        storyData = storyObj;

        //attach global vars to their element
        textArea = $('#story');
        visuals = $('#visuals');

        //add onlick for story toggle
        $('#storyToggle').on('click', function () {
            ToggleStoryText();
        });

        //add onclick for fullscreen toggling
        $('#fullscreen').on('click', function () {
            ToggleFullScreen();
        });
        $('#exit-fullscreen').on('click', function () {
            ToggleFullScreen();
        });

        //add onclick event for chaning pages onto the nav buttons
        $('.viewerNav#back button').on('click', function () {
            changePage(pageIndex - 1);
        });
        $('.viewerNav#forward button').on('click', function () {
            changePage(pageIndex + 1);
        });

        //set the total page number
        totalPages = _Object$keys(storyData).length;
        $('#total').text(totalPages);

        //parse the first page
        $('#visuals img').css("display", "block");
        $('#visuals video').css("display", "none");
        $('.viewerNav #cover.icon').css('display', 'none');
        $('#storyToggle #show').css('display', 'none');

        GenerateLanguageSelects();

        parsePage(pageIndex);
        $('#storyToggle').css('display', 'none');
        ToggleStoryText(); //hide text for cover image
        visuals.css('max-height', '100%');
        greyOutNav(); //grey out back button bc on first item

        //add hover image swaping
        ImageHoverSwap("#storyToggle button", "#storyToggle #show", "../../img/icons/StoryViewer/icon_SV_HideText.svg", "../../img/icons/StoryViewer/icon_SV_HideTex_HoverDown.svg");

        ImageHoverSwap("#storyToggle button", "#storyToggle #hide", "../../img/icons/StoryViewer/icon_SV_ShowText.svg", "../../img/icons/StoryViewer/icon_SV_ShowText_HoverDown.svg");

        //ImageHoverSwap("#fullscreen button", "#fullscreen img", "../../img/icons/StoryViewer/icon_SV_Fullscreen.svg", "../../img/icons/StoryViewer/icon_SV_Fullscreen_HoverDown.svg");

        ImageHoverSwap("#signLang", "#signLang img", "../../img/icons/StoryViewer/icon_SV_SignLang.svg", "../../img/icons/StoryViewer/icon_SV_SignLang_HoverDown.svg");

        ImageHoverSwap("#writtenLang", "#writtenLang img", "../../img/icons/StoryViewer/icon_SV_WrittenLang.svg", "../../img/icons/StoryViewer/icon_SV_WrittenLang_HoverDown.svg");

        ImageHoverSwap("#forward.viewerNav", "#forward.viewerNav #sign.icon", "../../img/icons/StoryViewer/icon_SV_Page_SignLang.svg", "../../img/icons/StoryViewer/icon_SV_Page_SignLang_HoverDown.svg");

        ImageHoverSwap("#forward.viewerNav", "#forward.viewerNav #cover.icon", "../../img/icons/StoryViewer/icon_SV_Page_Image.svg", "../../img/icons/StoryViewer/icon_SV_Page_Image_HoverDown.svg");

        ImageHoverSwap("#back.viewerNav", "#back.viewerNav #sign.icon", "../../img/icons/StoryViewer/icon_SV_Page_SignLang.svg", "../../img/icons/StoryViewer/icon_SV_Page_SignLang_HoverDown.svg");

        ImageHoverSwap("#back.viewerNav", "#back.viewerNav #cover.icon", "../../img/icons/StoryViewer/icon_SV_Page_Image.svg", "../../img/icons/StoryViewer/icon_SV_Page_Image_HoverDown.svg");
    }

    /* ----------------------- Data parsing ----------------------- */
    function parsePage(page) {
        console.log("Parsing: " + page);
        //update all the page numbers
        updatePageNumbers();

        //set story text
        $('#story').text(storyData[pageIndex].text[writtenLang]);

        //set image
        $('#visuals img').attr('src', storyData[page].image);

        //set video
        $('#visuals video').attr('src', storyData[page].video[signLang]);

        //search for glossary terms and make them buttons
        GenerateGlossaryButtons();
    }

    function updatePageNumbers() {
        var screen = 1;
        if (!ShowingCover()) {
            screen = 2;
        }

        //update current
        $('#index #current').text(pageIndex + 1);
        $('#currentOverlay span').text(pageIndex + 1);

        //update buttons
        $('.viewerNav#forward .num').text(pageIndex + screen);
        $('.viewerNav#back .num').text(pageIndex - screen % 2 + 1);
    }

    function GenerateGlossaryButtons() {
        var story = storyData[pageIndex].text[writtenLang];

        // Add glossary functionality
        var glossary = {};
        if (storyData[pageIndex].hasOwnProperty('glossary')) //check if we even have glossary items
            {
                glossary = storyData[pageIndex].glossary[writtenLang]; //get all glossary object for this lang

                //build glossary regex
                var glossaryRegex = "";
                var terms = 1;
                _Object$keys(glossary).forEach(function (term) {
                    //terms
                    glossaryRegex += term + "|";
                    terms++;
                });

                glossaryRegex = glossaryRegex.slice(0, glossaryRegex.length - 1); //clean off last '|'
                glossaryRegex = new RegExp(glossaryRegex, 'gi'); //convert to actual regular expression - gi is global (g) and not case sensitive(i)

                //replace found regex terms with functional glossary items in the html
                story = story.replace(glossaryRegex, function (match) {
                    var formattedTerm = '<span class=\"glossary\">' + match + '</span>';
                    return formattedTerm;
                });

                //give modified text back to story element
                textArea.html(story);

                //add button functionality
                $('.glossary').on('click', function (e) {
                    //parse data to modal pop up
                    var glossary = storyData[pageIndex].glossary[writtenLang];
                    var term = $(e.target).text().toLowerCase();

                    setOverlayItems(term, //word
                    glossary[term].definition, glossary[term].video[signLang].start, glossary[term].video[signLang].end, storyData[pageIndex].video[signLang], glossary[term].image);

                    //call pop up
                    $('.modal').css("display", "block");

                    $('#videoLoop').focus();
                });
            }
    }

    function setOverlayItems(word, definition, start, end, video, image) {
        var videoContainer = document.getElementById("videoContainer");
        var imageTag = document.getElementById("definitionImage");
        var description = document.getElementById("definitionText");
        var title = document.getElementById("definitionWord");

        videoContainer.src = video + "#t=" + start + "," + end;
        videoContainer.addEventListener('loadedmetadata', function () {
            if (videoContainer.currentTime < start) {
                videoContainer.currentTime = start;
            }
            videoContainer.ontimeupdate = function () {
                if (videoContainer.currentTime >= end) {
                    videoContainer.currentTime = start;
                    videoContainer.play();
                }
            };
        }, false);

        imageTag.src = image;
        description.innerHTML = definition;
        title.innerHTML = word;
    }

    function GenerateLanguageSelects() {
        //get sign and written options from the json
        writtenOptions = _Object$keys(storyData[0].text);
        signOptions = _Object$keys(storyData[0].video);

        //build menus
        BuildSelectOptions($('#writtenLang select'), writtenOptions);
        BuildSelectOptions($('#signLang select'), signOptions);

        //add click events
        $('#writtenLang button').on('click', function () {
            //toggle dropdown visibility
            ToggleOptions('#writtenLang');
        });
        $('#writtenLang select').on('change', function (e) {
            writtenLang = e.target.value;
            parsePage(pageIndex);
            ToggleOptions('#writtenLang');
        });

        $('#signLang button').on('click', function () {
            ToggleOptions('#signLang');
        });
        $('#signLang select').on('change', function (e) {
            signLang = e.target.value;
            parsePage(pageIndex);
            ToggleOptions('#signLang');
        });
    }

    function BuildSelectOptions(select, options) {
        var optionsHTML = "";

        //loop through options and create html
        options.forEach(function (option) {
            optionsHTML += "<option value=\"" + option + "\">";
            optionsHTML += option;
            optionsHTML += "</option>";
        });

        //add to slect object
        select.html(optionsHTML);
    }

    /* ----------------------- Button Functionality ----------------------- */
    function changePage(pageNum) {
        //validate requested page
        if (pageNum < 0 && ShowingCover() || pageNum > totalPages - 1 && !ShowingCover()) {
            return;
        }

        //check if we are paging forward or backward, call fucntion accordingly
        if (pageNum > pageIndex) {
            NextScreen(pageNum);
        } else {
            LastScreen(pageNum);
        }

        //grey out nav on last and first items
        greyOutNav();

        //parse data from story josn to the viewers elements
        parsePage(pageIndex);
        if (ShowingCover()) {
            var nav = document.getElementById("currentOverlay");
            nav.style.opacity = .7;
        } else {
            var nav = document.getElementById("currentOverlay");
            nav.style.opacity = 0;
        }
    }

    function LastScreen(pageNum) {
        if (ShowingCover()) {
            //change page index
            pageIndex = pageNum;

            //change to show video
            $('#visuals img').css("display", "none");
            $('#visuals video').css("display", "block");

            //set text and visuals back to default
            textArea.removeClass('hideAnim');
            visuals.removeAttr('style');
            $('#storyToggle').removeAttr('style');

            //update icons
            $('.viewerNav #sign.icon').css('display', 'none');
            $('.viewerNav #cover.icon').removeAttr('style');
            $('#storyToggle #hide').css('display', 'none');
            $('#storyToggle #show').removeAttr('style');
        }
        //we saw the video we need to parse the next page
        else {
                //change to show img
                $('#visuals img').css("display", "block");
                $('#visuals video').css("display", "none");

                //turn off text area
                textArea.addClass('hideAnim');;
                $('#storyToggle').css('display', 'none');

                //expand video to be full size
                visuals.css('height', '100%');
                visuals.css('max-height', '100%');
                visuals.css('width', '100%');
                visuals.css('margin', '0px');

                //update icons
                $('.viewerNav #sign.icon').removeAttr('style');
                $('.viewerNav #cover.icon').css('display', 'none');
                $('#storyToggle #show').css('display', 'none');
                $('#storyToggle #hide').removeAttr('style');
            }
    }

    function NextScreen(pageNum) {
        //check if we are on the video or img, and switch between those before changing pages
        if (ShowingCover()) {
            //change to show video
            $('#visuals img').css("display", "none");
            $('#visuals video').css("display", "block");

            //set text and visuals back to default
            textArea.removeClass('hideAnim');;
            visuals.removeAttr('style');
            $('#storyToggle').removeAttr('style');

            //update icons
            $('.viewerNav #sign.icon').css('display', 'none');
            $('.viewerNav #cover.icon').removeAttr('style');
            $('#storyToggle #hide').css('display', 'none');
            $('#storyToggle #show').removeAttr('style');
        }
        //we saw the video we need to parse the next page
        else {
                //change page index
                pageIndex = pageNum;

                //change to show img
                $('#visuals img').css("display", "block");
                $('#visuals video').css("display", "none");

                //turn off text area
                textArea.addClass('hideAnim');
                $('#storyToggle').css('display', 'none');

                //expand video to be full size
                visuals.css('height', '100%');
                visuals.css('max-height', '100%');
                visuals.css('width', '100%');
                visuals.css('margin', '0px');

                //update icons
                $('.viewerNav #sign.icon').removeAttr('style');
                $('.viewerNav #cover.icon').css('display', 'none');
                $('#storyToggle #show').css('display', 'none');
                $('#storyToggle #hide').removeAttr('style');
            }
    }

    function ToggleStoryText() {
        //get current mode
        var currentMode = textArea.hasClass('hideAnim');

        //check if showing or not
        if (currentMode) {
            //set text and visuals back to default
            textArea.removeClass("hideAnim");
            visuals.removeAttr('style');
            $('#storyToggle').removeAttr('style');
            $('#storyToggle #hide').css('display', 'none');
            $('#storyToggle #show').removeAttr('style');
        } else {
            //turn off text area
            //textArea.css("display", "none");
            textArea.addClass('hideAnim');

            //expand video to be full size
            visuals.css('height', '100%');
            visuals.css('max-height', '90%');
            visuals.css('width', '100%');
            visuals.css('margin', '0px');

            //$('#storyToggle').css('top', "calc(-100px)");
            $('#storyToggle #show').css('display', 'none');
            $('#storyToggle #hide').removeAttr('style');
        }
    }

    function ToggleOptions(tag) {
        var selectObj = $(tag + ' select');
        var buttonObj = $(tag + ' button');

        //get current mode
        var currentMode = selectObj.css("display");

        //check if showing or not
        if (currentMode.toString() === "none") {
            selectObj.css('display', 'block');

            buttonObj.css("border-bottom-left-radius", "0");
            buttonObj.css("border-bottom-right-radius", "0");
        } else {
            //set text and visuals back to default
            selectObj.removeAttr('style');
            buttonObj.removeAttr('style');
        }
    }

    function ToggleFullScreen() {
        if (fullscreen) {
            //set fullscreen to be off
            fullscreen = false;

            //show elements
            $('header').removeAttr('style');
            $('#details').removeAttr('style');
            $('#more-stories').css('display', 'block');
            $('#more-author').css('display', 'block');
            $('footer').removeAttr('style');

            //move viewer elements back down under header
            $('main').removeAttr('style');
            $('#viewer').removeAttr('style');
            $('#viewerBar').removeAttr('style');

            $('#holder').removeClass('holder-fullscreen');
            $('#viewer-content').removeClass('viewer-content-fullscreen');

            $('#fullscreen').removeClass('fullscreen-active');
            $('.filters').removeClass('fullscreen-active');
            $('#exit-fullscreen').removeClass('fullscreen-active');
        } else {
            //set fullscreen to on
            fullscreen = true;

            //hide elements
            $('header').css('display', 'none');
            $('#details').css('display', 'none');
            $('#more-stories').css('display', 'none');
            $('#more-author').css('display', 'none');
            $('footer').css('display', 'none');

            //move viewer elements up and make it fill
            $('main').css('top', '0');
            $('main').css('height', '100%');
            $('#viewer').css('height', 'calc(100% - 70px');

            $('#holder').addClass('holder-fullscreen');
            $('#viewer-content').addClass('viewer-content-fullscreen');

            //scroll to the top so we dont have odd whitespace and remove anythign thats extra
            $('main').scrollTop(0);
            $('main').css('overflow', 'hidden');

            $('#fullscreen').addClass('fullscreen-active');
            $('.filters').addClass('fullscreen-active');
            $('#exit-fullscreen').addClass('fullscreen-active');
        }
    }

    /* ---------------------- Button Extra Styling Functions ---------------------- */
    function greyOutNav() {
        //special events
        if (pageIndex == 0 && ShowingCover()) //first page should hide left button
            {
                //get back button and "grey" it out
                $('.viewerNav#back button').css('opacity', '.3');

                //hide text
                //$('.viewerNav#back span').text(1);
                $('.viewerNav#back span').css('display', "none");

                //resize icon
                $('.viewerNav#back .icon').css('height', '70%');
                $('.viewerNav#back .icon').css('padding', '10%');
                $('.viewerNav#back .icon').css('margin-top', '15px');
            } else if (pageIndex >= totalPages - 1 && !ShowingCover()) //last page shoudl hide right button
            {
                //get forward button and "grey" it out
                $('.viewerNav#forward button').css('opacity', '.3');

                //hide text
                //$('.viewerNav#forward span').text(totalPages - 1);
                $('.viewerNav#forward span').css('display', "none");

                //resize icon
                $('.viewerNav#forward .icon').css('height', '70%');
                $('.viewerNav#forward .icon').css('padding', '10%');
                $('.viewerNav#forward .icon').css('margin-top', '15px');
            } else {
            $('.viewerNav button').removeAttr('style');
            $('.viewerNav span').removeAttr('style');
            $('.viewerNav .icon').removeAttr('margin-top');
            $('.viewerNav .icon').removeAttr('padding');
            $('.viewerNav .icon').removeAttr('height');
        }
    }

    /* ---------------------- Helper Functions ---------------------- */
    function ShowingCover() {
        var isShowing = true;

        if ($('#visuals img').css('display') == "none") {
            isShowing = false;
        }

        return isShowing;
    }
    return {
        setters: [function (_3) {
            ImageHoverSwap = _3['default'];
        }, function (_2) {
            _Object$keys = _2['default'];
        }, function (_e) {
            _ = _e['default'];
        }],
        execute: function () {
            'use strict';

            _export('StoryViewer', StoryViewer);

            _export('default', StoryViewer);

            /* ----------------------- Global Variables ----------------------- */
            pageIndex = 0;
            writtenLang = "English";
            signLang = "fsl_luzon";
            fullscreen = false;
        }
    };
});
$__System.registerDynamic("15", [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };
});
$__System.registerDynamic('16', ['15'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  var defined = $__require('15');
  module.exports = function (it) {
    return Object(defined(it));
  };
});
$__System.registerDynamic('17', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});
$__System.registerDynamic('18', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };
});
$__System.registerDynamic('19', ['18'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  var aFunction = $__require('18');
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () {
      return fn.apply(that, arguments);
    };
  };
});
$__System.registerDynamic('1a', ['17', '1b', '19'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  var global = $__require('17'),
      core = $__require('1b'),
      ctx = $__require('19'),
      PROTOTYPE = 'prototype';
  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      own = !IS_FORCED && target && key in target;
      if (own && key in exports) continue;
      out = own ? target[key] : source[key];
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function (C) {
        var F = function (param) {
          return this instanceof C ? new C(param) : C(param);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
    }
  };
  $export.F = 1;
  $export.G = 2;
  $export.S = 4;
  $export.P = 8;
  $export.B = 16;
  $export.W = 32;
  module.exports = $export;
});
$__System.registerDynamic("1c", [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
});
$__System.registerDynamic('1d', ['1a', '1b', '1c'], true, function ($__require, exports, module) {
    var global = this || self,
        GLOBAL = global;
    /* */
    var $export = $__require('1a'),
        core = $__require('1b'),
        fails = $__require('1c');
    module.exports = function (KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY],
            exp = {};
        exp[KEY] = exec(fn);
        $export($export.S + $export.F * fails(function () {
            fn(1);
        }), 'Object', exp);
    };
});
$__System.registerDynamic('1e', ['16', '1d'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  var toObject = $__require('16');
  $__require('1d')('keys', function ($keys) {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
});
$__System.registerDynamic('1b', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  var core = module.exports = { version: '1.2.6' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
$__System.registerDynamic('1f', ['1e', '1b'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  $__require('1e');
  module.exports = $__require('1b').Object.keys;
});
$__System.registerDynamic("14", ["1f"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("1f"), __esModule: true };
});
$__System.registerDynamic("20", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.registry.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {})(this);

  return _retrieveGlobal();
});
$__System.registerDynamic('21', [], true, function ($__require, exports, module) {
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
$__System.registerDynamic("e", ["21"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("21");
});
$__System.register('12', ['e'], function (_export) {
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
$__System.register('22', ['12', '14', '20', 'e'], function (_export) {
    var ImageHoverSwap, _Object$keys, _, filters, filterRegex, finalResults, database;

    /* ----------------------- Filter Building ----------------------- */
    /*
    Builds out filters bar for web pages that already have a div witht he "FIltersBar" id
    */
    function FiltersBar(id) {
        var launguageOnly = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        //save full possible results
        finalResults = database;
        console.log(finalResults);

        //add child
        $('#' + id).append("<div class=\"filters\"></div>");

        //---SIGN LANGUAGE FILTER
        //build html for filter
        var signID = "SignLanguageFilter";
        var signs = GetValues("Sign", database); //["fsl_luzon", "fsl_visayas", "fsl_mindanao"]; //note: hardcoded for now - later will get from json files or database
        var signsHTML = BuildMultiSelectFilter(signID, "Sign Language", signs, "Sign", "img/icons/General/icon_SignLang_White.svg"); //build out html for signs filter

        //update pahe html to ahve this filter
        $('.filters').append(signsHTML); //apend filter bar to have signs html

        //add click events for filter functionality
        $('#' + signID + ' > button').on('click', function () {
            ToggleOptionsVisible(signID);
        }); //toggle showing filter options
        $('#' + signID + ' > #options > label > input').on('click', function (e) {
            UpdateMultiSelectFilter(signID, e);
        }); //update filter

        //---WRITTEN LANGUAGE FILTER
        //build html for filter
        var writtenID = "WrittenLanguageFilter";
        var written = GetValues("Written", database); //note: hardcoded for now - later will get from json files or database
        var writtenHTML = BuildMultiSelectFilter(writtenID, "Written Language", written, "Written", "img/icons/General/icon_WrittenLang_White.svg"); //build out html for signs filter

        //update page html to have this filter
        $('.filters').append(writtenHTML); //apend filter bar to have signs html

        //add click events for filter functionality
        $('#' + writtenID + ' > button').on('click', function () {
            ToggleOptionsVisible(writtenID);
        });
        $('#' + writtenID + ' > #options > label > input').on('click', function (e) {
            UpdateMultiSelectFilter(writtenID, e);
        });

        //---SORTING FILTER
        if (!launguageOnly) {
            var sortID = "SortByFilter";
            var sortByFields = ["Title", "Author", "DatePublished", "LastUpdated", "Relevance"];
            var sortByHTML = BuildSelectFilter(sortID, "Sort By", sortByFields, "img/icons/General/icon_Filter.svg");

            $('.filters').append(sortByHTML);

            $('#' + sortID + ' > button').on('click', function () {
                ToggleOptionsVisible(sortID);
            });
            $('#' + sortID + ' > #options').on('change', function (e) {
                UpdateSort(signID, e, sortID);
            });
        }
        //--Button Icon Hover Swapping
        //ImageHoverSwap("#sortByFilter button", "#sortByFilter img", "../../img/icons/General/icon_Page_Next.svg", "../../img/icons/General/icon_Page_Next_HoverDown.svg");
    }

    /*
    Returns HTML as string for a filter field
    (filterID: tag to be used for divs id)
    (filterName: text on the filter dropdown button, also for checkbox name)
    (filterOptions: array of strings that define the values and text for each checkbox int he filter)
    */
    function BuildMultiSelectFilter(filterID, filterName, filterOptions, filterTarget, icon) {
        //varibles for this filters data
        var thisFilter = {
            Data: [],
            ID: filterID,
            Name: filterName,
            Regex: "",
            FilterAgainst: filterTarget,
            Type: "Multi"

        };

        //build base filter div
        var filterHTML = "<div class = \"filter\" id = \"" + filterID + "\">";
        filterHTML += "\n";
        filterHTML += "<button><img src=\"" + icon + "\">";
        filterHTML += filterName + "<img class=\"dropdownIcon\" src=\"img/icons/General/icon_DropDnArrow.svg\"></button>";
        filterHTML += "\n";
        filterHTML += "<div id = \"options\">";
        filterHTML += "\n";

        //build options
        for (var i = 0; i < filterOptions.length; i++) {
            //build html
            var optionName = filterName + i.toString();
            filterHTML += "<label class = \"container\">" + filterOptions[i];
            filterHTML += "<input type = \"checkbox\" ";
            filterHTML += "name = \"" + optionName + "\"";
            filterHTML += "value = \"" + filterOptions[i] + "\">";
            filterHTML += "<span class=\"checkmark\"></span>";
            filterHTML += "</label>";

            //update this filters data
            thisFilter.Data[filterOptions[i]] = false;
        }

        //close divs and the like
        filterHTML += "</div>";
        filterHTML += "\n";
        filterHTML += "</div>";

        //add this fully built filter to array of filters
        filters[thisFilter.ID] = thisFilter;

        //give back final built html
        return filterHTML;
    }

    /*
    Returns HTML as string for a filter field
    (filterID: tag to be used for divs id)
    (filterName: text on the filter dropdown button)
    (filterOptions: array of strings that define the values and text for each select option)
    */
    function BuildSelectFilter(filterID, filterName, filterOptions, icon) {
        //varibles for this filters data
        var thisFilter = {
            Data: filterOptions,
            ID: filterID,
            Name: filterName,
            Regex: "",
            FilterAgainst: filterOptions[0],
            Type: "Single"
        };

        //build base filter div
        var filterHTML = "<div class = \"filter\" id = \"" + filterID + "\">";
        filterHTML += "\n";
        filterHTML += "<button><img src=\"" + icon + "\">";
        filterHTML += filterName + "<img class=\"dropdownIcon\" src=\"img/icons/General/icon_DropDnArrow.svg\"></button>";
        filterHTML += "\n";
        filterHTML += "<select id = \"options\">";
        filterHTML += "\n";

        //build options
        for (var i = 0; i < filterOptions.length; i++) {
            //build html
            filterHTML += "<option ";
            filterHTML += "value = \"" + filterOptions[i] + "\">";
            filterHTML += filterOptions[i];
            filterHTML += "</option>";
        }

        //close divs and the like
        filterHTML += "</select>";
        filterHTML += "\n";
        filterHTML += "</div>";

        //add this fully built filter to array of filters
        filters[thisFilter.ID] = thisFilter;

        //give back final built html
        return filterHTML;
    }

    /* ----------------------- Options ----------------------- */

    /*
    Toggles filters options to be visible(display block, or none) based on parent filter
    (target: options parent object)
    */
    function ToggleOptionsVisible(target) {
        //get proper options object
        var options = $('#' + target + '> #options');

        //get current mode
        var currentMode = options.css("display");

        //check if showing or not
        if (currentMode.toString() === "none") {
            options.css("display", "block");
        } else {
            options.css("display", "none");
        }
    }

    /*
    Gets unique values from database source, used for filling filter options
    (type: js object field name to select data from)
    (sourcedb: array of objects to look through)
    */
    function GetValues(type, sourcedb) {
        //instanitate variable to return and initla setup junk
        var source = sourcedb;
        var options = [];

        //loop through database for the givne type and add data as options
        var index = 0;
        source.forEach(function (val) {
            //check if value is an array itself- then get data points within array
            if (Array.isArray(val[type])) {
                val[type].forEach(function (childVal) {
                    //check if its a unique value
                    if (!options.includes(childVal)) {
                        //if so add to array of options
                        options[index] = childVal;
                        index++;
                    }
                });
            } else {
                //check if its a unique value
                if (!options.includes(val[type])) {
                    //if so add to array of options
                    options[index] = val[type];
                    index++;
                }
            }
        });

        //give back array of options
        return options;
    }

    /* ----------------------- Filter Functionality ----------------------- */

    /*
    Changes what video results user gets based on sign
    (filterData: property of filter in filters object to update)
    (target: html checkbox being clicked)
    */
    function UpdateMultiSelectFilter(filterData, target) {
        //update filter data obj
        var obj = $(target.target)[0];
        filters[filterData].Data[obj.value] = obj.checked;

        //create regex string out fo active filters
        var thisFiltersRegex = "";
        _Object$keys(filters[filterData].Data).forEach(function (option) {
            if (filters[filterData].Data[option] == true) {
                thisFiltersRegex += option + "|";
            }
        });

        //set this filters regex with this regex object (or "" for nothing)
        filters[filterData].Regex = thisFiltersRegex;

        //filter data
        Filter(database);
    }

    /*
    Culls results that dont match filter perameters, if no filter then all results are returned. 
    (input: data source to be filtered)
    */
    function Filter(input) {
        var results = [];
        var resultIndex = 0;

        _Object$keys(filters).forEach(function (key) {
            ////checking if actually need to filter
            var regexObj = filters[key].Regex;
            if (regexObj != "") {
                //we do- build regex and clear results
                regexObj = regexObj.slice(0, regexObj.length - 1);
                regexObj = new RegExp(regexObj, 'gi');

                //loop through each entry to check for matches to the inplace filters
                input.forEach(function (entry) {
                    var match = false;

                    //get relevant data and compare
                    var data = entry[filters[key].FilterAgainst];
                    if (Array.isArray(data)) //extra check for data being array as we need to iterate through its entires
                        {
                            data.forEach(function (dataPoint) {
                                //check if data fits the regex model
                                if (regexObj.test(dataPoint)) {
                                    match = true;
                                }
                            });
                        } else //single line piece of data
                        {
                            //check if data fits the regex model
                            if (regexObj.test(data)) {
                                match = true;
                            }
                        }

                    //check if the search reuslts in any matches - if so update results!
                    if (match && !results.includes(entry)) {
                        //it does- at the whole entry to the results
                        results[resultIndex] = entry;
                        resultIndex++; //prep for next result
                        input = results; //set input to results so next run uses updated data set
                    }
                });
            } else {
                    results = input;
                }
        });

        finalResults = Sort(results, "SortByFilter");
        console.log(results);
    }

    /* ----------------------- Sort Functionality ----------------------- */

    /*
    Updates sorting filters in filter object to be newly selected field
    (filterKey: parameter name in filters to update)
    (target: select dropdown to get new sorting field)
    */
    function UpdateSort(filterKey, target) {
        //change current sorting field
        filters[filterKey].FilterAgainst = target.target.value;console.log(filters[filterKey].FilterAgainst);

        //update the data to be sorted by this new target
        finalResults = Sort(finalResults, filterKey);
        console.log(finalResults);
    }

    /*
    Organizes results in alphabetical/date order by sorting filter (like by title, author)
    (input: data source to sort)
    (filterKey: parameter name of sorting filter in filters to sort by)
    */
    function Sort(input, filterKey) {
        //sort alphabetically
        input.sort(function (a, b) {
            //sort based on sortBy field selected
            var currentSort = filters[filterKey].FilterAgainst;
            if (a[currentSort] < b[currentSort]) {
                return -1;
            } else {
                return 1;
            }
        });

        //give back sorted input
        return input;
    }

    /* ----------------------- Array extra functions ----------------------- */
    //Adds includes method for browsers that dont support
    // thanks: https://stackoverflow.com/questions/31221341/ie-does-not-support-includes-method
    return {
        setters: [function (_4) {
            ImageHoverSwap = _4['default'];
        }, function (_2) {
            _Object$keys = _2['default'];
        }, function (_3) {}, function (_e) {
            _ = _e['default'];
        }],
        execute: function () {
            'use strict';

            _export('default', FiltersBar);

            /* ----------------------- Global variables ----------------------- */
            filters = {};
            database = //placeholder data obj
            [{
                Title: "Harry Potter and the Half Blood Prince",
                Sign: ["fsl_luzon", "asl"],
                Written: ["English", "British"],
                Author: "JK Rowling",
                DatePublished: "7/16/2005",
                LastUpdated: "7/19/2009"
            }, {
                Title: "Harry Potter and the Cursed Child",
                Sign: ["fsl_luzon", "asl", "fsl_visayas"],
                Written: ["English", "British", "Tagalog"],
                Author: "Jack Thorne",
                DatePublished: "7/30/2016",
                LastUpdated: "7/30/2016"
            }, {
                Title: "Joy of Cooking",
                Sign: ["fsl_mindanao", "fsl_visayas"],
                Written: ["English", "Tagalog"],
                Author: "A",
                DatePublished: "1/1/1931",
                LastUpdated: "1/1/2006"
            }];
            if (!Array.prototype.includes) {
                Object.defineProperty(Array.prototype, "includes", {
                    enumerable: false,
                    value: function value(obj) {
                        var newArr = this.filter(function (el) {
                            return el == obj;
                        });
                        return newArr.length > 0;
                    }
                });
            }
        }
    };
});
$__System.register('a', ['11', '12', '13', '22', 'd'], function (_export) {
    //import 'style/Viewer.css!';
    //import html from 'html/Client/Viewer.html!text';

    'use strict';

    var Carousel, ImageHoverSwap, StoryViewer, FiltersBar, StoryPreview, totalLikes, canLike;

    function SetVideoTitle(titleName) {
        var title = document.getElementById("title");
        title.innerHTML = titleName;
    }

    function SetAuthorInfo(authorName, authorImage) {
        var user = document.getElementById("uploader");
        user.innerHTML = "<img src = " + authorImage + " /> " + authorName;
    }

    function updateLikes() {

        if (canLike) {
            totalLikes++;
            document.getElementById("likes").innerHTML = "Likes: " + totalLikes;
            canLike = false;
        }
        document.getElementById("likeClick").style.backgroundColor = "#0098ba";
    }

    function SetViewLikeCounts(viewCount, likeCount) {
        document.getElementById("likes").innerHTML = "Likes: " + likeCount;
        totalLikes = likeCount;
        document.getElementById("likeClick").onclick = function () {

            if (canLike) {
                totalLikes++;
                document.getElementById("likes").innerHTML = "Likes: " + totalLikes;
                canLike = false;
            }
        };

        console.log(canLike);

        document.getElementById("views").innerHTML = "Views: " + viewCount;
    }

    function SetDescriptionText(description) {
        document.getElementById("Description").innerHTML = description;
    }

    function GenerateGenres(Genres) {
        var holder = document.getElementById("genres");
        for (var x = 0; x < Genres.length; x++) {
            var innerText = "<div class = 'category'>" + Genres[x] + "</div>";
            holder.innerHTML += innerText;
        }
    }

    function GenerateTage(Tags) {
        var holder = document.getElementById("tags");
        for (var x = 0; x < Tags.length; x++) {
            var innerText = "<div class = 'category'>#" + Tags[x] + "</div>";
            holder.innerHTML += innerText;
        }
    }

    return {
        setters: [function (_) {
            Carousel = _['default'];
        }, function (_3) {
            ImageHoverSwap = _3['default'];
        }, function (_2) {
            StoryViewer = _2['default'];
        }, function (_4) {
            FiltersBar = _4['default'];
        }, function (_d) {
            StoryPreview = _d['default'];
        }],
        execute: function () {
            canLike = true;
            $(document).ready(function () {
                //update main section of page

                $('main').html(html);

                SetVideoTitle("Test");
                SetAuthorInfo("Chase", "img/icons/user.png");
                SetViewLikeCounts(1000000, 2000);
                SetDescriptionText("  Chicken buffalo biltong, corned beef frankfurter tenderloin leberkas ball tip chuck. Beef ribs turducken pancetta spare ribs ham. Sirloin meatloaf tri-tip shank strip steak, short loin ground round shoulder fatback. Shoulder prosciutto beef, ham short loin picanha pork chop fatback short ribs. Short ribs prosciutto tri-tip, chuck landjaeger sirloin strip steak jowl bresaola fatback picanha kevin. Ground round cupim andouille, pastrami burgdoggen beef jerky beef ribs fatback porchetta. Biltong ground round tri-tip landjaeger, meatball tenderloin shoulder turkey capicola.");
                GenerateGenres(["Folk", "Fantasy"]);
                GenerateTage(["folktale", "fantasy"]);

                $.ajax({
                    method: 'get',
                    url: './api/stories'
                }).done(function (stories) {
                    console.log(stories);
                    var storyOne = [];
                    for (var i = 0; i < 9; i++) {
                        var sp = new StoryPreview({
                            id: i + 1,
                            metadata: {
                                title: {
                                    english: 'Aesop Fables: The Clever Donkey'
                                },
                                description: {
                                    english: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.'
                                }
                            },
                            author: 'Massimo V.',
                            coverImage: 'img/carousel/from_this_author/1.png'
                        });
                        storyOne.push(sp);
                    }
                    new Carousel("#more-stories", storyOne, 4, false, false, "Similar Stories");
                }).fail(function (err) {});

                $.ajax({
                    method: 'get',
                    url: './api/stories'
                }).done(function (stories) {
                    console.log(stories);
                    var storyTwo = [];
                    for (var i = 0; i < 9; i++) {
                        var sp = new StoryPreview({
                            id: i + 1,
                            metadata: {
                                title: {
                                    english: 'Aesop Fables: The Clever Donkey'
                                },
                                description: {
                                    english: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.'
                                }
                            },
                            author: 'Massimo V.',
                            coverImage: 'img/carousel/from_this_author/1.png'
                        });
                        storyTwo.push(sp);
                    }
                    new Carousel("#more-author", storyTwo, 4, false, false, "More from this Author");
                }).fail(function (err) {});

                FiltersBar('index', true);
                /* var storyTwo = [];
                 for (var i = 0; i < 9; i++) {
                     let sp = new StoryPreview({
                         id: i + 1,
                         title: 'Aesop Fables: The Clever Donkey',
                         author: 'Massimo V.',
                         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex nibh, euismod in arcu quis, porttitor tincidunt ipsum. Orci varius natoque penatibus et magnis dis.',
                         coverImage: 'img/carousel/from_this_author/1.png'
                     });
                     storyTwo.push(sp);
                   }
                 */

                var modal = document.getElementById('id01');

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };
                document.getElementById("exit-modal").onclick = function () {
                    modal.style.display = "none";
                };

                var xmlhttp = new XMLHttpRequest();
                var dataURL = "../../text/Malakas_Maganda.json";
                var storyObj = null;

                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //get data from json
                        storyObj = JSON.parse(this.responseText);

                        //build story viwer functionality and pass in page data
                        StoryViewer(storyObj);
                    }
                };
                xmlhttp.open("GET", dataURL);
                xmlhttp.send();

                //add hover
            });
        }
    };
});
(function(c){if (typeof document == 'undefined') return; var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[a](d.createTextNode(c));})
(".story-preview{position:relative;display:inline-block;float:left;width:33.33333%;max-height:100%;padding:15px}.story-preview .cover-image-container,.story-preview .meta-data-container{position:absolute;height:calc(100% - 30px);width:calc(100% - 30px);background-color:#004e74;background-size:contain;background-repeat:no-repeat;background-position:50%}.story-preview .meta-data-container{display:none;background-color:#004E74F0;padding:10px;color:#fff;overflow:auto}.story-preview:hover .meta-data-container{display:block}.story-preview .info-button{display:none;position:absolute;z-index:1;bottom:10px;left:10px}.story-preview .title{font-size:1.25em;margin-bottom:5px}.story-preview .author{font-size:.75em;margin-bottom:5px}.story-preview .description{font-size:1em}.carousel{height:100%;width:100%}.carousel .carousel-nav{position:relative;float:left;height:100%;width:10%;border:none;background:none}.carousel .image-holder{position:relative;float:left;height:calc(100% - 30px);width:80%;overflow:hidden;white-space:nowrap;display:inline-block}.carousel .carousel-panel{height:100%;-webkit-transition:all 2s ease 0s;transition:all 2s ease 0s}.carousel .image-holder.outerIndicator{margin:15px;height:calc(100% - 30px);width:calc(80% - 30px);border:15px solid #004e74;border-bottom-width:0;border-top-width:0;padding-bottom:40px;border-radius:7px;background-color:#004e74}.carousel.single .left{margin-left:10%}.carousel.single .right{margin-right:10%}.carousel.single .image-holder{width:60%}.carousel.single .image-holder.outerIndicator{width:calc(40% - 30px)}.image-holder img{display:inline-block}.carousel .carousel-nav-img{width:50%;-webkit-transition:background-color .6s,border-color .6s,width .3s,height .3s;transition:background-color .6s,border-color .6s,width .3s,height .3s;padding:5px;border-style:solid;border-radius:50%;border-color:#0098ba;background-color:#0098ba}.pageTitle.overlay{background-color:rgba(0,78,116,.85);padding-top:0;z-index:1;width:100%;height:35px;-webkit-transition:opacity .5s;transition:opacity .5s;color:#fff;top:35px}.pageTitle.overlay span{font-size:23px}.pageTitle{padding-top:5px;color:#fff;text-align:center;font-family:Segoe UI,Arial,Helvetica,sans-serif}.page-indicator.overlay,.pageTitle{background-color:#004e74;width:100%;height:25px;position:relative}.page-indicator.overlay{z-index:1;opacity:.7;top:-64px}.page-indicator{background-color:#004e74;width:100%;position:absolute;left:0;bottom:0}.dots{display:block;position:relative;margin-left:auto;margin-right:auto}.dot{display:inline-block;border-style:solid;border-radius:50%;border-color:#0098ba;background-color:#0098ba;height:10px;width:10px;margin:7px 5px 5px}.dot#current{border-color:#fff;background-color:#fff;-webkit-transition:background-color 2s,border-color 2s;transition:background-color 2s,border-color 2s}.carousel.single .overlay~.carousel-panel .story-preview .cover-image-container{width:100%}.carousel.single .overlay~.carousel-panel .meta-data-container{-webkit-transform:translate(0);transform:translate(0);width:100%}.image-holder .story-preview{width:100%;height:100%;background-color:#004e74;padding:0}.image-holder .story-preview .cover-image-container{width:calc(100% - 30px)}.hovereable{display:inline-block;height:100%}.image-holder .meta-data-container{white-space:normal;width:100%}.filters{width:80%;height:85px;display:block;color:#fff;margin-left:auto;margin-right:auto;z-index:2}.filter,.filters{padding:10px;position:relative}.filter{width:31.33333%;height:100%;display:inline-block;vertical-align:top}.filter button{border:solid;border-radius:150px;border-color:#004e74;font-size:.7em;text-align:center;background-color:#004e74;color:#fff;width:100%;height:100%;padding:5%;padding-top:7%;position:relative;z-index:1}#SortByFilter,#WrittenLanguageFilter{margin-left:3%}.filter button img{height:30px;width:45px;margin-left:-15px;bottom:9px;position:relative;float:left;vertical-align:middle}@media (min-width:900px){.filter button{font-size:.8em;padding-top:5%}.filter button img{bottom:10px;height:36px;width:54px}}@media (min-width:1050px){.filter button{font-size:1em;padding-top:3.5%}.filter button img{bottom:8px}}@media (min-width:1200px){.filter button{font-size:1.3em;padding-top:2%}.filter button img{bottom:4px}}.filter button img.dropdownIcon{height:18px;width:27px;position:relative;float:right;padding-left:5px;padding-right:0;margin-left:0;margin-right:-5px;bottom:0}@media (min-width:900px){.filter button img.dropdownIcon{height:22px;width:33px}}.filter button:hover{cursor:pointer;border-color:#fff}#options{position:absolute;display:none;width:calc(100% - 20px);background-color:#195f81;border-bottom-left-radius:10px;border-bottom-right-radius:10px;border:none;padding:5px;padding-top:30px;top:60%;left:10px;margin-left:auto;margin-right:auto}.container{display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;font-size:18px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.container input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.checkmark{position:absolute;top:3px;left:0;height:20px;width:20px;background-color:#eee;margin-left:8px;border-radius:25%}.container:hover input~.checkmark{background-color:#99b8c7}.container input:checked~.checkmark{background-color:#004e74}.checkmark:after{content:\"\";position:absolute;display:none}.container input:checked~.checkmark:after{display:block}.container .checkmark:after{left:5.5px;top:2.5px;width:5px;height:10px;border:solid #fff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);transform:rotate(45deg)}select#options{color:#fff;font-size:18px;cursor:pointer}select#options:focus-within{border-bottom-left-radius:0;border-bottom-right-radius:0}select#options option{cursor:pointer;border-bottom-left-radius:10px;border-bottom-right-radius:10px}select#options:hover{border-bottom-left-radius:none;border-bottom-right-radius:none}\n/*# sourceMappingURL=__.css.map */");
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    factory();
});
//# sourceMappingURL=output-file.js.map
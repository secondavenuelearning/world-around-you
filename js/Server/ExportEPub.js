const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ValidateUser = require('./ValidateUser.js');
const Settings = require('./Settings');
const Epub = require("epub-gen");
const StoryDB = require('./StoryDB.js');
const Request = require('request');

    //new Epub(option, "/epub/pathtest.epub");
    //new Epub(option, path.resolve(__dirname, "../../epub/book7.epub"));

    function GenerateMeta(story, lang, _url){
    /*
    Required Data
        dc:title : Title of the book
        dc:description: Description of the book
        dc:creator: Name of author
        dc:language: A BCP47 compliant language tag (RFC5646)
        dc:identifier: Unique identifier for the book (preferably an UUID)
        dc:date: The publication date of the document
        dc:publisher: Name of the publisher of the document
        dc:rights: The license speficied as an SPDX License identifier (SPDX Licenses)
    Optional
        dc:contributor: One or more describing additional contributors to the epub. Should be refined using meta-refines.
        */
        return new Promise((resolve, reject) => {
            var title = "";
            if(story.metadata.title[lang]){
                title = story.metadata.title[lang];
            }
            else if(story.metadata.title[story.metadata.writtenLanguages[0]]){
                title = story.metadata.title[story.metadata.writtenLanguages[0]];
            }
            else{
                title = "Title";
            }
            var option = {
            title:  title, // *Required, title of the book.
            author: story.author, // *Required, name of the author.
            cover: EditImageString(story.coverimage, _url), // Url or File path, both ok.
            lang: findLangCode(lang),
            url: _url + "/View?id=" + story.id,
            signer: story.metadata.signer[lang],
            translator: 'translator' in story.metadata.translator? story.metadata.translator[lang] : "",
            content:[],
            verbose: true
        };
        //console.log(option);
        return resolve(option);
    }).catch(() => {
        console.error("Issue with Generating Meta");
    });
}

function EditImageString(imagePath, url){
    let temp = "";
    if(imagePath.indexOf('png') != -1){
        temp = url +"/" + imagePath.substring(0,imagePath.indexOf('png') + 'png'.length);
    }
    else if(imagePath.indexOf('jpg') != -1){
        temp = url +"/" + imagePath.substring(0,imagePath.indexOf('jpg') + 'jpg'.length); 
    }
    else if(imagePath.indexOf('jpeg') != -1){
        temp = url +"/" + imagePath.substring(0,imagePath.indexOf('jpeg') + 'jpeg'.length);
    }
    return temp;
}


function GenerateEPubContent(story, data, url, writtenLang, signLang){

    return new Promise((resolve, reject) => {
        GenerateMeta(story, writtenLang, url).then(option => {
            var content = {
                data:""
            };
            for(var i = 0; i < data.length; i++){
                content = {
                    data:""
                };
                content.title = "Chapter " + (i+1);
                if(data[i].image){
                    content.data += "<img src='" + EditImageString(data[i].image, url) + "'>";
                }
                if(data[i].text[writtenLang]){
                    content.data += "<p>" + data[i].text[writtenLang] + "</p>";
                }
                if(data[i].video[signLang]){
                    content.data += "<video width='320' height='240' controls='controls' preload='auto' poster='"+ option.cover +"'> <source src='" + url + "/" + data[i].video[signLang] + "#t=0"; 
                    content.data += "' type='video/mp4'><p>Sorry, it appears you system does not support video playback.</p></video>";
                }
                option.content.push(content);
            }
            if(data[0].glossary){
                content = {
                    data:""
                };
                content.title = "Glossary";

                for(var i = 0; i < data.length; i++){
                    //console.log(data[i]);

                    if('glossary' in data[i]){
                        for(const property in data[i].glossary[writtenLang]){
                            if(data[i].glossary[writtenLang][property].image){
                                content.data += "<img src='" + EditImageString(data[i].glossary[writtenLang][property].image, url) + "''>";
                            }
                            content.data += "<p>" + data[i].glossary[writtenLang][property].name + "</p>";
                            content.data += "<p>" + data[i].glossary[writtenLang][property].definition + "</p>";

                            if('video' in data[i].glossary[writtenLang][property] && data[i].glossary[writtenLang][property].video[signLang]){
                                content.data += "<video width='320' height='240' controls='controls' preload='auto' poster='"+ option.cover +"'> <source src='" + url + "/" + data[i].video[signLang];
                                content.data += "#t=" + ('start' in data[i].glossary[writtenLang][property].video[signLang] ? data[i].glossary[writtenLang][property].video[signLang].start : "") + ('end' in data[i].glossary[writtenLang][property].video[signLang] ? ( "," + data[i].glossary[writtenLang][property].video[signLang].end): ""); 
                                
                                content.data += "' type='video/mp4'><p>Sorry, it appears you system does not support video playback.</p></video>";
                            }     
                        }
                    }
                }
                option.content.push(content);
            }
            //console.log(option);
            var filePath = "epub/" + option.title + "-" + option.lang + "-" + signLang +".epub";
            //let path = option.title + "-" + option.lang + "-" + signLang +".epub";
            filePath = filePath.split(' ').join('');
            filePath = filePath.split(/[,\#!$?%\^&\*;:{}=\'"`~()]/g).join('');
            var pub = new Epub(option, filePath).promise.then((option, _resolve) => {
                pub = null;
                return resolve(filePath.toString());
                //return resolve();
            }).catch((_err) => {
                console.log("[Error]: " + _err);
                return reject(_err);
            });

            scheduleGc();

        }).catch((err) => {
            console.log("[Error]: " + err);
            return reject(err);
        });
    });
}

function SetCurrentWrittenLanguage(language){
    curWrittenLang = language;
}

function SetCurrentSignLanguage(language){
    curSignLang = language;
}
 var nextMinutes = Math.random() * 30 + 15;
function scheduleGc() {
    if (!global.gc) {
        console.log('Garbage collection is not exposed');
        return;
    }

    setTimeout(function(){
        global.gc();
        console.log('Manual gc', process.memoryUsage());
        scheduleGc();
    }, nextMinutes * 60 * 1000);
}

    //var ExportEPub = new Object();
    function ExportEPub (){
    }

    ExportEPub.prototype.generateContent = function(story, data, url, _writtenLang, _signLang){
        let curWrittenLang = _writtenLang ? _writtenLang : "english",
        curSignLang = _signLang ? _signLang :"asl";
        console.log(curWrittenLang + " " + curSignLang);
        return GenerateEPubContent(story, data, url, curWrittenLang, curSignLang);
    };

    let langCodes = {
        "Abkhazian":"ab",
        "Afar": "aa",
        "Afrikaans": "af",
        "Akan": "ak",
        "Albanian": "sq",
        "Amharic": "am",
        "Arabic": "ar",
        "Aragonese": "an",
        "Armenian": "hy",
        "Assamese": "as",
        "Avaric": "av",
        "Avestan": "ae",
        "Aymara": "ay",
        "Azerbaijani": "az",
        "Bambara": "bm",
        "Bashkir": "ba",
        "Basque": "eu",
        "Belarusian": "be",
        "Bengali ": "bn",
        "Bangla ": "bn",
        "Bihari": "bh",
        "Bislama": "bi",
        "Bosnian": "bs",
        "Breton": "br",
        "Bulgarian": "bg",
        "Burmese": "my",
        "Catalan": "ca",
        "Chamorro": "ch",
        "Chechen": "ce",
        "Chichewa": "ny",
        "Chewa": "ny",
        "Nyanja": "ny",
        "Chinese": "zh",
        "Chinese (Simplified)": "zh-Hans",
        "Chinese (Traditional)": "zh-Hant",
        "Chuvash": "cv",
        "Cornish": "kw",
        "Corsican": "co",
        "Cree": "cr",
        "Croatian": "hr",
        "Danish": "da",
        "Divehi": "dv",
        "Dhivehi": "dv",
        "Maldivian": "dv",
        "Dutch": "nl",
        "Dzongkha": "dz",
        "English": "en",
        "Esperanto": "eo",
        "Estonian": "et",
        "Ewe": "ee",
        "Faroese": "fo",
        "Fijian": "fj",
        "Finnish": "fi",
        "French": "fr",
        "Fula": "ff",
        "Fulah": "ff",
        "Galician": "gl",
        "Gaelic (Scottish)": "gd",
        "Gaelic (Manx)": "gv",
        "Georgian": "ka",
        "German": "de",
        "Greek": "el",
        "Greenlandic": "kl",
        "Guarani": "gn",
        "Gujarati": "gu",
        "Haitian Creole": "ht",
        "Hausa": "ha",
        "Hebrew": "he",
        "Herero": "hz",
        "Hindi": "hi",
        "Hiri Motu": "ho",
        "Hungarian": "hu",
        "Icelandic": "is",
        "Ido": "io",
        "Igbo": "ig",
        "Indonesian": "id",
        "Interlingua": "ia",
        "Interlingue": "ie",
        "Inuktitut": "iu",
        "Inupiak": "ik",
        "Irish": "ga",
        "Italian": "it",
        "Japanese": "ja",
        "Javanese": "jv",
        "Kalaallisut": "kl",
        "Greenlandic": "kl",
        "Kannada": "kn",
        "Kanuri": "kr",
        "Kashmiri": "ks",
        "Kazakh": "kk",
        "Khmer": "km",
        "Kikuyu": "ki",
        "Kinyarwanda (Rwanda)": "rw",
        "Kirundi": "rn",
        "Kyrgyz": "ky",
        "Komi": "kv",
        "Kongo": "kg",
        "Korean": "ko",
        "Kurdish": "ku",
        "Kwanyama": "kj",
        "Lao": "lo",
        "Latin": "la",
        "Latvian (Lettish)": "lv",
        "Limburgish ( Limburger)": "li",
        "Lingala": "ln",
        "Lithuanian": "lt",
        "Luga-Katanga": "lu",
        "Luganda": "lg",
        "Ganda": "lg",
        "Luxembourgish": "lb",
        "Manx": "gv",
        "Macedonian": "mk",
        "Malagasy": "mg",
        "Malay": "ms",
        "Malayalam": "ml",
        "Maltese": "mt",
        "Maori": "mi",
        "Marathi": "mr",
        "Marshallese": "mh",
        "Moldavian": "mo",
        "Mongolian": "mn",
        "Nauru": "na",
        "Navajo": "nv",
        "Ndonga": "ng",
        "Northern Ndebele": "nd",
        "Nepali": "ne",
        "Norwegian": "no",
        "Norwegian bokmål": "nb",
        "Norwegian nynorsk": "nn",
        "Nuosu": "ii",
        "Occitan": "oc",
        "Ojibwe": "oj",
        "Old Church Slavonic": "cu",
        "Old Bulgarian": "cu",
        "Oriya": "or",
        "Oromo (Afaan Oromo)": "om",
        "Ossetian": "os",
        "Pāli": "pi",
        "Pashto": "ps",
        "Pushto": "ps",
        "Persian (Farsi)": "fa",
        "Polish": "pl",
        "Portuguese": "pt",
        "Punjabi (Eastern)": "pa",
        "Quechua": "qu",
        "Romansh": "rm",
        "Romanian": "ro",
        "Russian": "ru",
        "Sami": "se",
        "Samoan": "sm",
        "Sango": "sg",
        "Sanskrit": "sa",
        "Serbian": "sr",
        "Serbo-Croatian": "sh",
        "Sesotho": "st",
        "Setswana": "tn",
        "Shona": "sn",
        "Sichuan Yi": "ii",
        "Sindhi": "sd",
        "Sinhalese": "si",
        "Siswati": "ss",
        "Slovak": "sk",
        "Slovenian": "sl",
        "Somali": "so",
        "Southern Ndebele": "nr",
        "Spanish": "es",
        "Sundanese": "su",
        "Swahili (Kiswahili)": "sw",
        "Swati": "ss",
        "Swedish": "sv",
        "Tagalog": "sv",
        "Filipino": "sv",
        "Tahitian": "sv",
        "Tajik": "sv",
        "Tamil": "sv",
        "Tatar": "sv",
        "Telugu": "sv",
        "Thai": "sv",
        "Tibetan": "sv",
        "Tigrinya": "sv",
        "Tonga": "sv",
        "Tsonga": "sv",
        "Turkish": "sv",
        "Turkmen": "sv",
        "Twi": "sv",
        "Uyghur": "ug",
        "Ukrainian": "uk",
        "Urdu": "ur",
        "Uzbek": "uz",
        "Venda": "ve",
        "Vietnamese": "vi",
        "Volapük": "vo",
        "Wallon": "wa",
        "Welsh": "cy",
        "Wolof": "wo",
        "Western Frisian": "fy",
        "Xhosa": "xh",
        "Yiddish": "yi",
        "Yoruba": "yo",
        "Zhuang": "za",
        "Chuang": "zu",
        "Zulu": "zu"
    }

    function findLangCode(storyLang){
        let code = "en",
        temp = "";
        for(const property in langCodes){
            temp = property.toLowerCase();
            if(temp == storyLang || storyLang.indexOf(temp) != -1)
            {
                code = langCodes[property];
                break;
            }    
        }
        return code;
    };

    let _ExportEPub = new ExportEPub();    
    module.exports = _ExportEPub;

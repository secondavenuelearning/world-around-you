const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ValidateUser = require('./ValidateUser.js');
const Settings = require('./Settings');
const Epub = require("epub-gen");
const StoryDB = require('./StoryDB.js');

    //new Epub(option, "/epub/pathtest.epub");
    //new Epub(option, path.resolve(__dirname, "../../epub/book7.epub"));
    let curWrittenLang = "english",
    curSignLang = "asl";

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
            let title;
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
            translator: story.metadata.translator[lang],
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
            let content = {
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
                content.data = "<p>Glossary</p>";
                for(const property in data[0].glossary[writtenLang]){
                    if(data[0].glossary[writtenLang][property].image){
                        content.data += "<img src='" + EditImageString(data[0].glossary[writtenLang][property].image, url) + "''>";
                    }
                    content.data += "<p>" + data[0].glossary[writtenLang][property].name + "</p>";
                    content.data += "<p>" + data[0].glossary[writtenLang][property].definition + "</p>";

                    if(data[0].glossary[writtenLang][property].video){
                        content.data += "<video width='320' height='240' controls='controls' preload='auto' poster='"+ option.cover +"'> <source src='" + url + "/" + data[0].video[signLang];
                        content.data += "#t=" + (data[0].glossary[writtenLang][property].video[signLang].start ? data[0].glossary[writtenLang][property].video[signLang].start : "0") + "," + data[0].glossary[writtenLang][property].video[signLang].end; 
                        content.data += "' type='video/mp4'><p>Sorry, it appears you system does not support video playback.</p></video>";
                    }         
                }
                option.content.push(content);
            }
            //console.log(data);
            //console.log(option);
            let filename = "epub/" + option.title + " - " + option.author + " - " + option.lang + " - " + signLang +".epub";
            new Epub(option, filename);
            
            if(FileCheck(filename)){
                resolve(filename);
            }
            /*new Epub(option, "epub/" + option.title + " - " + option.author + " - " + option.lang + " - " + signLang +".epub").promise.then((option, resolve) => {
                console.log("wait");
                resolve("epub/" + option.title + " - " + option.author + " - " + option.lang + " - " + signLang +".epub");
            });*/
        }).catch((err) => {
            console.log("[Error]: " + err);
            return reject(err);
        });
    });
}

function FileCheck(filename){
    console.log("hello");
    fs.access(filename, fs.constants.F_OK, (err) =>{
        if(err){
            console.log("here");
            setTimeout(() => FileCheck(filename), 200);
            return false;
        }
        else{
            return true;
        }
    });
    //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
}

function SetCurrentWrittenLanguage(language){
    curWrittenLang = language;
}

function SetCurrentSignLanguage(language){
    curSignLang = language;
}

    //var ExportEPub = new Object();
    function ExportEPub (){
    }

    ExportEPub.prototype.generateContent = function(story, data, url, writtenLang, signLang){
        return GenerateEPubContent(story, data, url, writtenLang, signLang);
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
            console.log(code);
            code = langCodes[property];
            break;
        }    
    }
    return code;
};

    let _ExportEPub = new ExportEPub();    
    module.exports = _ExportEPub;

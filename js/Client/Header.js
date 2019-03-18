import 'style/Header.css!';
import _ from 'underscore';
import LanguageSelector from 'js/Client/LanguageSelector';
import ImageHoverSwap from 'js/Client/HelperFunctions.js'
import html from 'html/Client/Header.html!text';

var template = _.template(html);

$(document).ready(function(){
  
	LanguageSelector.appendTo($('header')[0]);

	var el = template({});
	$('header').append(el);
       ImageHoverSwap("div#nav-user", "img#accountHover", "../../img/icons/NavBar/nav_acct.svg", "../../img/icons/NavBar/nav_acct_hoverDown.svg" );
    
    
     ImageHoverSwap("span#nav-stories-icon", "img#storiesImg", "../../img/icons/NavBar/nav_stories.svg", "../../img/icons/NavBar/nav_stories_hoverDown.svg");
    
    
     ImageHoverSwap("span#nav-game-icon", "img#gamesIcon", "../../img/icons/NavBar/nav_games.svg", "../../img/icons/NavBar/nav_games_hoverDown.svg" );
    
    
     ImageHoverSwap("span#nav-games-icon", "img#buildImg", "../../img/icons/NavBar/nav_SB.svg", "../../img/icons/NavBar/nav_SB_hover_selected.svg" );
   
});
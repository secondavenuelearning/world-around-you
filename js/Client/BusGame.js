import 'style/BusGame.css!';
import html from 'html/Client/BusGame.html!text';


$(document).ready(function () {
    //update main section of page

    $('main').html(html);

    var xmlhttp = new XMLHttpRequest();
    var dataURL = "../../text/Malakas_Maganda.json";
    var storyObj = null;
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) 
      {
        //get data from json
        storyObj = JSON.parse(this.responseText);
          
        //build story viwer functionality and pass in page data
        //StoryViewer(storyObj);
      }
    };
    xmlhttp.open("GET", dataURL);
    xmlhttp.send();
});

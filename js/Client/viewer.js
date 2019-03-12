import 'style/viewer.css!';
import html from 'html/Client/Viewer.html!text';
import StoryViewer from 'js/Client/StoryViewer.js';

function SetVideoTitle(titleName) {
    var title = document.getElementById("title");
    title.innerHTML = titleName;
}

function SetAuthorInfo(authorName, authorImage) {
    var user = document.getElementById("uploader");
    user.innerHTML = "<img src = " + authorImage + " /> " + authorName;

}

function SetViewLikeCounts(viewCount, likeCount) {
    document.getElementById("likes").innerHTML = "Likes: " + likeCount;
    document.getElementById("views").innerHTML = "Views: " + viewCount;
}
function SetDescriptionText(description){
    document.getElementById("Description").innerHTML = description;
}
function GenerateGenres(Genres){
    var holder = document.getElementById("genres");
    for(var x = 0; x<Genres.length; x++){
       var innerText = "<div class = 'category'>" + Genres[x] + "</div>";
        holder.innerHTML += innerText;
        
    }
}
function GenerateTage(Tags){
      var holder = document.getElementById("tags");
    for(var x = 0; x<Tags.length; x++){
       var innerText = "<div class = 'category'>#" + Tags[x] + "</div>";
        holder.innerHTML += innerText;
        
    }
}
$(document).ready(function () {
    //update main section of page

    $('main').html(html);
    SetVideoTitle("Test");
    SetAuthorInfo("Chase", "img/icons/user.png");
    SetViewLikeCounts(1000000, 2000);
    SetDescriptionText("  Chicken buffalo biltong, corned beef frankfurter tenderloin leberkas ball tip chuck. Beef ribs turducken pancetta spare ribs ham. Sirloin meatloaf tri-tip shank strip steak, short loin ground round shoulder fatback. Shoulder prosciutto beef, ham short loin picanha pork chop fatback short ribs. Short ribs prosciutto tri-tip, chuck landjaeger sirloin strip steak jowl bresaola fatback picanha kevin. Ground round cupim andouille, pastrami burgdoggen beef jerky beef ribs fatback porchetta. Biltong ground round tri-tip landjaeger, meatball tenderloin shoulder turkey capicola.");
    GenerateGenres(["Folk", "Fantasy"]);
    GenerateTage(["folktale", "fantasy"]);
    
    //add story functionality
    StoryViewer();
});

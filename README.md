
# World Around You

A digital library of stories, created collaboratively by Deaf and hearing people for Deaf children and their families, the school community, and the Deaf community. It is a web platform designed to make collaboration easy for uploading and editing contents for reading and viewing. It provides a space to watch, read, interact, like, share, comment, upload, and edit the contents. 

This repo holds the style guides, wireframes, and prototype implementation of the reader's view, beginning with Filipino Sign Language (FSL).

In the reader's view, each dot along the main slider bar represents a page in the story. Each page has 3 components, or sub-pages: 1) photo, 2) signed video, and 3) glossary interactivity. A sample story is shown in this prototype: "Malakas and Maganda." 

All dependencies are included. This prototype can run offline.


## Dependencies

- nodejs (https://nodejs.org/en/)
- mysql database
- git (https://git-scm.com/downloads)


## Repo architecture

```
|_ data_templates - Template describing how the JSON data is structured
|_ fonts - Font files
|_ html 
  |_ Client - Html templates used but the front end javascript
    |_ Games - Folder to hold the directories for each game added to the website. Each game should be in it's own directory and contain a Editor.js and Main.js file for editing and launching the game.
  |_ Server - Html templates used but the back end javascript
|_ img - Images used in the website
|_ js
  |_ Client - Javascript files use in the front end of the website
  |_ Offline - Javascript files use for when the site is offline
  |_ Server - Javascript files use by the backed nodejs server
    |_ _Settings.js - Base server settings file. Copy this file and name it "Settings.js" before starting the server
|_ style - CSS files for the website
|_ uploads - (git ignored folder) The image and video files uploaded by users for the stories
|_ Server.js - Main file for nodejs server. (run this file in node to start the server)
|_ database.sql - Sql query to run to created the database for the site. Run this before starting the server.
```

## Starting the server
1. Download and install nodejs
2. Download and install git
3. Setup a mysql server
4. In a command line console navigate to the repository
5. Install all the node dependencies by running the following commands:
    - npm install
    - npm install jspm -g
    - jspm install
6. Create you database using the database.sql file
7. Copy the file "js/Server/_Settings.js" file and name the new copy "js/Server/Settings.js"
8. Edit the contents of the new Settings.js file to match the specifications of your server
9. In the command line run node Server.js to start the server

## Adding a game
1. Create a new folder for your game in the 'js/Client/Games/' directory.
2. In the database add an entry into the 'game' table for your game. The 'name' field is the name that will appear in the site, the 'path' field should be the name of the directory added in step 1.
3. In the directory create 2 files 'Editor.js' and 'Main.js', to be used for editing and running the game respectively.
4. In the Editor.js file, game data is save as a json string in the database and must include a propety called 'name' for display purposes.
5. The api call to save game data is (post: /api/story/gamedata) and the data should be formatted to include the following:
    ```
    {
        id: the 
    }
    ```
6. The api call to get game data is (get: api/game/data?id={the id of the game data})
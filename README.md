*****************
* Staged Fright *
*****************


This builds off of Eliot's React/Aframe boilerplate, Meme Magic.

MVP: GOAL
---------

Create a basic setup for public speaking in VR

1) Render an equirectangular image of a conference room or arena, at minimum
2) Better yet, play a 360 video of a crowd
3) Display a speach text before the speaker's eyes
4) Achieve reasonable rendering in both Chrome browser and using the Samsung Gear headset


MVP: WORKING PARTS
------------------

1) The current code plays the video in a loop using the video-sphere element of a-frame.
2) Text is displayed - statically - overlaying the video. The speech text is not collected from the user, but read from a flat-file.


MVP: STEPS FORWARD
------------------

1) The text display properties still need to be adjusted for better user experience when using the headset.
2) Resolve text scrolling and/or shading
  a) investigate and build POC for the experimental build of a-frame that supports text rendering
  b) build POC for representing speech text as an array of lines and replacing them as result of state change in redux
3) Build an entry point panel for the application where the user enters their speach combined with some metrics for its delivery.




MVP: BUILD and EXECUTION
------------------------

    1. $ createdb staged-fright (just for the first time)

    2. Make a `secrets.js` file in the root directory.
      (Also just to start; the secrets file is already in the .gitignore)

      It should contain:

        export default {
          SessionKey: 'WhateverYouWant'
        };


    3. $ npm install
    4. $ npm start 
    5. go to localhost:3001 in Chrome browser


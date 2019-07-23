
Available here: https://sarosim.github.io/2048/index.html

Provide details in your README.md of the logic you have used to build your game as well as an explanation of how you tested your logic


HERE IT STARTS:

# The 2048 game

2048 is a single-player sliding block puzzle game designed by Italian web developer Gabriele Cirulli. 
The game's objective is to slide numbered tiles on a grid to combine them to create a tile with the number 2048. 
However, one can continue to play the game after reaching the goal, creating tiles with larger numbers.

I started to work on the Simon game as the 2nd Milestone Project for the Fullstack Web Developer course of Code Institute. 
One day - when I was still at the planning phase of my version of the Simon game I was playing 2048 on my phone and the idea struck me
to develop my 2048 game instead of Simon. It seemed more challenging and I wanted to test my ability. 

I was right, it was much more complex, it includes complicated logic and a lot to handle. Making it properly responsive had its own challenges as well.

**These are the exact resons why I loved developing it!** I hope you love playing it and I equally hope you like some of my solutions. 

# UX

## Differing from the UX of the original game

I wasn't going to copy the exact user experience of the original game. There were four specific elements I wanted to add:
- a short description of what the game is about (with link to details) and how to play -- even on small screens,
- on-screen arrows for game control,
- my own colour scheme,
- Undo option. (_The original web version of the game didn't include undo option, the mobile app version I used to play has it, but it is not possible to undo at game end..._)

Translating it to user stoies I wanted to:

1. let the user realise what this game is and how to play, regardless of the platform they came accross it.
2. let the user click on-screen buttons for control.
3. provide a harmonic colour experience, while keeping the original idea of changing tile colour with increasing tile value.
4. build in the opportunity of undoing in case of accidentially sliding tiles to unwanted direction or bad luck with random tile position or value when getting a new tile. 
Especially when it results in game over.

Based on these I drew the following wireframes:

[Scan of hand-drawn wireframes](assets/documents/Scan20190723_06.pdf) 

# Design

The final design of the gameboard itself: 
![](assets/documents/game2048_logo.jpg)

# Features

## Gameplay

Description from the original game:

2048 is played on a gray 4×4 grid, with numbered tiles that slide smoothly when a player moves them.
Every turn, a new tile will randomly appear in an empty spot on the board with a value of either 2 or 4.
Tiles slide as far as possible in the chosen direction until they are stopped by either another tile or the edge of the grid. 
If two tiles of the same number collide while moving, they will merge into a tile with the total value of the two tiles that collided. 
The resulting tile cannot merge with another tile again in the same move.

A scoreboard on the top keeps track of the user's score. 
The user's score starts at zero, and is increased whenever two tiles combine, by the value of the new tile. 
As with many arcade games, the user's best score is shown alongside the current score.

The game is won when a tile with a value of 2048 appears on the board, hence the name of the game. After reaching the 2048 tile, players can continue to play (beyond the 2048 tile) to reach higher scores.
When the player has no legal moves (there are no empty spaces and no adjacent tiles with the same value), the game ends.

## Game functionality

On top of the necessary *start game*/*new game*, my version includes:

- Undo 
- On-screen arrows for game control

**Game control option are:**
- Keyboard arrows 
- On-screen arrow buttons 
- Screen swipe for touch-screen devices. 

# Technologies used

[*HTML*](https://en.wikipedia.org/wiki/HTML5) and [*CSS*](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) used for the look and feel of the game, as well as Bootstrap framework, more specifically  **Bootswatch Cyborg theme**. Besides the built in responsive functionality
of Bootstrap, I used further media queries to generate more appropriate size variants and to identify landscape/portrait format. 
I also used [*Sass*](https://en.wikipedia.org/wiki/Sass_(stylesheet_language)) to generate the colour scheme for the game tiles as well as the style attributes for the tile positioning classes.  

The gameplay functionality was developed in [*JavaScript*](https://www.javascript.com/). I used [*jQuery*](https://jquery.com/) library to simplify DOM manipulation.

# Project development

## Development process

At first I concentrated on the maths part of the game and started with a simple grid where I calculated the value of each position of the grid
whenever the user indicated a move. I got stuck with emulating the moves, numbers were changing on the position, but I realised I had 
to use actual tiles and have them sliding on user input. 

Then I implemented the tiles and re-coded the controls. This solution works with two particular classes assigned to each tiles. 
One determines the look and feel of it (colour, font size, font colour), the second sets the position. 

Instead of writing separate functions for moving to each directions I decided to pass the direction as an argument to the function
that handles the swipe. 

In order to manage the undoing of the last moves, the status of the game board and the current score are recorded to respective arrays
before the actual move takes place. Once the user clicks the undo button, the last element is read from both arrays and the previous 
board state and score are reset accordingly. The length of the arrays storing game play and score history is limited, as there can be 
several thousand moves in a single game play. 

## 


# Testing

At a certain point in the development there was a bug causing two tiles appearing at the same board position. In order to find the 
cause of the problem I inserted a function to determine when that happened. I decided to leave it in the final version, just in case, 
although the bug has been eliminated. 

# Deployment

# Credits

I used *Stackoverflow* and *w3schools.com* to help me better understand certain JavaScript functionalities and overcome obstacles as 
well as fix bugs.  Advice from Code Institute Slack community has also helped me to learn about debugging in *JavaScript*. 

Solution for cloning an array to avoid changing with the original array is from Smantha Ming: https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array

Tooltip idea and css solution is from tutorialzine: (https://tutorialzine.com/2014/07/css-inline-help-tips) Create inline help tips for your site with a bit of CSS



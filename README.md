
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

Be careful when playing, it's addictive :)

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

## The final design of the gameboard itself

![alt text](https://github.com/Sarosim/2048/blob/master/assets/images/gameboard.png "game board")

## Mobile layout

![alt text](https://github.com/Sarosim/2048/blob/master/assets/images/preview_index.html_iPhone5_SE.png "Mobile layout")

## Tablet layout

![alt text](https://github.com/Sarosim/2048/blob/master/assets/images/preview_index.html_iPad_landscape.png "tablet landscape")...
![alt text](https://github.com/Sarosim/2048/blob/master/assets/images/preview_index.html_iPad_portrait.png "tablet portrait")

## Desktop layout

![alt text](https://github.com/Sarosim/2048/blob/master/assets/images/desktop.png "laptop/desktop")

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

[*HTML*](https://en.wikipedia.org/wiki/HTML5) and [*CSS*](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) used for the look
and feel of the game, as well as Bootstrap framework, more specifically  **Bootswatch Cyborg theme**. Besides the built in responsive functionality
of Bootstrap, I used further media queries to generate more appropriate size variants and to identify landscape/portrait format. 
I also used [*Sass*](https://en.wikipedia.org/wiki/Sass_(stylesheet_language)) to generate the colour scheme for the game tiles as well as the style attributes for the tile positioning classes.  

The gameplay functionality was developed in [*JavaScript*](https://www.javascript.com/). I used [*jQuery*](https://jquery.com/) library to simplify DOM manipulation.

# Project development

## Development process

### Game board and moves

At first I concentrated on the maths part of the game and started with a simple grid where I calculated the value of each position of the grid
whenever the user indicated a move. I got stuck with emulating the moves, numbers were changing on the position, but I realised I had 
to use actual tiles and have them sliding on user input. 

Then I implemented the tiles and re-coded the controls. This solution works with two particular classes assigned to each tiles. 
One determines the look and feel of it (colour, font size, font colour), the second sets the position. 

Instead of writing separate functions for moving to each directions I decided to pass the direction as an argument to the function
that handles the swipe. 

## Logic I have used to build the game

### Event handlers 

There are event handlers attached to each button as well as the keyboard arrows and touch screen. The 'New game' and 
'Undo' buttons call their respective functions directly, while the arrow keys, buttons and touch-screen swiping call the same function, 
named onUserInput, which takes the direction as its argument.

### New game

The newGame function initializes all the variables, cleans the gameboard by deleting all the content of the game-board div.
and starts the game by randomizing two tiles and waiting for user input.

### Undo

In order to manage the undoing of the last moves, the status of the game board and the current score are recorded to respective arrays
before the actual move takes place. Once the user clicks the undo button, the last element is read from both arrays and the previous 
board state and score are reset accordingly. The length of the arrays storing game play and score history is limited, as there can be 
several thousand moves in a single game play. 

### On user input of direction

The following steps are performed once a user indicated the required direction:

- recording position and value of all tiles currently on the board into the `gamePlayHistory` array,
- recording the current score to the `scoreHistory` array,
- shifting the tiles by passing the direction into the function handling the move `shiftTiles(direction)`.
- checks if there was a move 
- if there was a move then generates a new tile, checks whether there is a potential move otherwise it is game over; 
- updates the score 
- checks if the aim of the game was reached.

### Ending the game

The game can end either:
- if there is no potential move, or
- if the aim of the game is reached and the player doesn’t want to continue playing. 
(Once 2048 reached, they can still continue, but they are congratulated!)

# Testing

## Design and responsiveness

I performed manual tests on available devices (Android 6.0.1 and 8.1 on Sony and Samsung, iPhone 4S, SE and 6, Google Chrome 75.0.3770.142 
both on laptop and desktop) and asked family members to do the same by checking page layout, clicking the link to Wikipedia page
as well as playing the game. I've also checked all different sizes available in Chrome Dev Tools.

The outcome was that in case of landscape orientation on a tablet the screen width is 'large' enough to display the descripton
but it wouldn't fit to the screen. Instead of shrinking the gameboard, I decided to modify the UX and go for the tooltip
for landscape tablets.

Bootstrap makes the page responsive by displaying certain elements differently depending on the screen size, but doesn't 
change the size of the gameboard itself. This created bad user experience, because sizing the gameboard to small mobile screens 
resulted in too small gameboard on larger devices and vice versa. I used media queries and generated three different gameboard size variants
to overcome this issue.

## JavaScript

For the testing of most gameplay solutions I simulated the gameboard by inserting the appropriate 'tiles' into the HTML file,
then faked game in play status in the javaScript by forcing the variable that checks whether there is a game in play. 
(this has been deleted from the production version).

I have also extensively used `debugger`, `alert` and `console.log` to check values of certain variables at any given moment as well as the flow of the code.

**There were several bugs, a few of the interesting ones:**

- At a certain point in the development there was a bug causing two tiles appearing at the same board position. In order to find the 
cause of the problem I inserted a function to determine when that happened. I decided to leave it in the final version
(it is part of the `isItGameOver()` function, just in case, although the bug has been eliminated. 

- Pressing the arrow buttons/keys fast resulted in starting another move, before the previous move has finished. 
To overcome the problem, I implemented a `readyStatus` boolean variable, 
set it to `false` every time when an actual move starts. When the new tile has been generated and displayed after a move, it is set to `true`.
On user input, if the `readyStatus` isn't `true` the user input is neglected.

## Testing against the user stories

1. "let the user realise what this game is and how to play, regardless of the platform they came accross it." --> either the tooltip 
or the description under the gameboard informs the user.
2. let the user click on-screen buttons for control. --> done, works nice (hover status is simulated briefly when touch-screen is swiped)
3. provide a harmonic colour experience, while keeping the original idea of changing tile colour with increasing tile value. --> Generating the colours by a code helped achieve it.
4. build in the opportunity of undoing in case of accidentially sliding tiles to unwanted direction or bad luck with random tile position or value when getting a new tile. 
Especially when it results in game over. --> specifically tested by generating game over situations, works well.

# Deployment

I deployed the site on GitHub Pages from the master branch. Any future changes committed to the master branch will automatically update the deployed site. 
By default on GitHub, the landing page must be named index.html, therefore it may not be renamed.

I also used GitHub for version control. There was only one isntace I had to revert to an earlier version, but only to the last committed change,
therefore a `git checkout <filename>` solved my issue.

## Differences between the deployed production version and the development version

- production version uses minified javaScript file to reduce file size and loading time and potentially mobile data usage.

# Credits

I used *Stackoverflow* and *w3schools.com* to help me better understand certain JavaScript functionalities and overcome obstacles as 
well as fix bugs.  Advice from Code Institute Slack community has also helped me to learn about debugging in *JavaScript*. 

Solution for cloning an array to avoid changing with the original array is from Samantha Ming: https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array

Tooltip css solution is from tutorialzine: [Create inline help tips for your site with a bit of CSS](https://tutorialzine.com/2014/07/css-inline-help-tips) 

I used JSHint.com to validate my javaScript code. 

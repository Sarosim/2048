
Available here: https://sarosim.github.io/2048/index.html

Provide details in your README.md of the logic you have used to build your game as well as an explanation of how you tested your logic

notes:

Cloning an array: https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array

inline help tips idea and css solution is from tutorialzine, (https://tutorialzine.com/2014/07/css-inline-help-tips) Create inline help tips for your site with a bit of CSS


these are just thoughts for the readme:
- I wanted to include graphs in order to deepen as well as showcase my D3.js knowledge
- 

HERE IT STARTS:

# The 2048 game

2048 is a single-player sliding block puzzle game designed by Italian web developer Gabriele Cirulli. 
The game's objective is to slide numbered tiles on a grid to combine them to create a tile with the number 2048. 
However, one can continue to play the game after reaching the goal, creating tiles with larger numbers.

## Gameplay

2048 is played on a gray 4×4 grid, with numbered tiles that slide smoothly when a player moves them using the four arrow keys.
Every turn, a new tile will randomly appear in an empty spot on the board with a value of either 2 or 4.
Tiles slide as far as possible in the chosen direction until they are stopped by either another tile or the edge of the grid. 
If two tiles of the same number collide while moving, they will merge into a tile with the total value of the two tiles that collided. 
The resulting tile cannot merge with another tile again in the same move. Higher-scoring tiles emit a soft glow.

A scoreboard on the upper-right keeps track of the user's score. 
The user's score starts at zero, and is increased whenever two tiles combine, by the value of the new tile. 
As with many arcade games, the user's best score is shown alongside the current score.

The game is won when a tile with a value of 2048 appears on the board, hence the name of the game. After reaching the 2048 tile, players can continue to play (beyond the 2048 tile) to reach higher scores.
When the player has no legal moves (there are no empty spaces and no adjacent tiles with the same value), the game ends.
// my.js is linked in the bottom of index.html, therefore didn't start with document ready function, may consider...

var gameInPlay = false;
var potentialMove = true;
var gameFields = [0, 0, 0, 0, 0, 2, 4, 4, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0]; 

console.log("gamefields array:", gameFields);

function isThereAMove() {
    potentialMove = false;
    for (var i = 0; i < 15; i++) {
        if (gameFields[i] == 0) {
            return potentialMove = true;
        }
        if ((gameFields[i] == gameFields[i + 1] && i % 4 != 3) || (gameFields[i] == gameFields[i + 4])) {
            return potentialMove = true;
        }
        console.log("which item: ", i, "th", " value: ", gameFields[i], potentialMove);
    }
}

isThereAMove();
console.log("before: ", gameFields);
generateNewField();
console.log("after: ", gameFields);


//checking if there is a potential move, if yes, wait for swipe/button press; if not, game over or undo
if (potentialMove == false) {
    console.log("potentialMove", potentialMove);
    alert("Game Over"); // probably a modal is nicer ...
    gameInPlay = false;
}
else {
    console.log("potentialMove", potentialMove);
}

//Generate new value for one of the empty fields after a move:
//Randomise 2 or 4 for on empty field

function generateNewField() {
    var emptyFields = [];
    var n = 0; //counter for number of empty fields
    for (var k = 0; k < 16; k++) {
        if (gameFields[k] == 0) {
                n++;
                emptyFields.push(k);
            }
        }
    var pickPosition = Math.floor(Math.random() * n); //random number between 0 and one less than the number of empty cells 
    var newValue = ((Math.floor(Math.random() * 1.25)) + 1) * 2; // randomising 2 or 4 as a new value, with 80% probability of the 2
    gameFields[emptyFields[pickPosition]] = newValue;
        }

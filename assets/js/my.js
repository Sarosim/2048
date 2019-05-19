// my.js is linked in the bottom of index.html, therefore didn't start with document ready function, may consider...

var gameInPlay = false;
var potentialMove = true;
var gameFields = [2, 4, 4, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 0, 0, 0, 0];

console.log("gameFields array:", gameFields);

formatGameFields();

isThereAMove();
console.log("before: ", gameFields);
generateNewField();
console.log("after: ", gameFields);


$("#btn-new-game").click(function() {
    //the game board reset should come here, now it is for testing functions
gameInPlay = true;
gameFields = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
generateNewField();
generateNewField();
formatGameFields();
});



//checking if there is a potential move, if yes, wait for swipe/button press; if not, game over or undo
if (potentialMove == false) {
    alert("Game Over"); // probably a modal is nicer ...
    gameInPlay = false;
}


//****************************************************
// F U N C T I O N S     D E F I N E D       H E R E
//****************************************************

function formatGameFields() {
    for (var k = 0; k < 16; k++) {
        var selectedFieldId = "#gf-" + (k+1);
        var itsClass = "gf-value-style-" + gameFields[k];
            for (var m = 0; m<17; m++) {$(selectedFieldId).removeClass("gf-value-style-0").removeClass("gf-value-style-" + Math.pow(2,m));}
            $(selectedFieldId).addClass(itsClass).text(gameFields[k]);
    }
}

function isThereAMove() {
    potentialMove = false;
    for (var i = 0; i < 15; i++) {
        if (gameFields[i] == 0) {
            potentialMove = true;
            return potentialMove;
        }
        if ((gameFields[i] == gameFields[i + 1] && i % 4 != 3) || (gameFields[i] == gameFields[i + 4])) {
            potentialMove = true;
            return potentialMove;
        }
        console.log("which item: ", i, "th", " value: ", gameFields[i], potentialMove);
    }
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
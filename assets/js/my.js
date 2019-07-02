// my.js is linked in the bottom of index.html, therefore didn't start with document ready function, may consider...

var gameInPlay = false;
var potentialMove = true;
var gameFields = [4, 8, 0, 0, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 0, 0, 0, 0];
var fieldsForShift = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];
var wasThereAMove = false;
var score = 0;
var currentHighScore = 0;
var highScoreHistory = [
    ["Miklos", 518],
    ["Matyi", 1352]
];
var gamePlayHistory = [
    [2, 4, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 0, 0, 0, 0]
];
var maxMovesToStore = 10;
var scoreHistory = [0];
var windowWidth;
var windowHeight;

//****************************************************
// F U N C T I O N S     D E F I N E D       H E R E
//****************************************************

//check if there is a potential move
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
    }
}
//check if current score is higher than highscore
function checkHighScore() {
    if (score > currentHighScore) {
        currentHighScore = score;
    }
}

// Functions supporting the move
function deleteTile(x, y) {
    var positionClass = ".gt-position-style-" + x + "-" + y;
    $(positionClass).remove();
}

function changeTileValue(x, y, newValue) {
    var positionClass = ".gt-position-style-" + x + "-" + y;
    var oldValueClass = "gf-value-style-" + newValue / 2;
    var newValueClass = "gf-value-style-" + newValue;
    $(positionClass)
        .text(newValue)
        .removeClass(oldValueClass)
        .addClass(newValueClass);
}

function changeTilePosition(xOld, yOld, xNew, yNew) {
    var oldPositionClass = "gt-position-style-" + xOld + "-" + yOld;
    var newPositionClass = "gt-position-style-" + xNew + "-" + yNew;

    $("." + oldPositionClass)
        .addClass(newPositionClass)
        .removeClass(oldPositionClass);
}

// the actual moving 
function shiftTiles(direction) { //directions: 0-up, 1-left, 2-down, 3-right
    var a, b, vertical, horizontal, x1, y1, x2, y2; //helper variables for the directions
    var fromPosition, toPosition;
    switch (direction) {
        case 3: // right
            a = 3;
            b = -1;
            horizontal = 1;
            vertical = 0;
            break;
        case 1: // left
            a = 0;
            b = 1;
            horizontal = 1;
            vertical = 0;
            break;
        case 2: // down
            a = 3;
            b = -1;
            horizontal = 0;
            vertical = 1;
            break;
        case 0: // up
            a = 0;
            b = 1;
            horizontal = 0;
            vertical = 1;
            break;
    }

    wasThereAMove = false;
    for (var i = 0; i < 4; i++) { //For each 'row' (meaning line of fields of the direction) do the following


        var classOfPosition = [];
        var valueOfThis = [];

        for (var k = 0; k < 4; k++) { // fill the values of the tiles for each position in the row to an array
            classOfPosition[k] = ".gt-position-style-" + ((i + 1) * horizontal + (k + 1) * vertical) + "-" + ((i + 1) * vertical + (k + 1) * horizontal);
            valueOfThis[k] = $(classOfPosition[k]).text();
        }

// Check if there are same value tiles next to each other, or empty in between them; if yes, add them up and shift empty tiles 
        if ((valueOfThis[a + b * 0] > 0) && (valueOfThis[a + b * 0] == valueOfThis[a + b * 1])) {
            x1 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
            deleteTile(x1, y1);
            x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
            changeTileValue(x1, y1, valueOfThis[a + b * 1] * 2);
            x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
            x2 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
            y2 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
            changeTilePosition(x1, y1, x2, y2);
            score += 2 * valueOfThis[a + b * 1];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[a + b * 0] = valueOfThis[a + b * 1] * 2;
            valueOfThis[a + b * 1] = "";

            if ((valueOfThis[a + b * 2] > 0) && (valueOfThis[a + b * 2] == valueOfThis[a + b * 3])) {
                x1 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
                deleteTile(x1, y1);
                x1 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
                changeTileValue(x1, y1, valueOfThis[a + b * 3] * 2);
                x1 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
                changeTilePosition(x1, y1, x2, y2);
                score += 2 * valueOfThis[a + b * 3];
                checkHighScore();
                valueOfThis[a + b * 1] = valueOfThis[a + b * 3] * 2;
                valueOfThis[a + b * 2] = "";
                valueOfThis[a + b * 3] = "";
            }
        }
        if ((valueOfThis[a + b * 0] > 0) && ((valueOfThis[a + b * 0] == valueOfThis[a + b * 2]) && valueOfThis[a + b * 1] == 0)) {
            x1 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
            deleteTile(x1, y1);
            x1 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
            changeTileValue(x1, y1, valueOfThis[a + b * 2] * 2);
            x2 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
            y2 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
            changeTilePosition(x1, y1, x2, y2);
            score += 2 * valueOfThis[a + b * 2];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[a + b * 0] = valueOfThis[a + b * 2] * 2;
            valueOfThis[a + b * 2] = "";
        }
        if ((valueOfThis[a + b * 0] > 0) && ((valueOfThis[a + b * 0] == valueOfThis[a + b * 3]) && valueOfThis[a + b * 1] == 0 && valueOfThis[a + b * 2] == 0)) {
            x1 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
            x1 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
            deleteTile(x1, y1);
            x1 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
            changeTileValue(x1, y1, valueOfThis[a + b * 3] * 2);
            x2 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
            y2 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
            changeTilePosition(x1, y1, x2, y2);
            score += 2 * valueOfThis[a + b * 3];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[a + b * 0] = valueOfThis[a + b * 3] * 2;
            valueOfThis[a + b * 3] = "";
        }
        if ((valueOfThis[a + b * 1] > 0) && (valueOfThis[a + b * 1] == valueOfThis[a + b * 2])) {
            x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
            deleteTile(x1, y1);
            x1 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
            changeTileValue(x1, y1, valueOfThis[a + b * 2] * 2);
            x2 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
            y2 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
            changeTilePosition(x1, y1, x2, y2);
            score += 2 * valueOfThis[a + b * 2];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[a + b * 1] = valueOfThis[a + b * 2] * 2;
            valueOfThis[a + b * 2] = "";
        }
        if ((valueOfThis[a + b * 1] > 0) && ((valueOfThis[a + b * 1] == valueOfThis[a + b * 3]) && valueOfThis[a + b * 2] == 0)) {
            x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
            deleteTile(x1, y1);
            x1 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
            changeTileValue(x1, y1, valueOfThis[a + b * 3] * 2);
            x2 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
            y2 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
            changeTilePosition(x1, y1, x2, y2);
            score += 2 * valueOfThis[a + b * 3];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[a + b * 1] = valueOfThis[a + b * 3] * 2;
            valueOfThis[a + b * 3] = "";
        }
        if ((valueOfThis[a + b * 2] > 0) && (valueOfThis[a + b * 2] == valueOfThis[a + b * 3])) {
            x1 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
            deleteTile(x1, y1);
            x1 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
            y1 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
            changeTileValue(x1, y1, valueOfThis[a + b * 3] * 2);
            x2 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
            y2 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
            changeTilePosition(x1, y1, x2, y2);
            score += 2 * valueOfThis[a + b * 3];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[a + b * 2] = valueOfThis[a + b * 3] * 2;
            valueOfThis[a + b * 3] = "";
        }

// Check if there are empty spaces in the direction of move in front of existing tiles, if yes, shift them
        if (valueOfThis[a + b * 1] != "" || valueOfThis[a + b * 2] != "" || valueOfThis[a + b * 3] != "") {
            while (valueOfThis[a + b * 0] == "") {
                for (var m = 1; m <= 3; m++) {
                    fromPosition = m + 1 + a + (m * b * 2) * a / 3;
                    toPosition = fromPosition - b;
                    x1 = (i + 1) * horizontal + fromPosition * vertical;
                    y1 = (i + 1) * vertical + fromPosition * horizontal;
                    x2 = (i + 1) * horizontal + toPosition * vertical;
                    y2 = (i + 1) * vertical + toPosition * horizontal;
                    changeTilePosition(x1, y1, x2, y2);
                }
                if (b == 1) { valueOfThis.shift(); }
                else { valueOfThis.pop(); }
                if (b == 1) { valueOfThis.push(""); }
                else { valueOfThis.unshift(""); }
                wasThereAMove = true;
            }
        }
        if (valueOfThis[a + b * 2] != "" || valueOfThis[a + b * 3] != "") {
            while (valueOfThis[a + b * 1] == "") {
                for (var m = 2; m <= 3; m++) {
                    fromPosition = m + 1 + a + (m * b * 2) * a / 3;
                    toPosition = fromPosition - b;
                    x1 = (i + 1) * horizontal + fromPosition * vertical;
                    y1 = (i + 1) * vertical + fromPosition * horizontal;
                    x2 = (i + 1) * horizontal + toPosition * vertical;
                    y2 = (i + 1) * vertical + toPosition * horizontal;
                    changeTilePosition(x1, y1, x2, y2);
                }
                if (b == 1) { valueOfThis.shift(); }
                else { valueOfThis.pop(); }
                if (b == 1) { valueOfThis.push(""); }
                else { valueOfThis.unshift(""); }
                wasThereAMove = true;
            }
        }
        if (valueOfThis[a + b * 3] != "") {
            while (valueOfThis[a + b * 2] == "") {
                for (var m = 3; m <= 3; m++) {
                    fromPosition = m + 1 + a + (m * b * 2) * a / 3;
                    toPosition = fromPosition - b;
                    x1 = (i + 1) * horizontal + fromPosition * vertical;
                    y1 = (i + 1) * vertical + fromPosition * horizontal;
                    x2 = (i + 1) * horizontal + toPosition * vertical;
                    y2 = (i + 1) * vertical + toPosition * horizontal;
                    changeTilePosition(x1, y1, x2, y2);
                }
                if (b == 1) { valueOfThis.shift(); }
                else { valueOfThis.pop(); }
                if (b == 1) { valueOfThis.push(""); }
                else { valueOfThis.unshift(""); }
                wasThereAMove = true;
            }
        }
    }
}

function createNewTile(x, y, val) {
    var positionStyle = "gt-position-style-" + x + "-" + y;
    var valueStyle = "gf-value-style-" + val;
    $(".game-board").append('<div class="game-tile text-center new-tile"></div>');
    $(".new-tile")
        .addClass(positionStyle)
        .addClass(valueStyle)
        .text(val)
        .removeClass("new-tile");
}

function generateNewTileData() { //Generate new value for one of the empty fields: Randomise 2 or 4 for on empty field
    var emptyFields = [];
    var n = 0; //counter for number of empty fields
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var pos = ".gt-position-style-" + (i + 1) + "-" + (j + 1);
            if ($(pos).length) {}
            else {
                n++;
                emptyFields.push(i + 1, j + 1);
            }
        }
    }
    var pickPosition = Math.floor(Math.random() * n); //random number between 0 and one less than the number of empty cells 
    var newValue = ((Math.floor(Math.random() * 1.25)) + 1) * 2; // randomising 2 or 4 as a new value, with 80% probability of the 2
    createNewTile(emptyFields[pickPosition * 2], emptyFields[pickPosition * 2 + 1], newValue);
}

function generateNewFieldOld() { //Generate new value for one of the empty fields: Randomise 2 or 4 for on empty field
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
    createNewTile(emptyFields[pickPosition * 2], emptyFields[pickPosition * 2 + 1], newValue);

    const cloneOfGameFields = [...gameFields];
    gamePlayHistory.push(cloneOfGameFields);
    if (gamePlayHistory.length > maxMovesToStore) { // if more moves than max stored, 'forget' of the eldest
        gamePlayHistory.shift();
    }
    scoreHistory.push(score);
    if (scoreHistory.length > maxMovesToStore) {
        scoreHistory.shift();
    }
    formatGameFields();
}

function onUserInput(dir) {
    //  if (gameInPlay) {
    //if (dir == 1) shiftTilesLeft(); //dir(ections): 0-up, 1-left, 2-down, 3-right
    //if (dir == 3) shiftTilesRight(); //dir(ections): 0-up, 1-left, 2-down, 3-right

    shiftTiles(dir);

    if (wasThereAMove == true) {
        $("#current-score").text(score); //                         THIS NEEDS animation later
        $("#best-score").text(currentHighScore); //                         THIS NEEDS animation later
        setTimeout(function() {
            generateNewTileData();
        }, 200);
    }
    isThereAMove();
    if (potentialMove == false) {
        gameInPlay = false;
        alert("Game Over"); // probably a modal is nicer ...
    }
    //   }
}

//****************************************************
//    E V E N T    H A N D L E R S   
//****************************************************

// Buttons on screen

$("#btn-new-game").click(function() {
    gameInPlay = true;
    $(".game-board div").remove();
    setTimeout(function() {
        generateNewTileData();
    }, 50);
    setTimeout(function() {
        generateNewTileData();
    }, 100);
    //The gameplay and score history should be redesigned here for the undo function...................................................................................


    /*    gameInPlay = true;
        gameFields = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        setTimeout(function() {
            generateNewField();
        }, 100);
        setTimeout(function() {
            generateNewField();
        }, 300);
        score = 0;
        gamePlayHistory = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        scoreHistory = [0];
        formatGameFields();*/
});

$("#btn-undo").click(function() {
    if (gameInPlay) {
        //        debugger;
        if (gamePlayHistory.length > 2) {
            gameFields = gamePlayHistory[gamePlayHistory.length - 2];
            gamePlayHistory.pop();
            score = scoreHistory[scoreHistory.length - 2];
            scoreHistory.pop();
            formatGameFields();
        }
    }

});

$("#btn-up").click(function() {
    onUserInput(0); //dir(ections): 0-up, 1-left, 2-down, 3-right
});

$("#btn-left").click(function() {
    onUserInput(1); //dir(ections): 0-up, 1-left, 2-down, 3-right
});

$("#btn-down").click(function() {
    onUserInput(2); //dir(ections): 0-up, 1-left, 2-down, 3-right
});

$("#btn-right").click(function() {
    onUserInput(3); //dir(ections): 0-up, 1-left, 2-down, 3-right
});


// Keyboard

document.onkeydown = function(e) {
    switch (e.key) {
        case 'ArrowUp':
            onUserInput(0); //dir(ections): 0-up, 1-left, 2-down, 3-right
            break;
        case 'ArrowDown':
            onUserInput(2); //dir(ections): 0-up, 1-left, 2-down, 3-right
            break;
        case 'ArrowLeft':
            onUserInput(1); //dir(ections): 0-up, 1-left, 2-down, 3-right
            break;
        case 'ArrowRight':
            onUserInput(3); //dir(ections): 0-up, 1-left, 2-down, 3-right
    }
};

// Touchscreen -- here comes touch screen swipe navigation

//****************************************************
//    E X E C U T E

windowWidth = document.body.clientWidth;
windowHeight = window.innerHeight;


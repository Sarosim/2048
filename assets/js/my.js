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

function formatGameFields() {
    for (var k = 0; k < 16; k++) { //  field by field do the following 
        var selectedFieldId = "#gf-" + (k + 1); //  picks the ID of the element
        var itsCurrentClass = "gf-value-style-" + $(selectedFieldId).text(); //  gets the current class of the element
        var itsNewClass = "gf-value-style-" + gameFields[k]; //  based on the value of the field, defines the class to be assigned

        $(selectedFieldId).text(" ");

        if ($(selectedFieldId).hasClass(itsNewClass)) { // if the element has the given class assigned already (meaning its value isn't changing), then do this:  
            //its value doesn't change, so do nothing  ----- maybe a little animation later...
            $(selectedFieldId).text(gameFields[k]);
        }
        else { // else, meaning the value is changing
            $(selectedFieldId)
                .removeClass(itsCurrentClass)
                .addClass("gf-value-disappear")
                .text(gameFields[k])
                .addClass("gf-value-transition")
                .removeClass("gf-value-disappear")
                .addClass(itsNewClass)
                .removeClass("gf-value-transition");
        }
    }

    $("#current-score").text(score); //                         THIS NEEDS animation later
    $("#best-score").text(currentHighScore); //                         THIS NEEDS animation later
}

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

// create an array of the fields of the board depending on the direction of the intended move 
function renderArray(orientation) { //orientation = direction: 0-up, 1-left, 2-down, 3-right
    var i;
    var j;
    if (orientation == 0) { // 0-up
        for (var k = 0; k < 16; k++) {
            i = k % 4;
            j = Math.floor(k / 4);
            fieldsForShift[i][j] = gameFields[k];
        }
    }
    else if (orientation == 1) { // 1-left
        for (var k = 0; k < 16; k++) {
            i = Math.floor(k / 4);
            j = k % 4;
            fieldsForShift[i][j] = gameFields[k];
        }
    }
    else if (orientation == 2) { // 2-down
        for (var k = 0; k < 16; k++) {
            i = (k % 4);
            j = 3 - Math.floor(k / 4);
            fieldsForShift[i][j] = gameFields[k];
        }
    }
    else if (orientation == 3) { //3-right
        for (var k = 0; k < 16; k++) {
            i = Math.floor(k / 4);
            j = 3 - (k % 4);
            fieldsForShift[i][j] = gameFields[k];
        }
    }
    else {
        alert("This is impossible... --> there are only four directions :( :( ");
    }
}

// re-write the board after the move 
function reWriteToGameFields(orientation) {
    var i;
    var j;
    if (orientation == 0) { // 0-up
        for (var k = 0; k < 16; k++) {
            i = k % 4;
            j = Math.floor(k / 4);
            gameFields[k] = fieldsForShift[i][j];
        }
    }
    if (orientation == 1) { // 1-left
        for (var k = 0; k < 16; k++) {
            i = Math.floor(k / 4);
            j = k % 4;
            gameFields[k] = fieldsForShift[i][j];
        }
    }
    if (orientation == 2) { // 2-down
        for (var k = 0; k < 16; k++) {
            i = (k % 4);
            j = 3 - Math.floor(k / 4);
            gameFields[k] = fieldsForShift[i][j];
        }
    }
    if (orientation == 3) {
        for (var k = 0; k < 16; k++) {
            i = Math.floor(k / 4);
            j = 3 - (k % 4);
            gameFields[k] = fieldsForShift[i][j];
        }
    }
}

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
function shiftTilesLeft() { //directions: 0-up, 1-left, 2-down, 3-right

    wasThereAMove = false;
    for (var i = 0; i < 4; i++) { //For each 'row' (meaning line of fields of the direction) do the following

        // Check if there are same value tiles next to each other, or empty in between them; if yes, add them up and shift empty tiles *******************************************************************
        var classOfPosition = [];
        var valueOfThis = [];

        for (var k = 0; k < 4; k++) {
            classOfPosition[k] = ".gt-position-style-" + (i + 1) + "-" + (k + 1);
            valueOfThis[k] = $(classOfPosition[k]).text();
        }

        if ((valueOfThis[0] > 0) && (valueOfThis[0] == valueOfThis[1])) {
            deleteTile(i + 1, 1);
            changeTileValue(i + 1, 2, valueOfThis[1] * 2);
            changeTilePosition(i + 1, 2, i + 1, 1);
            score += 2 * valueOfThis[1];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[0] = valueOfThis[1] * 2;
            valueOfThis[1] = "";

            if ((valueOfThis[2] > 0) && (valueOfThis[2] == valueOfThis[3])) {
                deleteTile(i + 1, 3);
                changeTileValue(i + 1, 4, valueOfThis[3] * 2);
                changeTilePosition(i + 1, 4, i + 1, 2);
                score += 2 * valueOfThis[3];
                checkHighScore();
                valueOfThis[1] = valueOfThis[3] * 2;
                valueOfThis[2] = "";
                valueOfThis[3] = "";
            }
        }
        if ((valueOfThis[0] > 0) && ((valueOfThis[0] == valueOfThis[2]) && valueOfThis[1] == 0)) {
            deleteTile(i + 1, 1);
            changeTileValue(i + 1, 3, valueOfThis[2] * 2);
            changeTilePosition(i + 1, 3, i + 1, 1);
            score += 2 * valueOfThis[2];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[0] = valueOfThis[2] * 2;
            valueOfThis[2] = "";
        }
        if ((valueOfThis[0] > 0) && ((valueOfThis[0] == valueOfThis[3]) && valueOfThis[1] == 0 && valueOfThis[2] == 0)) {
            deleteTile(i + 1, 1);
            changeTileValue(i + 1, 4, valueOfThis[3] * 2);
            changeTilePosition(i + 1, 4, i + 1, 1);
            score += 2 * valueOfThis[3];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[0] = valueOfThis[3] * 2;
            valueOfThis[3] = "";
        }
        if ((valueOfThis[1] > 0) && (valueOfThis[1] == valueOfThis[2])) {
            deleteTile(i + 1, 2);
            changeTileValue(i + 1, 3, valueOfThis[2] * 2);
            changeTilePosition(i + 1, 3, i + 1, 2);
            score += 2 * valueOfThis[2];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[1] = valueOfThis[2] * 2;
            valueOfThis[2] = "";
        }
        if ((valueOfThis[1] > 0) && ((valueOfThis[1] == valueOfThis[3]) && valueOfThis[2] == 0)) {
            deleteTile(i + 1, 2);
            changeTileValue(i + 1, 4, valueOfThis[3] * 2);
            changeTilePosition(i + 1, 4, i + 1, 2);
            score += 2 * valueOfThis[3];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[1] = valueOfThis[3] * 2;
            valueOfThis[3] = "";
        }
        if ((valueOfThis[2] > 0) && (valueOfThis[2] == valueOfThis[3])) {
            deleteTile(i + 1, 3);
            changeTileValue(i + 1, 4, valueOfThis[3] * 2);
            changeTilePosition(i + 1, 4, i + 1, 3);
            score += 2 * valueOfThis[3];
            checkHighScore();
            wasThereAMove = true;
            valueOfThis[2] = valueOfThis[3] * 2;
            valueOfThis[3] = "";
        }

        if (valueOfThis[1] != "" || valueOfThis[2] != "" || valueOfThis[3] != "") {
            while (valueOfThis[0] == "") {
                for (var m = 1; m <= 3; m++) {
                    changeTilePosition(i + 1, m + 1, i + 1, m);
                }
                valueOfThis.shift();
                valueOfThis.push("");
                wasThereAMove = true;
            }
        }
        if (valueOfThis[2] != "" || valueOfThis[3] != "") {
            while (valueOfThis[1] == "") {
                for (var m = 2; m <= 3; m++) {
                    changeTilePosition(i + 1, m + 1, i + 1, m);
                }
                valueOfThis.shift();
                valueOfThis.push("");
                wasThereAMove = true;
            }
        }
        if (valueOfThis[3] != "") {
            while (valueOfThis[2] == "") {
                for (var m = 3; m <= 3; m++) {
                    changeTilePosition(i + 1, m + 1, i + 1, m);
                }
                valueOfThis.shift();
                valueOfThis.push("");
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

function generateNewField() { //Generate new value for one of the empty fields: Randomise 2 or 4 for on empty field
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
    if (dir == 1) shiftTilesLeft(); //dir(ections): 0-up, 1-left, 2-down, 3-right
    if (wasThereAMove == true) {
        setTimeout(function() {
            generateNewField();
        }, 300);
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
        generateNewField();
    }, 50);
    setTimeout(function() {
        generateNewField();
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

formatGameFields();

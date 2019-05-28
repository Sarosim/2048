// my.js is linked in the bottom of index.html, therefore didn't start with document ready function, may consider...

var gameInPlay = false;
var potentialMove = true;
var gameFields = [2, 4, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 0, 0, 0, 0];
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

//****************************************************
// F U N C T I O N S     D E F I N E D       H E R E
//****************************************************

//Set tile style according to value

function formatGameFields() {
    for (var k = 0; k < 16; k++) {
        var selectedFieldId = "#gf-" + (k + 1);
        var itsClass = "gf-value-style-" + gameFields[k];
        for (var m = 0; m < 18; m++) {
            $(selectedFieldId)
                .removeClass("gf-value-style-0")
                .removeClass("gf-value-style-" + Math.pow(2, m));
        }
        $(selectedFieldId)
            .addClass(itsClass)
            .text(gameFields[k]);
    }
    $("#current-score").text(score);
    $("#best-score").text(currentHighScore);
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

// the actual moving 
function shiftFields(direction) { //directions: 0-up, 1-left, 2-down, 3-right
    renderArray(direction);
    wasThereAMove = false;
    for (var i = 0; i < 4; i++) { //For each 'row' do the following

        // Check if there are same value tiles, next to each other, or empty in between them; if yes, add them up and shift empty tiles *******************************************************************

        if ((fieldsForShift[i][0] != 0) && (fieldsForShift[i][0] == fieldsForShift[i][1])) { // first two
            fieldsForShift[i][0] = fieldsForShift[i][0] + fieldsForShift[i][1];
            score += fieldsForShift[i][0];
            checkHighScore();
            fieldsForShift[i][1] = 0;
            wasThereAMove = true;

            if ((fieldsForShift[i][2] != 0) && (fieldsForShift[i][2] == fieldsForShift[i][3])) { // first two and the third and fourth
                fieldsForShift[i][1] = fieldsForShift[i][2] + fieldsForShift[i][3];
                score += fieldsForShift[i][1];
                checkHighScore();
                fieldsForShift[i][2] = 0;
                fieldsForShift[i][3] = 0;
                wasThereAMove = true;
            }
        }
        else if ((fieldsForShift[i][0] != 0) && ((fieldsForShift[i][0] == fieldsForShift[i][2]) && fieldsForShift[i][1] == 0)) { // first and third if empty in between
            fieldsForShift[i][0] = fieldsForShift[i][0] + fieldsForShift[i][2];
            score += fieldsForShift[i][0];
            checkHighScore();
            fieldsForShift[i][2] = 0;
            wasThereAMove = true;
        }
        else if ((fieldsForShift[i][0] != 0) && ((fieldsForShift[i][0] == fieldsForShift[i][3]) && fieldsForShift[i][1] + fieldsForShift[i][2] == 0)) { // first and fourth if empty in between
            fieldsForShift[i][0] = fieldsForShift[i][0] + fieldsForShift[i][3];
            score += fieldsForShift[i][0];
            checkHighScore();
            fieldsForShift[i][3] = 0;
            wasThereAMove = true;
        }

        else if ((fieldsForShift[i][1] != 0) && (fieldsForShift[i][1] == fieldsForShift[i][2])) { // second and third
            fieldsForShift[i][1] = fieldsForShift[i][1] + fieldsForShift[i][2];
            score += fieldsForShift[i][1];
            checkHighScore();
            fieldsForShift[i][2] = 0;
            wasThereAMove = true;
        }
        else if ((fieldsForShift[i][1] != 0) && ((fieldsForShift[i][1] == fieldsForShift[i][3]) && fieldsForShift[i][2] == 0)) { // second and fourth if empty in between
            fieldsForShift[i][1] = fieldsForShift[i][1] + fieldsForShift[i][3];
            score += fieldsForShift[i][1];
            checkHighScore();
            fieldsForShift[i][2] = 0;
            fieldsForShift[i][3] = 0;
            wasThereAMove = true;
        }
        else if ((fieldsForShift[i][2] != 0) && (fieldsForShift[i][2] == fieldsForShift[i][3])) { // third and fourth
            fieldsForShift[i][2] = fieldsForShift[i][2] + fieldsForShift[i][3];
            score += fieldsForShift[i][2];
            checkHighScore();
            fieldsForShift[i][3] = 0;
            wasThereAMove = true;
        }

        // Check if there are empty tiles, if yes, shift all the tiles 
        for (var x = 0; x < 3; x++) {
            if (fieldsForShift[i][0] == 0) {
                if ((fieldsForShift[i][1] + fieldsForShift[i][2] + fieldsForShift[i][3]) != 0) {
                    fieldsForShift[i][0] = fieldsForShift[i][1];
                    fieldsForShift[i][1] = fieldsForShift[i][2];
                    fieldsForShift[i][2] = fieldsForShift[i][3];
                    fieldsForShift[i][3] = fieldsForShift[i][4];
                    wasThereAMove = true;
                }
            }
            else { break; }
        }
        for (x = 0; x < 2; x++) {
            if (fieldsForShift[i][1] == 0) {
                if ((fieldsForShift[i][2] + fieldsForShift[i][3]) != 0) {
                    fieldsForShift[i][1] = fieldsForShift[i][2];
                    fieldsForShift[i][2] = fieldsForShift[i][3];
                    fieldsForShift[i][3] = fieldsForShift[i][4];
                    wasThereAMove = true;
                }
            }
            else { break; }
        }
        for (x = 0; x < 1; x++) {
            if (fieldsForShift[i][2] == 0) {
                if (fieldsForShift[i][3] != 0) {
                    fieldsForShift[i][2] = fieldsForShift[i][3];
                    fieldsForShift[i][3] = fieldsForShift[i][4];
                    wasThereAMove = true;
                }
            }
            else { break; }
        }
    }
    reWriteToGameFields(direction);
    formatGameFields();
}

//Generate new value for one of the empty fields after a move: Randomise 2 or 4 for on empty field

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
    if (gameInPlay) {
        shiftFields(dir); //dir(ections): 0-up, 1-left, 2-down, 3-right
        if (wasThereAMove == true) {
            generateNewField();
        }
        isThereAMove();
        if (potentialMove == false) {
            gameInPlay = false;
            alert("Game Over"); // probably a modal is nicer ...
        }
    }
}

//****************************************************
//    E V E N T    H A N D L E R S   
//****************************************************


$("#btn-new-game").click(function() {
    gameInPlay = true;
    gameFields = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    generateNewField();
    generateNewField();
    score = 0;
    gamePlayHistory = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    scoreHistory = [0];
    formatGameFields();
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

//****************************************************
//    E X E C U T E

formatGameFields();

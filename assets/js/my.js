// my.js is linked in the bottom of index.html, therefore didn't start with document ready function, may consider...
(function() {

    var gameInPlay = false;
    var readyStatus = true;
    var potentialMove = true;
    var wasThereAMove = false;
    var score = 0;
    var currentHighScore = 0;
    var gamePlayHistory = [];
    var maxMovesToStore = 15;
    var scoreHistory = [];
    var goalReached = false;
    var wantToContinue = false;
    var modalLabel, modalText, modalButton;
    var modalButtonOne = "Yes, carry on",
        modalButtonTwo = "Start New Game";
    var modalLabelElement = $("#modallabel");
    var modalMessageElement = $("#modalmessage");
    var modalButtonElement = $("#mymodalbtn");
    var myModal = $("#combined-modal");
    var highScoreDiv = $("#best-score");
    var scoreDiv = $("#current-score");
    var gameBoardDiv = $(".game-board");
    var newGameButton = $("#btn-new-game");
    var undoButton = $("#btn-undo");
    var btnUp = $("#btn-up"),
        btnLeft = $("#btn-left"),
        btnRight = $("#btn-right"),
        btnDown = $("#btn-down");
    var arrowDir;
    //****************************************************
    // F U N C T I O N S     D E F I N E D       H E R E
    //****************************************************

    function newGame() {
        gameInPlay = true;
        potentialMove = true;
        score = 0;
        gamePlayHistory = [];
        scoreHistory = [];
        goalReached = false;
        wantToContinue = false;
        $(".game-board div").remove();
        setTimeout(function() {
            generateNewTileData();
        }, 50);
        setTimeout(function() {
            generateNewTileData();
        }, 150);
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
        if (newValue == 2048) {
            goalReached = true;
        }
    }

    function changeTilePosition(xOld, yOld, xNew, yNew) {
        var oldPositionClass = "gt-position-style-" + xOld + "-" + yOld;
        var newPositionClass = "gt-position-style-" + xNew + "-" + yNew;

        $("." + oldPositionClass)
            .addClass(newPositionClass)
            .removeClass(oldPositionClass);
    }

    function recordTileData() { //for undo
        var startPos;
        var xPos, yPos, val;
        var currentTileData = [];
        var currentTiles = document.getElementsByClassName("game-tile");
        for (var i = 0; i < currentTiles.length; i++) {
            var str = currentTiles[i].className;
            startPos = str.indexOf("position-style");
            xPos = parseInt(str.slice(startPos + 15, startPos + 16));
            yPos = parseInt(str.slice(startPos + 17, startPos + 18));
            val = parseInt(currentTiles[i].textContent);
            currentTileData.push(xPos);
            currentTileData.push(yPos);
            currentTileData.push(val);
        }
        const cloneOfCurrentTileData = [...currentTileData];
        gamePlayHistory.push(cloneOfCurrentTileData);
        if (gamePlayHistory.length > maxMovesToStore) { // if more moves than max stored, 'forget' of the eldest
            gamePlayHistory.shift();
        }
    }

    function undoLastMove() {
        var tileData = gamePlayHistory[gamePlayHistory.length - 1]; //lehetne gamePlayHistory.pop() ? ? ? nem műxik !!!
        var numOfTiles = tileData.length / 3;
        var xPos, yPos, val;
        $(".game-board div").remove();
        //   remove all children of .game-board
        for (var i = 0; i < numOfTiles; i++) {
            xPos = tileData[i * 3];
            yPos = tileData[i * 3 + 1];
            val = tileData[i * 3 + 2];
            createNewTile(xPos, yPos, val);
        }
        gamePlayHistory.pop();
    }

    function recordCurrentScore() {
        //for undo
        scoreHistory.push(score);
        if (scoreHistory.length - 1 > maxMovesToStore) {
            scoreHistory.shift();
        }
    }

    function undoLastScore() {
        score = scoreHistory[scoreHistory.length - 1];
        scoreDiv.text(score);
        scoreHistory.pop();
    }

    function isItGameOver() {
        // It also checks whether there are two tiles on the same position (bug control)
        var pos = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        var positionStyle;
        var currentTiles = document.getElementsByClassName("game-tile");
        var amountOfTiles = currentTiles.length;
        for (var i = 0; i < amountOfTiles; i++) {
            for (var j = 1; j <= 4; j++) {
                for (var k = 1; k <= 4; k++) {
                    positionStyle = "gt-position-style-" + j + "-" + k;
                    if ($(currentTiles[i]).hasClass(positionStyle)) {
                        pos[j - 1][k - 1]++;
                    }
                }
            }
        }
        for (var j = 0; j < 4; j++) {
            pos[j].sort();
            if (pos[j][3] > 1) {
                alert("there are two tiles on a cell ! ! ! This is a bug, please inform the developer :) ");
            }
        }
        if (amountOfTiles == 16) {
            potentialMove = false;
            var valIJ, valIPlus1J, valIJPlus1;
            for (i = 1; i <= 4; i++) {
                for (j = 1; j <= 4; j++) {
                    var theTile = document.getElementsByClassName("gt-position-style-" + i + "-" + j);
                    valIJ = $(theTile[0]).text();
                    theTile = document.getElementsByClassName("gt-position-style-" + (i + 1) + "-" + j);
                    valIPlus1J = $(theTile[0]).text();
                    theTile = document.getElementsByClassName("gt-position-style-" + i + "-" + (j + 1));
                    valIJPlus1 = $(theTile[0]).text();
                    if ((valIJ == valIPlus1J) || (valIJ == valIJPlus1)) {
                        potentialMove = true;
                        return potentialMove;
                    }
                }
            }
        }
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
        for (var i = 0; i < 4; i++) { //For each 'row' (meaning line of the direction) do the following


            var classOfPosition = [];
            var valueOfThis = [];

            for (var k = 0; k < 4; k++) { // fill the values of the tiles for each position in the 'row' to an array
                classOfPosition[k] = ".gt-position-style-" + ((i + 1) * horizontal + (k + 1) * vertical) + "-" + ((i + 1) * vertical + (k + 1) * horizontal);
                valueOfThis[k] = $(classOfPosition[k]).text();
            }

            // Check if there are same value tiles next to each other, or empty in between them; if yes, add them up and shift empty tiles 
            if ((valueOfThis[a + b * 0] > 0) && (valueOfThis[a + b * 0] == valueOfThis[a + b * 1])) {
                x1 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
                if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                else {
                    deleteTile(x1, y1);
                    changeTileValue(x2, y2, valueOfThis[a + b * 1] * 2);
                    $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                    changeTilePosition(x2, y2, x1, y1);
                    score += 2 * valueOfThis[a + b * 1];
                    checkHighScore();
                    wasThereAMove = true;
                    valueOfThis[a + b * 0] = valueOfThis[a + b * 1] * 2;
                    valueOfThis[a + b * 1] = "";
                }

                if ((valueOfThis[a + b * 2] > 0) && (valueOfThis[a + b * 2] == valueOfThis[a + b * 3])) {
                    x1 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
                    y1 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
                    x2 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
                    y2 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
                    if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                    else {
                        deleteTile(x1, y1);
                        changeTileValue(x2, y2, valueOfThis[a + b * 3] * 2);
                        $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                        x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
                        y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
                        changeTilePosition(x2, y2, x1, y1);
                        score += 2 * valueOfThis[a + b * 3];
                        checkHighScore();
                        valueOfThis[a + b * 1] = valueOfThis[a + b * 3] * 2;
                        valueOfThis[a + b * 2] = "";
                        valueOfThis[a + b * 3] = "";
                    }
                }
            }
            if ((valueOfThis[a + b * 0] > 0) && ((valueOfThis[a + b * 0] == valueOfThis[a + b * 2]) && valueOfThis[a + b * 1] == 0)) {
                x1 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
                if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                else {
                    deleteTile(x1, y1);
                    changeTileValue(x2, y2, valueOfThis[a + b * 2] * 2);
                    $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                    changeTilePosition(x2, y2, x1, y1);
                    score += 2 * valueOfThis[a + b * 2];
                    checkHighScore();
                    wasThereAMove = true;
                    valueOfThis[a + b * 0] = valueOfThis[a + b * 2] * 2;
                    valueOfThis[a + b * 2] = "";
                }
            }
            if ((valueOfThis[a + b * 0] > 0) && ((valueOfThis[a + b * 0] == valueOfThis[a + b * 3]) && valueOfThis[a + b * 1] == 0 && valueOfThis[a + b * 2] == 0)) {
                x1 = (i + 1) * horizontal + (a + b * 0 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 0 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
                if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                else {
                    deleteTile(x1, y1);
                    changeTileValue(x2, y2, valueOfThis[a + b * 3] * 2);
                    $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                    changeTilePosition(x2, y2, x1, y1);
                    score += 2 * valueOfThis[a + b * 3];
                    checkHighScore();
                    wasThereAMove = true;
                    valueOfThis[a + b * 0] = valueOfThis[a + b * 3] * 2;
                    valueOfThis[a + b * 3] = "";
                }
            }
            if ((valueOfThis[a + b * 1] > 0) && (valueOfThis[a + b * 1] == valueOfThis[a + b * 2])) {
                x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
                if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                else {
                    deleteTile(x1, y1);
                    changeTileValue(x2, y2, valueOfThis[a + b * 2] * 2);
                    $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                    changeTilePosition(x2, y2, x1, y1);
                    score += 2 * valueOfThis[a + b * 2];
                    checkHighScore();
                    wasThereAMove = true;
                    valueOfThis[a + b * 1] = valueOfThis[a + b * 2] * 2;
                    valueOfThis[a + b * 2] = "";
                }
            }
            if ((valueOfThis[a + b * 1] > 0) && ((valueOfThis[a + b * 1] == valueOfThis[a + b * 3]) && valueOfThis[a + b * 2] == 0)) {
                x1 = (i + 1) * horizontal + (a + b * 1 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 1 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
                if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                else {
                    deleteTile(x1, y1);
                    changeTileValue(x2, y2, valueOfThis[a + b * 3] * 2);
                    $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                    changeTilePosition(x2, y2, x1, y1);
                    score += 2 * valueOfThis[a + b * 3];
                    checkHighScore();
                    wasThereAMove = true;
                    valueOfThis[a + b * 1] = valueOfThis[a + b * 3] * 2;
                    valueOfThis[a + b * 3] = "";
                }
            }
            if ((valueOfThis[a + b * 2] > 0) && (valueOfThis[a + b * 2] == valueOfThis[a + b * 3])) {
                x1 = (i + 1) * horizontal + (a + b * 2 + 1) * vertical;
                y1 = (i + 1) * vertical + (a + b * 2 + 1) * horizontal;
                x2 = (i + 1) * horizontal + (a + b * 3 + 1) * vertical;
                y2 = (i + 1) * vertical + (a + b * 3 + 1) * horizontal;
                if ($(".gt-position-style-" + x1 + "-" + y1).hasClass("changed") || $(".gt-position-style-" + x2 + "-" + y2).hasClass("changed")) {} // Do nothing
                else {
                    deleteTile(x1, y1);
                    changeTileValue(x2, y2, valueOfThis[a + b * 3] * 2);
                    $(".gt-position-style-" + x2 + "-" + y2).addClass("changed");
                    changeTilePosition(x2, y2, x1, y1);
                    score += 2 * valueOfThis[a + b * 3];
                    checkHighScore();
                    wasThereAMove = true;
                    valueOfThis[a + b * 2] = valueOfThis[a + b * 3] * 2;
                    valueOfThis[a + b * 3] = "";
                }
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
        $(".game-board div").removeClass("changed");
    }

    function createNewTile(x, y, val) {
        var positionStyle = "gt-position-style-" + x + "-" + y;
        var valueStyle = "gf-value-style-" + val;
        gameBoardDiv.append('<div class="game-tile text-center new-tile"></div>');
        $(".new-tile")
            .addClass(positionStyle)
            .addClass(valueStyle)
            .text(val)
            .removeClass("new-tile");
        isItGameOver();
        if (potentialMove == false) {
            modalLabel = "Game Over!";
            modalText = "No possible move available --> game over! Want to try again?";
            modalButton = modalButtonTwo;
            modalLabelElement.text(modalLabel);
            modalMessageElement.text(modalText);
            modalButtonElement.text(modalButton);
            myModal.modal('show');
        }
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

    function onUserInput(dir) {
        gameInPlay = true; // Just for the testing!!!
        if (gameInPlay) {
            if (readyStatus) {
                recordTileData();
                recordCurrentScore();
                shiftTiles(dir);
                if (wasThereAMove == true) {
                    readyStatus = false;
                    var scoring = function() {
                        highScoreDiv
                            .fadeOut(100)
                            .text(currentHighScore)
                            .fadeIn(100);
                        scoreDiv
                            .fadeOut(100)
                            .text(score)
                            .fadeIn(100);
                        return;
                    };
                    $.when(scoring()).done(function() {
                        setTimeout(function() {
                            generateNewTileData();
                        }, 100);
                        readyStatus = true;
                    });
                    if (goalReached) {
                        if (!wantToContinue) {
                            modalLabel = "2048 Reached!";
                            modalText = "You've reached 2048! Congratulations! Do you want to continue?";
                            modalButton = modalButtonOne;
                            modalLabelElement.text(modalLabel);
                            modalMessageElement.text(modalText);
                            modalButtonElement.text(modalButton);
                            myModal.modal('show');
                        }
                    }
                }
            }
        }
    }

    function swipeDetect(element, callback) {

        var touchSurface = element,
            swipeDir,
            startX,
            startY,
            distX,
            distY,
            threshold = 80, //required min distance traveled to be considered swipe
            restraint = 50, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 300, // maximum time allowed to travel that distance
            elapsedTime,
            startTime,
            handleSwipe = callback || function(swipeDir) {};

        touchSurface.addEventListener('touchstart', function(e) {
            var touchobj = e.changedTouches[0];
            swipeDir = 'none';
            distX = 0;
            distY = 0;
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
            e.preventDefault();
        }, false);

        touchSurface.addEventListener('touchmove', function(e) {
            e.preventDefault(); // prevent scrolling when inside DIV
        }, false);

        touchSurface.addEventListener('touchend', function(e) {
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime) { // first condition for a swipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    if (distX < 0) { // if dist traveled horizontally is negative, it indicates left swipe
                        swipeDir = 1;
                        arrowDir = btnLeft;
                    }
                    else {
                        swipeDir = 3; //otherwie it is right swipe
                        arrowDir = btnRight;
                    } //dir(ections): 0-up, 1-left, 2-down, 3-right
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    if (distY < 0) { // if dist traveled vertically is negative, it indicates up swipe
                        swipeDir = 0;
                        arrowDir = btnUp;
                    }
                    else {
                        swipeDir = 2; // otherwie it is down swipe
                        arrowDir = btnDown;
                    }
                }
            }
            handleSwipe(swipeDir);
            e.preventDefault(); // prevent scrolling when inside DIV
        }, false);
    }

    //****************************************************
    //    E V E N T    H A N D L E R S   
    //****************************************************

    // Buttons on screen

    newGameButton.click(function() {
        newGame();
    });

    undoButton.click(function() {
        if (gameInPlay) {

            if (gamePlayHistory.length > 1) {
                undoLastMove();
                undoLastScore();
            }
        }
    });

    btnUp.click(function() {
        onUserInput(0); //dir(ections): 0-up, 1-left, 2-down, 3-right
    });

    btnLeft.click(function() {
        onUserInput(1); //dir(ections): 0-up, 1-left, 2-down, 3-right
    });

    btnDown.click(function() {
        onUserInput(2); //dir(ections): 0-up, 1-left, 2-down, 3-right
    });

    btnRight.click(function() {
        onUserInput(3); //dir(ections): 0-up, 1-left, 2-down, 3-right
    });

    // Modal button

    modalButtonElement.click(function() {
        var buttonText = modalButtonElement.text();
        switch (buttonText) {
            case modalButtonOne:
                wantToContinue = true;
                myModal.modal('hide');
                break;

            case modalButtonTwo:
                myModal.modal('hide');
                newGame();
        }
    });

    // Keyboard

    document.onkeydown = function(e) {
        switch (e.key) {
            case 'ArrowUp':
                arrowDir = btnUp;
                arrowDir.addClass("imitate-hover");
                setTimeout(function() {
                    arrowDir.removeClass("imitate-hover");
                }, 250);
                onUserInput(0); //dir(ections): 0-up, 1-left, 2-down, 3-right
                break;
            case 'ArrowDown':
                arrowDir = btnDown;
                arrowDir.addClass("imitate-hover");
                setTimeout(function() {
                    arrowDir.removeClass("imitate-hover");
                }, 250);
                onUserInput(2); //dir(ections): 0-up, 1-left, 2-down, 3-right
                break;
            case 'ArrowLeft':
                arrowDir = btnLeft;
                arrowDir.addClass("imitate-hover");
                setTimeout(function() {
                    arrowDir.removeClass("imitate-hover");
                }, 250);
                onUserInput(1); //dir(ections): 0-up, 1-left, 2-down, 3-right
                break;
            case 'ArrowRight':
                arrowDir = btnRight;
                arrowDir.addClass("imitate-hover");
                setTimeout(function() {
                    arrowDir.removeClass("imitate-hover");
                }, 250);
                onUserInput(3); //dir(ections): 0-up, 1-left, 2-down, 3-right
        }
    };

    // Touchscreen -- touch screen swipe navigation
    window.addEventListener('load', function() {
        var theElement = document.getElementById("swipe-area");
        swipeDetect(theElement, function(swipeDir) {
            if (swipeDir != 'none') {
                arrowDir.addClass("imitate-hover");
                setTimeout(function() {
                    arrowDir.removeClass("imitate-hover");
                }, 250);
                onUserInput(swipeDir); //dir(ections): 0-up, 1-left, 2-down, 3-right
            }
        });
    }, false); // end window.onload

    //****************************************************
    //    E X E C U T E

})();

/**
 * Created by user on 2018/5/25.
 */
//点击开始游戏==》starPage消失，游戏开始
//基础数据
var content = document.getElementById("content");
var sMoveTimer;
var speed = 200;
var scoreBox = document.getElementById("score");
var loser = document.getElementById("loser");
var loserScore1 = document.getElementById("loserScore1");
var startPause = document.getElementById("startPause");
var startBtn = document.getElementById("startBtn");
var startPage = document.getElementById("startPage");
var close = document.getElementById("close");
var startGameBool = true; //是否开始游戏
var startPauseBool = true;  //是否暂停


init();
function init() {
    //地图
    this.mapW = parseInt(window.getComputedStyle(content).width);
    this.mapH = parseInt(window.getComputedStyle(content).height);
    this.mapDiv = content;
    //食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //蛇
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [[3, 0, "head"], [2, 0, "body"], [1, 0, "body"]];
    //游戏属性
    this.direct = "right";
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;
    //分数
    this.score = 0;
    scoreBox.innerHTML = this.score;
    bindEvent();
}

function startGame() {
    startPage.style.display = "none";
    startPause.style.display = "block";
    snake();
    food();

}
function food() {
    var food = document.createElement("div");
    food.style.width = this.foodW + "px";
    food.style.height = this.foodH + "px";
    food.style.position = "absolute";
    this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW));
    this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH));
    food.style.left = this.foodX * this.foodW + "px";
    food.style.top = this.foodY * this.foodH + "px";
    this.mapDiv.appendChild(food).setAttribute("class", "food");
}
function snake() {
    for (var i = 0; i < this.snakeBody.length; i++) {
        var snake = document.createElement("div");
        snake.style.width = this.snakeW + "px";
        snake.style.height = this.snakeH + "px";
        snake.style.position = "absolute";
        snake.style.left = this.snakeBody[i][0] * this.snakeW + "px";
        snake.style.top = this.snakeBody[i][1] * this.snakeH + "px";
        snake.classList.add(this.snakeBody[i][2]);
        this.mapDiv.appendChild(snake).classList.add("snake");
        switch (this.direct) {
            case "right":
                break;
            case "left":
                snake.style.transform = "rotate(180deg)";
                break;
            case "up":
                snake.style.transform = "rotate(270deg)";
                break;
            case "down":
                snake.style.transform = "rotate(90deg)";
                break;
            default:
                break;
        }
    }
}
function move() {
    for (var i = this.snakeBody.length - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch (this.direct) {
        case "right":
            this.snakeBody[0][0] += 1;
            break;
        case "left":
            this.snakeBody[0][0] -= 1;
            break;
        case "up":
            this.snakeBody[0][1] -= 1;
            break;
        case "down":
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;
    }
    removeClass("snake");
    snake();
// 增加长度
    if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
        var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
        var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
        switch (this.direct) {
            case "left":
                this.snakeBody.push([snakeEndX - 1, snakeEndY, "body"]);
                break;
            case "right":
                this.snakeBody.push([snakeEndX + 1, snakeEndY, "body"]);
                break;
            case "up":
                this.snakeBody.push([snakeEndX, snakeEndY - 1, "body"]);
                break;
            case "down":
                this.snakeBody.push([snakeEndX, snakeEndY + 1, "body"]);
                break;
            default:
                break;
        }
        this.score += 1;
        scoreBox.innerHTML = this.score;
        removeClass("food");
        food();
    }
    // 判断是否出边界
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / this.snakeW) {
        this.reloadGame();
    }
    if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / this.snakeH) {
        this.reloadGame();
    }
    var snakeHeadX = this.snakeBody[0][0];
    var snakeHeadY = this.snakeBody[0][1];
    for (var i = 1; i < this.snakeBody.length; i++) {
        if (snakeHeadX == this.snakeBody[i][0] && snakeHeadY == this.snakeBody[i][1]) {
            this.reloadGame();
        }
    }
}
function reloadGame() {
    removeClass("snake");
    removeClass("food");
    clearInterval(sMoveTimer);
    this.snakeBody = [[3, 2, "head"], [2, 2, "body"], [1, 2, "body"]];
    this.direct = "right";
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;
    loser.style.display = "block";
    //分数
    loserScore1.innerHTML = this.score;
    this.score = 0;
    scoreBox.innerHTML = this.score;
    startPauseBool = true;
    startGameBool = true;
    startPause.setAttribute("src", "./image/开始.png");


}
function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    while (ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);      //???????????????head还是所有的snake
    }
}
function bindEvent() {
    startBtn.onclick = function () {
        startAndPause();
    };
    startPause.onclick = function () {
        startAndPause();
    };
    close.onclick = function () {
        loser.style.display = "none";
    };

}
function startAndPause() {
    if (startPauseBool) {
        if (startGameBool) {
            startGame();
            startGameBool = false;
        }
        startPause.setAttribute("src", "./image/开始.png");
        document.onkeydown = function (e) {
            var code = e.keyCode;
            setDirect(code);
        };
        sMoveTimer = setInterval(function () {
            move();
        }, speed);
        startPauseBool = false;
    } else {
        startPause.setAttribute("src", "./image/暂停.png");
        clearInterval(sMoveTimer);
        document.onkeydown = function (e) {
            e.returnValue = false;
            return false;
        };
        startPauseBool = true;
    }
}

function setDirect(code) {
    switch (code) {
        case 37:
            if (this.left) {                //是否需要改变
                this.direct = "left";
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if (this.up) {                //是否需要改变
                this.direct = "up";
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if (this.right) {                //是否需要改变
                this.direct = "right";
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if (this.down) {                //是否需要改变
                this.direct = "down";
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        default:
            break;
    }
}
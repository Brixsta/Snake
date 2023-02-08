const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 25;

let snakeBody = [];
let tail;
const foodImg = new Image();
let lastFoodLocation = [];

window.addEventListener('keydown', (e)=>{
    let key = e.key;    
    if(key === "ArrowUp" && snakeHead.direction !== "down") {
        snakeHead.direction = "up";
    } else if(key === "ArrowDown" && snakeHead.direction !== "up") {
        snakeHead.direction = "down";
    } else if(key === "ArrowRight" && snakeHead.direction !== "left") {
        snakeHead.direction = "right";
    } else if(key === "ArrowLeft" && snakeHead.direction !== "right") {
         snakeHead.direction = "left";
    }
    
});

const drawGrid = () => {
    for(let i=0; i<COLS; i++) {
        for(let j=0; j<ROWS; j++) {
            ctx.strokeStyle = "lightgray";
            ctx.strokeRect(i*CELL_SIZE,j*CELL_SIZE,CELL_SIZE,CELL_SIZE);
        }
    }
}

const followLeadPiece = () => {
    for(let i=snakeBody.length-1; i>0; i--) {
        snakeBody[i].x = snakeBody[i-1].x;
        snakeBody[i].y = snakeBody[i-1].y;
        snakeBody[i].direction = snakeBody[i-1].direction;
    }

    if(snakeBody.length) {
        snakeBody[0].x = snakeHead.x;
        snakeBody[0].y = snakeHead.y;
        snakeBody[0].direction = snakeHead.direction;
    }
}

const randomFoodLocation = () => {
    food.x = Math.floor(Math.random()*COLS)*CELL_SIZE;
    food.y = Math.floor(Math.random()*ROWS)*CELL_SIZE;
    food.src = randomFoodType();
}

const randomFoodType = () => {
    const images = ['./apple.png', './orange.png', './banana.png'];
    const random = Math.floor(Math.random()*images.length);
    return images[random];
}

class SnakeHead {
    constructor () {
        this.x = CELL_SIZE * 3;
        this.y = CELL_SIZE * 3;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.direction = null;
    }

    draw () {
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    move () {
        if(this.direction === "up") {
            this.y -= CELL_SIZE;
        } else if(this.direction === "down") {
            this.y += CELL_SIZE;
        } else if (this.direction === "right") {
            this.x += CELL_SIZE;
        } else if(this.direction === "left") {
            this.x -= CELL_SIZE;
        }
    }

    eatFood () {
        if(this.x === food.x && this.y === food.y) {
            lastFoodLocation = [this.x,this.y];
            snakeBody.push(new SnakePiece(this.x,this.y))
            randomFoodLocation();
        }
    }

    clearLastFoodLocation () {
        if(this.x > lastFoodLocation[0] || this.x < lastFoodLocation[0] || this.y < lastFoodLocation[1] || this.y > lastFoodLocation[1]) {
            lastFoodLocation = [];
        }
    }

    outOfBounds () {
        if(this.x > canvas.width || this.x < 0 || this.y < 0 || this.y > canvas.height) {
            this.respawn();
        }
    }

    respawn () {
        this.x = CELL_SIZE * 3;
        this.y = CELL_SIZE * 3;
         snakeHead.direction = null;
        snakeBody = [];
        randomFoodLocation();
    }
}

class SnakePiece {
    constructor (x,y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.direction = null;
        this.color = "lime"
    }

    draw () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    outOfBounds () {
        if(this.x > canvas.width || this.x < 0 || this.y < 0 || this.y > canvas.height) {
            this.respawn();
        }
    }

    checkCollisions () {
        if(lastFoodLocation[0] !== this.x && lastFoodLocation !== this.y) {
            if(this.x === snakeHead.x && this.y === snakeHead.y) {
                snakeHead.respawn();
                
            }
        }
    }
}

class Food {
    constructor () {
        this.x = Math.floor(Math.random()*COLS)*CELL_SIZE;
        this.y = Math.floor(Math.random()*ROWS)*CELL_SIZE;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.src = randomFoodType();
    }

    draw () {
        foodImg.src = this.src;
        ctx.drawImage(foodImg,this.x,this.y)
    }
}

const snakeHead = new SnakeHead();
const food = new Food();

const animate = () => {
    setInterval(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid();
        food.draw();
        snakeBody.forEach((piece)=>{
            piece.draw();
            piece.outOfBounds();
            piece.checkCollisions();
        })
        snakeHead.draw();
        snakeHead.clearLastFoodLocation();
        followLeadPiece();
        snakeHead.move();
        snakeHead.eatFood();
        snakeHead.outOfBounds();
    },100)
}

window.onload = () => {
    animate();
    canvas.height = CELL_SIZE*ROWS;
    canvas.width = CELL_SIZE*COLS;
}
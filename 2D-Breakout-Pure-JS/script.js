const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for(let c = 0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x:0, y:0, status:1}
    }
}
let x = canvas.width/2;
let y = canvas.height /2;
let testX = x;
let testY = y;
let dx = 0;
let dy = 2.5;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;

document.addEventListener("keydown", keyDownHandler,false);
document.addEventListener("keyup", keyUpHandler,false);
document.addEventListener("mousemove", mouseMoveHandler, false)
function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX= relativeX - paddleWidth/2;
    }
}
function keyDownHandler(e){
if(e.key === "Right"||e.key === "ArrowRight"){
    rightPressed = true;
}else if(e.key === "Left"||e.key === "ArrowLeft"){
    leftPressed = true;
}
}
function keyUpHandler(e){
    if(e.key === "Right"||e.key === "ArrowRight"){
        rightPressed = false;
    }else if(e.key === "Left"||e.key === "ArrowLeft"){
        leftPressed = false;
    }
}
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks(){
    for(let c = 0; c< brickColumnCount; c++){
        for(let r = 0; r< brickRowCount; r++){
            if(bricks[c][r].status ===1){
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX,brickY,brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();}
        }
    }
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath()
}
function collisionDetection(){
    for(let c = 0; c<brickColumnCount; c++){
        for(let r = 0; r<brickRowCount; r++){
            const brick = bricks[c][r];
            if(brick.status ===1){
//          if (x < brick.x)testX = brick.x;// left edge
//          else if (x > brick.x+brickWidth) testX = brick.x+brickWidth;// right edge

//          if (y < brick.y) testY = brick.y;   // top edge
//          else if (y > brick.y+brickHeight) testY = brick.y+brickHeight;// bottom edge
//          let distX = x-testX
//          if(Math.abs(distX)<ballRadius)dx*=-1;
//          let distY = y-testY
//          if(Math.abs(distY)<ballRadius)dy*=-1;

//          distance = Math.sqrt((distX*distX)+(distY*distY))

            if(y+ballRadius > brick.y && y-ballRadius < brick.y + brickHeight && (x+ballRadius===brick.x || x-ballRadius === brick.x+ brickWidth)){
                dx *=-1;
                brick.status = 0;
                score++;
            }else if(x+ballRadius>brick.x && x-ballRadius < brick.x+ brickWidth && (y+ballRadius === brick.y || y-ballRadius === brick.y + brickHeight)){
                //This is hitting just the top or bottom, reverse the dy
                dy*=-1;
                brick.status = 0;
                score++;
            }
        }
        }
    }

}
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
    ctx.fillText(`Lives: ${lives}`, 400, 20);
}
function draw(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    collisionDetection()
    drawScore();
    if(x+dx+ballRadius > canvas.width || x+dx-ballRadius < 0){
        dx*=-1;
    }
    if( y+dy < ballRadius){
        dy*=-1;
    }else if(y+paddleHeight > canvas.height - ballRadius){
        if(x>=paddleX && x <= paddleX+paddleWidth){
            if(x>=paddleX && x<paddleX+paddleWidth/2){
                dx= (x-(paddleX+paddleWidth/2))/(paddleWidth/2)*4
                dy*=-1;
            }else{
                dx= (x-(paddleX+paddleWidth/2))/(paddleWidth - paddleWidth/2)*4

                dy*=-1;
            }
            console.log(dx)
        }else if(y+ballRadius>=canvas.height){
            lives--;
            x=canvas.width/2;
            y=canvas.height/2;
            dy=-2;
            if(!lives){
                alert("Game Over");
                document.location.reload();
            }else{
                dy*=-1;
            }
        }
    }
    if(rightPressed){
        paddleX = Math.min(paddleX+7, canvas.width - paddleWidth);
    }else if(leftPressed){
       paddleX = Math.max(paddleX-7, 0);
    }
    x+= dx;
    y+= dy;
    if(paddleX<0)paddleX=0
    if(paddleX+paddleWidth>canvas.width)paddleX = canvas.width - paddleWidth;
    if(score === (brickColumnCount*brickRowCount)){
        alert("You Win!");
        score=0;
        document.location.reload();
    }
    requestAnimationFrame(draw)
}
draw()
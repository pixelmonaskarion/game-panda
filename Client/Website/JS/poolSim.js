
//custom class for a ball
class Ball
{
    constructor(pos, radius)
    {
        this.pos = pos;
        this.radius = radius;
        this.vel = createVector();
        this.mass = 10;
        this.inPlay = true;
        this.index;
    }
}

//all of these measurements are in meters
TABLE_WIDTH = 1.67;
TABLE_LENGTH = 3.1;
INNER_TABLE_WIDTH = 1.42;
INNER_TABLE_LENGTH = 2.84;
BALL_DIAMETER = 0.05715;

var startingPositions;
var pocketPositions;

//scaling meters up to pixels
SCALE_FACTOR = 200;

WINDOW_WIDTH = TABLE_LENGTH * SCALE_FACTOR;
WINDOW_HEIGHT = TABLE_WIDTH * SCALE_FACTOR;

//how much to reduce pixels dragged by mouse to make velocity more reasonable
DRAG_FACTOR = 0.04;

ballRadius = BALL_DIAMETER * SCALE_FACTOR / 2;
numBalls = 16;
balls = [];

//how bouncy the balls are
RESTITUTION = 0.7;
//friction coeficient (shoudl change how friction is calculated to make it more realistic)
FRICTION = 0.99;

//the velocity at which the ball is stopped
VELOCITY_DEADZONE = 0.05; 

POCKET_SIZE = 0.1; //meters

mouseDownPos = createVector();
mouseUpPos = createVector();
mouseIsDragged;
ballColors;

//score things
player1Score;
player2Score;

player1Solid;
player1Turn;

turnInProgress;

anotherTurn;

popupText;

whiteBallPocketed;
placingWhiteBall;


function setup()
{
    mouseIsDragged = false;
    //hardcoded values for starting pool positions (in meters)
    startingPositions = [
        createVector(0,0),
        createVector(0, (BALL_DIAMETER)),
        createVector(0, (BALL_DIAMETER)*2),
        createVector(0, (BALL_DIAMETER)*3),
        createVector(0, (BALL_DIAMETER)*4),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2)+(BALL_DIAMETER)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2)+ (BALL_DIAMETER*2)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2) + (BALL_DIAMETER*3)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*2, (BALL_DIAMETER)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*2, (BALL_DIAMETER)+(BALL_DIAMETER)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*2, (BALL_DIAMETER)+ (BALL_DIAMETER*2)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*3, (BALL_DIAMETER) + BALL_DIAMETER/2),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*3, (BALL_DIAMETER)+(BALL_DIAMETER) + BALL_DIAMETER/2),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*4, (BALL_DIAMETER) + BALL_DIAMETER),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*4+1.42, (BALL_DIAMETER) + BALL_DIAMETER)
    ];
    //looping through and adding offset to get positions into right place on table
    for (var i = 0; i < startingPositions.length; i++)
    {  
        startingPositions[i].add(createVector(0.13 + 0.71 - ((BALL_DIAMETER/2)*Math.sqrt(3)*4), 0.125 + 0.71 - ((BALL_DIAMETER) + BALL_DIAMETER)));
    }
    
    //setting up the ball colors
    ballColors = [];
    ballColors[0] = ballColors[8] = "#f0fb00";
    ballColors[1] = ballColors[9] = "#1500ff";
    ballColors[2] = ballColors[10] = "#ff0e00";
    ballColors[3] = ballColors[11] = "#70f";
    ballColors[4] = ballColors[12] = "#ff7000"
    ballColors[5] = ballColors[13] = "#00bd0b";
    ballColors[6] = ballColors[14] = "#8e0000";
    ballColors[7] = "#000000";
    ballColors[15] = "#ffffff";


    pocketPositions = [
        createVector(0.13, 0.125),
        createVector(1.55, 0.125),
        createVector(3.1 - 0.13, 0.125),
        createVector(0.13, 1.67 - 0.125),
        createVector(1.55, 1.67-0.125),
        createVector(3.1 - 0.13, 1.67-0.125)
    ];

    player1Score = 0;
    player2Score = 0;

    player1Turn = true;
    player1Solid = null;

    turnInProgress = false;

    anotherTurn = false;

    popupText = "";

    whiteBallPocketed = false;
    placingWhiteBall = false;

    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    background(0);

    for (i = 0; i < numBalls; i++)
    {
        balls.push(new Ball(p5.Vector.mult(startingPositions[i], SCALE_FACTOR), ballRadius));
        balls[i].index = i;
    }


}

function handleCollision(ball1, ball2, restitution)
{
    var dir = p5.Vector.sub(ball2.pos, ball1.pos);
    var dirLen = p5.Vector.mag(dir);
    
    if (dirLen == 0 || dirLen > ball1.radius + ball2.radius)
        return;

    dir.normalize();


    var corr = (ball1.radius + ball2.radius - dirLen) / 2.0;
    ball2.pos.add(p5.Vector.mult(dir, corr));
    ball1.pos.add(p5.Vector.mult(dir, -corr));

    var v1 = p5.Vector.dot(ball1.vel, dir);
    var v2 = p5.Vector.dot(ball2.vel, dir);

    var m1 = ball1.mass;
    var m2 = ball2.mass;

    var newV1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * restitution) / (m1 + m2);
    var newV2 = (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * restitution) / (m1 + m2);

    ball1.vel.add(p5.Vector.mult(dir, newV1 - v1));
    ball2.vel.add(p5.Vector.mult(dir, newV2 - v2));
}

function handleWallCollision(ball)
{
    if (ball.pos.x/SCALE_FACTOR + BALL_DIAMETER/2 >= 2.97 || ball.pos.x/SCALE_FACTOR - BALL_DIAMETER/2 <= 0.13)
    {
        ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.y/SCALE_FACTOR + BALL_DIAMETER/2 >= 1.5525 || ball.pos.y/SCALE_FACTOR - BALL_DIAMETER/2 <= 0.125)
    {
        ball.vel.y = -ball.vel.y;
    }
}

function popup(text)
{
    popupText = text;

    setTimeout(function() {
        popupText = "";
    }, 1000);
}

function checkInPocket(ball)
{
    for (var i = 0; i < pocketPositions.length; i++)
    {
        dis = p5.Vector.sub(p5.Vector.mult(pocketPositions[i], SCALE_FACTOR), ball.pos).mag();
        //console.log(dis);

        if (dis <= POCKET_SIZE/2*SCALE_FACTOR + ball.radius)
        {
            ball.inPlay = false;
            ball.vel = createVector();
            console.log("ball pocketed");

            if (ball.index == 7)
            {
                if ((player1Turn && player1Score < 7) || (!player1Turn && player2Score < 7))
                {
                    player = player1Turn ? "Player 1" : "Player 2";
                    popup(player + " lost");
                } else
                {
                    player = player1Turn ? "Player 1" : "Player 2";
                    popup(player + " won");
                }
            }

            if (ball.index == 15)
            {
                whiteBallPocketed = true;
                popup("White Ball Pocketed");
            }

            if (ball.index <= 6 && player1Solid == null && player1Turn)
            {
                player1Solid = true;
                popup("Player 1 is solid");
            } else if (ball.index >= 8 && ball.index <= 14 && player1Solid == null && player1Turn)
            {
                player1Solid = false;
                popup("Player 1 is striped");
            }

            if (ball.index <= 6 && player1Solid == null && !player1Turn)
            {
                player1Solid = false;
                popup("Player 1 is striped");
            } else if (ball.index >= 8 && ball.index <= 14 && player1Solid == null && !player1Turn)
            {
                player1Solid = true;
                popup("Player 1 is solid");
            }


            if (ball.index <= 6 && player1Solid == true && player1Turn)
            {
                anotherTurn= true;
            } else if (ball.index <= 6 && player1Solid == false && !player1Turn)
            {
                anotherTurn= true;
            } else if (ball.index >= 8 && ball.index <= 14 && player1Solid == false && player1Turn)
            {
                anotherTurn= true;
            } else if (ball.index >= 8 && ball.index <= 14 && player1Solid == true && !player1Turn)
            {
                anotherTurn= true;
            }

            return;
        }
    }
}

function checkScore()
{
    player2Score = 0;
    player1Score = 0;

    if (player1Solid == null)
        return;

    for (var i = 0; i < numBalls; i++)
    {
        if (i <=6 && !balls[i].inPlay)
        {
            if (player1Solid)
            {
                player1Score++;
            } else 
            {
                player2Score ++;
            }
            
        }

        if (i >=8 && i <= 14 && !balls[i].inPlay)
        {
            if (player1Solid)
            {
                player2Score++;
            } else 
            {
                player1Score ++;
            }
        }
    }
}

function checkEndTurn()
{
    for (var i = 0; i < numBalls; i ++)
    {
        if (balls[i].vel.mag() > 0)
        {
            return false;
        }
    }

    return true;
}

function placeWhiteBall()
{
    balls[15].inPlay = true;
    balls[15].pos = createVector(mouseX, mouseY);
}

function endTurn()
{
    turnInProgress = false;

    if (!anotherTurn)
        player1Turn = !player1Turn;

    anotherTurn = false;
    console.log("turn is over, player1Turn: " + player1Turn);

    turn = player1Turn ? "Player 1" : "Player 2";
    popup("It is " + turn + "'s turn");

    if (whiteBallPocketed) {
        whiteBallPocketed = false;
        placingWhiteBall = true;
    }
}

function draw()
{
    background("#652102");
    rectMode(CENTER);
    fill("#00ff19");
    rect(WINDOW_WIDTH/2, WINDOW_HEIGHT/2, INNER_TABLE_LENGTH*SCALE_FACTOR, INNER_TABLE_WIDTH * SCALE_FACTOR);

    fill("#ffffff");
    stroke(0);
    textAlign(CENTER, CENTER);
    text(popupText, WINDOW_WIDTH/2, WINDOW_HEIGHT/2);

    if (placingWhiteBall)
        placeWhiteBall();

    
    for (var i = 0; i < pocketPositions.length; i++)
    {
        fill("#808000");
        circle(pocketPositions[i].x * SCALE_FACTOR, pocketPositions[i].y * SCALE_FACTOR, POCKET_SIZE * SCALE_FACTOR);
    }

    //adding line from ball showing direction and magnitude
    if (mouseIsDragged == true && !turnInProgress)
    {
        stroke(255);
        line(balls[15].pos.x, balls[15].pos.y, balls[15].pos.x + p5.Vector.sub(createVector(mouseX, mouseY), mouseDownPos).x, balls[15].pos.y + p5.Vector.sub(createVector(mouseX, mouseY), mouseDownPos).y);
        stroke(0);
    }
    
    if (!placingWhiteBall) {
        for (var i = 0; i < numBalls; i++)
        {
            if (!balls[i].inPlay)
                continue;


            //adding friction
            balls[i].vel.mult(FRICTION);

            if (balls[i].vel.mag() <= VELOCITY_DEADZONE)
            {
                balls[i].vel = createVector();
            }

            balls[i].pos.add(balls[i].vel);
            
            for (var j = i + 1; j < numBalls; j++)
            {
                if (!balls[j].inPlay)
                    continue;

                handleCollision(balls[i], balls[j], RESTITUTION);
            }

            handleWallCollision(balls[i]);

            checkInPocket(balls[i]);
        }
    }

    for (var i = 0; i < numBalls; i++)
    {
        if (!balls[i].inPlay)
            continue;

        fill(ballColors[i]);

        circle(balls[i].pos.x, balls[i].pos.y, balls[i].radius*2);


        //checks if ball is striped, and then adds stripes
        if (i >= 8 && i <= 14)
        {
            fill(255);
            arc(balls[i].pos.x, balls[i].pos.y, balls[i].radius*2, balls[i].radius*2, 0.5, PI-0.5, OPEN);
            arc(balls[i].pos.x, balls[i].pos.y, balls[i].radius*2, balls[i].radius*2, 0.5+PI, PI*2-0.5, OPEN);
        }
    }


    checkScore();
    textAlign(LEFT);
    text("Player 1: " + player1Score + "   Player 2: " + player2Score, 10, 10);

    turn = player1Turn ? "Player 1" : "Player 2"

    if (player1Turn && player1Solid != null)
        type = player1Solid ? "Solid" : "Striped";
    else if (!player1Turn && player1Solid != null)
        type = player1Solid ? "Striped" : "Solid";
    else
        type = "Neither";

    text("it is " + turn + "'s turn      " + type, 200, 10);
 
    if (checkEndTurn() && turnInProgress)
        endTurn();
}



function mousePressed()
{
    mouseDownPos = createVector(mouseX, mouseY);
    mouseIsDragged = true;
    placingWhiteBall = false;
}

function mouseReleased()
{
    mouseIsDragged = false;

    if (!turnInProgress)
    {
        turnInProgress = true;

        mouseUpPos = createVector(mouseX, mouseY);

        newVel = p5.Vector.sub(mouseDownPos, mouseUpPos);

        balls[15].vel = p5.Vector.mult(newVel, DRAG_FACTOR);
    }

    
}
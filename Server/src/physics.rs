use crate::pool::Ball;

const RESTITUTION: f32 = 0.7;
const BALL_DIAMETER: f32 = 0.05715;
const BALL_RADIUS: f32 = BALL_DIAMETER/2.0;

fn handle_collision(ball1: &mut Ball, ball2: &mut Ball) {
    let dir = p5.Vector.sub(ball2.pos, ball1.pos);
    let dirLen = p5.Vector.mag(dir);
    
    if dirLen == 0 || dirLen > ball1.radius + ball2.radius {
        return;
    }

    dir.normalize();


    var corr = (ball1.radius + ball2.radius - dirLen) / 2.0;
    ball2.pos.add(p5.Vector.mult(dir, corr));
    ball1.pos.add(p5.Vector.mult(dir, -corr));

    var v1 = p5.Vector.dot(ball1.vel, dir);
    var v2 = p5.Vector.dot(ball2.vel, dir);

    var m1 = ball1.mass;
    var m2 = ball2.mass;

    var newV1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * RESTITUTION) / (m1 + m2);
    var newV2 = (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * RESTITUTION) / (m1 + m2);

    ball1.vel.add(p5.Vector.mult(dir, newV1 - v1));
    ball2.vel.add(p5.Vector.mult(dir, newV2 - v2));
}

fn handleWallCollision(ball) {
    if (ball.pos.x/SCALE_FACTOR + BALL_DIAMETER/2 >= 2.97 || ball.pos.x/SCALE_FACTOR - BALL_DIAMETER/2 <= 0.13)
    {
        ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.y/SCALE_FACTOR + BALL_DIAMETER/2 >= 1.5525 || ball.pos.y/SCALE_FACTOR - BALL_DIAMETER/2 <= 0.125)
    {
        ball.vel.y = -ball.vel.y;
    }
}
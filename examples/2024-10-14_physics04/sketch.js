
const balls = [];
const waterline = 400;
const dragCoefficient = 0.1;

function setup() {
  createCanvas(600, 600);

  balls.push(new Ball(150, 0, 20, color(255, 0, 100)));
  balls.push(new Ball(450, 0, 40, color(100, 0, 255)));
}

function draw() {
  background(255);
  fill("white");
  rect(0, 0, width, height);

  // add gravity
  const g = createVector(0, 1);
  balls.forEach(ball => ball.applyForce(p5.Vector.mult(g, ball.mass)));

  // add wind
  if (mouseIsPressed){
    const wind = createVector(width/2 - mouseX, height/2 - mouseY);
    wind.normalize();
    wind.mult(1.1);
    balls.forEach(ball => ball.applyForce(wind));
  }

  // add drag
  balls.forEach(ball => {
    if (ball.position.y + ball.radius > waterline){
      const drag = ball.velocity.copy().normalize();
      drag.mult(- ball.velocity.magSq()); 
      drag.mult(dragCoefficient); 
    
      ball.applyForce(drag);
    }
  });

  
  balls.forEach(ball => ball.update());
  balls.forEach(ball => ball.draw());

  fill(100,200,255, 200);
  rect(0, waterline, width, height);

}


class Ball {
  constructor(x, y, radius, color) {
    this.radius = radius;
    this.color = color;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = radius / 10;
  }

  draw(){
    fill(this.color);
    circle(this.position.x, this.position.y, this.radius * 2);

  }

  applyForce(f){
    this.acceleration.add(p5.Vector.div(f, this.mass));
  }

  update(){
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
    this.position.add(this.velocity);
    if (this.position.x + this.radius > width || this.position.x - this.radius < 0){
      this.velocity.x *= -.9;
      this.position.x = constrain(this.position.x, this.radius, width - this.radius);
    }
    if (this.position.y + this.radius > height || this.position.y - this.radius < 0){
      this.velocity.y *= -.9;
      this.position.y = constrain(this.position.y, this.radius, height - this.radius);
    }
  }
}
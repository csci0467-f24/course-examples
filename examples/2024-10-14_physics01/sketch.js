
let ball;

function setup() {
  createCanvas(600, 600);
  ball = new Ball(300, 300, 20, color(255, 0, 100));
  ball.velocity.x = 25;
  ball.velocity.y = 2;
}

function draw() {
  background(255);
  fill("white");
  rect(0, 0, width, height);

  ball.update();
  ball.draw();
 
}


class Ball {
  constructor(x, y, radius, color) {
    this.radius = radius;
    this.color = color;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
  }

  draw(){
    fill(this.color);
    circle(this.position.x, this.position.y, this.radius * 2);

  }

  update(){
    this.position.add(this.velocity);
    if (this.position.x + this.radius > width || this.position.x - this.radius < 0){
      this.velocity.x *= -1;
      // this.position.x = constrain(this.position.x, this.radius, width - this.radius);
    }
    if (this.position.y + this.radius > height || this.position.y - this.radius < 0){
      this.velocity.y *= -1;
      // this.position.y = constrain(this.position.y, this.radius, height - this.radius);
    }
  }
}
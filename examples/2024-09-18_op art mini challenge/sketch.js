
function setup() {
  createCanvas(600, 400);
  noLoop();
  background(255);
  noStroke();
}

function draw() {

  for (let i = 0; i < 27; i++){
    const x = map(i, 0, 27, 0, width);
    const w = map(i, 0, 27, width / 27 - 1, 2);
    console.log(x, w);
    
    fill("black");
    rect(x, 0, w, height);
  }

  blendMode(DIFFERENCE);

  fill("white");
  ellipseMode(CENTER);
  circle(width / 2, height / 2, 4 * height / 5);
}


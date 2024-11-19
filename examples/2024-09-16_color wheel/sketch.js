const NUM_SLICES = 50;
let sliceSlider;

function setup() {
  createCanvas(600, 600);
  // noLoop();
  noStroke();
  colorMode(HSB, TWO_PI, 100, 100);
  sliceSlider = createSlider(3, 200, NUM_SLICES, 1);
  sliceSlider.position(10, height + 10);
}

function draw() {
  background('white');
 
  const slices = sliceSlider.value();
  console.log(slices);
  

  // const angle = TWO_PI / slices;
  const radius = width * 0.475;
  const cx = width / 2;
  const cy = height / 2;
  const offset = TWO_PI / slices;

  

  beginShape(TRIANGLE_FAN);
  vertex(cx, cy);
  for (let angle = 0; angle < TWO_PI+0.1; angle+=offset){
 
    fill(angle , 100, 100);
    vertex(cx + radius * cos(angle), cy + radius * sin(angle));
  }
  endShape();


}

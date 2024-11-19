

let capture;
let x = 0; 
let y = 0;
let slit = 0;

let ctx1, ctx2;


function setup() {
  createCanvas(800, 800);
  capture = createCapture(VIDEO);

  ctx1 = createGraphics(width, height);
  ctx2 = createGraphics(width, height);

}

function draw() {
  ctx2.image(ctx1, -1,0,ctx1.width, ctx1.height);
  ctx2.image(capture, ctx2.width - 1,0, 1, capture.height, capture.width/2,0,1,capture.height);

  image(ctx2, 0,0);

  [ctx1, ctx2] = [ctx2, ctx1];

}



function keyTyped(){
  if (key === "p"){
    if (isLooping()){
      noLoop();
    }else{
      loop();
    }
  }
}
let cw = 300
function setup() {
  

  canvas = createCanvas(cw, cw, WEBGL);
  canvas.style("visibility", "visible")

}

let l = 0;
let l2 = 0


function draw() {
  let w = 220

  background(36,87,218);
  let rw = 40 
  let rh = rw * 5 
  
  rectMode(CENTER);
  
  noStroke()
  
  fill(255,255,255,150)
  push()
  rotateY(0.4) ;
  
    rotateX(PI)
  
  for (let i = 5; i>0; i--){    
    let c = 255-255/(i+1)  
    fill(255,255,255,c) 
    rotateX(sin(l)/3) ;
    rect(0, 0, rw, rh); 
  }
  
  
  pop()
  
  rotate(0)
  fill(36,87,218)
  translate(0,0, 100)
  rect(0, 0, 100, 1); 
  
  l = mouseY/500
  // l = millis() / 600

}
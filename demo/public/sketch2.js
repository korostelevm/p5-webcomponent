let cw = 300
function setup() {
  

  canvas = createCanvas(cw, cw, WEBGL);
  canvas.style("visibility", "visible")

}

let l = 0;
let l2 = 0


function draw() {
  let w = 220

  background('red');
  let rw = 30
  let rh = rw * 5
  
  rectMode(CENTER);

  
  noStroke()
  
  
  push()
  
  // let r = rect(0, 0, rw, rh+15); 
  translate(0,0, 70)  
  rotateY(0.4) ;
  for (let i = 0; i< 5; i++){    
    rotateX(0.27 * sin(l)) ;
    
    fill(255,255,255,150)
    plane(rw,rh)
    
  }
  pop()
  rotate(0)
  fill('red')
  translate(0,0, 100)
  rect(0, 0, 100, 2); 
  
    
  
    


  l = millis() / 200

}
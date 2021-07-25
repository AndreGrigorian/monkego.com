const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const goButton = document.getElementById("go");
var isDrawing = false;
var runText = document.getElementById("run-status");
const restore_img_btn = document.querySelector("#restore-img");

var currentColor = "#F7CA18";
const palette = document.querySelector("#paint-tools");
palette.addEventListener("mousedown", function(e){
  e = e || window.event;
  var targetColor = e.target
  if(targetColor.id !== "paint-tools"){
    currentColor = targetColor.id;

    switch(currentColor){
      case "yellow":
        currentColor = '#F7CA18';
        break;
      case "brown":
        currentColor = "#964B00";
        break;
    }
  }

})

palette.addEventListener("touchstart", function(e){
  e = e || window.event;
  var targetColor = e.target
  if(targetColor.id !== "paint-tools"){
    currentColor = targetColor.id;

    switch(currentColor){
      case "yellow":
        currentColor = '#F7CA18';
        break;
      case "brown":
        currentColor = "#964B00";
        break;
    }
  }
})



window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('#endImg');
          img.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }

          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
          restore_img_btn.style.display = "block";
      }
  });
  resizeCanvas();
});

function restoreImg(){
  document.querySelector("#endImg").src = 'images/end.png';
  restore_img_btn.style.display = "none";
}


//move
const container = document.querySelector("#img-container");

var dragItem; 
var active = false;

container.addEventListener("mousedown", function(e){
  container.style.cursor = "grabbing";
  active = true;
  e = e || window.event;
  var target = e.target
  dragItem = document.querySelector("#" + target.id); 
  
})

container.addEventListener("touchstart", function(e){
  container.style.cursor = "grabbing";
  active = true;
  e = e || window.event;
  var target = e.target
  dragItem = document.querySelector("#" + target.id); 
})


container.addEventListener("mousemove", function(e){
  
  if(active){
    if(!isOutside(dragItem)){
      e.preventDefault();
      var mouseX = e.clientX - (dragItem.width/2);
      var mouseY = e.clientY - (dragItem.height/2);
      
      moveTo(mouseX, mouseY, dragItem);
    }
    else{
      if(dragItem.id === "monkeImg"){
        var audio = new Audio("./monkehurt.mp3");
        audio.play();
      }

      container.style.cursor = "grab"
      active = false;
      
      var canvasRect = canvas.getBoundingClientRect();

      //move to middle
      moveTo((canvas.width/2 + canvasRect.left) - dragItem.width/2, 
      (canvas.height/2 + canvasRect.top) - dragItem.height/2, dragItem);
    }
  }

})

container.addEventListener("touchmove", function(e){
  if(active){
    if(!isOutside(dragItem)){
      e.preventDefault();
      var mouseX = e.touches[0].clientX - (dragItem.width/2);
      var mouseY = e.touches[0].clientY - (dragItem.height/2);
      
      moveTo(mouseX, mouseY, dragItem);
    }
    else{

      container.style.cursor = "grab"
      active = false;
      
      var canvasRect = canvas.getBoundingClientRect();

      //move to middle
      moveTo((canvas.width/2 + canvasRect.left) - dragItem.width/2, 
      (canvas.height/2 + canvasRect.top) - dragItem.height/2, dragItem);
    }
  }
})

container.addEventListener("mouseup", function(e){
  container.style.cursor = "grab";
  active = false;
})

container.addEventListener("touchend", function(){
  container.style.cursor = "grab";
  active = false;
})



function moveTo(x, y, el){
  el.style.left = x;
  el.style.top = y;
}




function isOutside(item){
  var canvasRect = canvas.getBoundingClientRect();
  var itemBounds = item.getBoundingClientRect();
  var itemX = itemBounds.x;
  var itemY = itemBounds.y;

  var leftBorder = (window.innerWidth-canvas.width)/2;
  var rightBorder = leftBorder + canvas.width;
  var topBorder = canvasRect.y;
  var bottomBorder = topBorder + canvas.height;

  if(itemX < leftBorder || itemX + item.width > rightBorder || itemY < topBorder || itemY + item.height > bottomBorder){
    return true; //item is outside canvas
  }
  return false;
}

function getPos(item){
  var canvasRect = canvas.getBoundingClientRect();
  var ItemDimensions = item.getBoundingClientRect();
  var itemPosX = ItemDimensions.left - canvasRect.left;
  var itemPosY = ItemDimensions.top - canvasRect.top;
  return [Math.round(itemPosX), Math.round(itemPosY)];
}



var lineWidth = 7;
canvas.addEventListener('mousedown', function(e){
  var cRect = canvas.getBoundingClientRect();        
  var canvasX = Math.round(e.clientX - cRect.left);  
  var canvasY = Math.round(e.clientY - cRect.top);
  isDrawing = true;
  lineWidth = 7;
  ctx.beginPath();
  drawLine(canvasX, canvasY);
});
canvas.addEventListener("touchstart", function(e){
  var cRect = canvas.getBoundingClientRect();        
  var canvasX = Math.round(e.clientX - cRect.left);   
  var canvasY = Math.round(e.clientY - cRect.top);
  isDrawing = true;
  lineWidth = 4
  ctx.beginPath();
  drawLine(canvasX, canvasY);
})
canvas.addEventListener('mousemove', function(e){
  
  var cRect = canvas.getBoundingClientRect();        
  var canvasX = Math.round(e.clientX - cRect.left);  
  var canvasY = Math.round(e.clientY - cRect.top);
  
  drawLine(canvasX, canvasY);
});

canvas.addEventListener("touchmove", function(e){
  var cRect = canvas.getBoundingClientRect();        
  var canvasX = Math.round(e.touches[0].clientX - cRect.left);  
  var canvasY = Math.round(e.touches[0].clientY - cRect.top);
  
  drawLine(canvasX, canvasY);
})

canvas.addEventListener("mouseleave", function(){
  stop();
})

function drawLine(cX, cY){
  if (!isDrawing || !allowDrawing) {return};
  xPos = cX; yPos = cY;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;

  // ctx.beginPath()
  ctx.lineTo(xPos, yPos);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(xPos, yPos); 
  
}



canvas.addEventListener('mouseup', stop);
canvas.addEventListener('touchcancel', stop);
clearButton.addEventListener('click', clearCanvas);


function stop () {
  isDrawing = false;
  ctx.beginPath();
  
}

function clearCanvas () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  runText.innerHTML = "";
  clearInterval(interval);
}

const paint_icon = document.getElementById("paint-icon");
const colors = document.getElementById("paint-tools");
const connector = document.getElementById("connector");
const img_uplaod = document.getElementById("upload-img");

const uploads = document.getElementsByClassName("imgUpload");
paint_icon.addEventListener("mouseover", function(){
  palette.style.display = "block";
})
paint_icon.addEventListener("mouseleave", function(){
  palette.style.display = "none";
})
connector.addEventListener("mouseover", function(){
  palette.style.display = "block";
})
palette.addEventListener("mouseleave", function(){
  palette.style.display = "none";
})




window.addEventListener('resize', resizeCanvas);
function resizeCanvas (){ 
  var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  var canvasRect = canvas.getBoundingClientRect();
  var clearButtonRect = clearButton.getBoundingClientRect();
  paint_icon.style.top = canvasRect.top;
  var paintrect = paint_icon.getBoundingClientRect();
  colors.style.top = paintrect.top + paint_icon.height + 10;

  connector.style.top = paintrect.top + paint_icon.height;


  canvas.width = window.innerWidth-200; //margin space
  canvas.height = window.innerHeight-300;
  
  
  var monke = document.getElementById("monkeImg");
  var end = document.getElementById("endImg");
  if(isOutside(monke)){
    moveTo((canvas.width/2 + canvasRect.left) - monke.width/2, 
    (canvas.height/2 + canvasRect.top) - monke.height/2, monke);    
  }
  if(isOutside(end)){
    moveTo((canvas.width/2 + canvasRect.left) - end.width/2, 
    (canvas.height/2 + canvasRect.top) - end.height/2, end); 
  }

  moveTo(canvasRect.left, clearButtonRect.top, img_uplaod);


  ctx.putImageData(canvasData, 0, 0)



}
resizeCanvas();


setInterval(function(){
  var canvasRect = canvas.getBoundingClientRect();
  var clearButtonRect = clearButton.getBoundingClientRect();
  moveTo(canvasRect.left, clearButtonRect.top, img_uplaod);

}, 300);
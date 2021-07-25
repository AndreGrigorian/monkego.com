
var startPoint;
var endPoint;


class Node {

    constructor(id, weight, posx, posy, walkable, parent) {

      this.weight = weight;
      this.posx = posx;
      this.posy = posy;
      this.walkable = walkable;
      this.id = id;
      this.parent = parent;

      this.g_score = 0;
      this.h_score = 0;
      this.f_score = 0;
      this.closed = false; 
      this.visited = false;
  
    }

    get pos(){
        return[this.posx, this.posy];
    }

}

class MinHeap {
    constructor(){
      this.heap = [];
    }
    swap(indexA, indexB){
      var temp = this.heap[indexA];
      this.heap[indexA] = this.heap[indexB];
      this.heap[indexB] = temp;
    }
  
    insert(element){
      this.heap.push(element);
      let current = this.heap.length-1;
      let parent = Math.floor((current-1)/2);
  
      while(parent >= 0 && this.heap[current].f_score < this.heap[parent].f_score){
        this.swap(current, parent);
        current = parent;
        parent = Math.floor((current-1)/2);
      }
  
    }
  
    removeMin(){
        var currentIndex = 0
        this.heap[currentIndex] = this.heap.pop();
        
        
        while (true) {
            var currGleft = false;
            var right_is_null = false;
            var leftGright = false;
          
            var right_child = (currentIndex+1)*2; //right child
            var left_child = right_child - 1; //left child
            var toSwap = null;
          
            // if current is greater than child

            if (this.heap[right_child] !== undefined) {
                if(this.heap[currentIndex].f_score > this.heap[right_child].f_score){
                    toSwap = right_child;
                }  
                
            }
            
            // if left_child is smaller than right_child, but also smaller than current
            if(this.heap[left_child] !== undefined){
                if(this.heap[currentIndex].f_score > this.heap[left_child].f_score){
                    currGleft = true;
                }
    
                if(this.heap[right_child] !== undefined){
                    if(this.heap[left_child].f_score < this.heap[right_child].f_score){
                        leftGright = true;
                    }
                }
                else{
                    right_is_null = true;
                }
            }
    
            if(currGleft && (right_is_null || leftGright)){
                toSwap = left_child;
            }


            // if we don't need to swap, then break.
            if (toSwap == null) {
                break;
            }
    
            if(this.heap[toSwap] == null){
                break;
            }
            
            var temp = this.heap[toSwap];
            this.heap[toSwap] = this.heap[currentIndex];
            this.heap[currentIndex] = temp;
            
            currentIndex = toSwap;
        }
  
    }

    rescore(element){

        var elementIndex = this.heap.indexOf(element);
        let parent = Math.floor((elementIndex-1)/2);

        let right_child = (elementIndex+1)*2;
        let left_child = right_child -1;

        //move up
        while(parent >= 0 && this.heap[elementIndex].f_score < this.heap[parent].f_score){
          this.swap(elementIndex, parent);
          elementIndex = parent;
          parent = Math.floor((elementIndex-1)/2);
        }

        //move down
        let leftExists;
        let rightExists;

        this.heap[left_child] !== undefined ? leftExists = true: leftExists = false;
        this.heap[right_child] !== undefined ? rightExists = true: rightExists = false;

        if(leftExists){
            if(leftExists && !rightExists){//if left exists but right does not
                while(this.heap[elementIndex].f_score > this.heap[elementIndex].f_score){
                    this.swap(elementIndex, left_child);
                    elementIndex = left_child;
                    left_child = ((elementIndex+1)*2) -1;
                }
            }
            if(rightExists){//if left and right exist
                while((this.heap[elementIndex].f_score > this.heap[left_child].f_score || 
                this.heap[elementIndex].f_score > this.heap[right_child].f_score) && 
                (elementIndex >= 0 && elementIndex < this.heap.length)){

                    if(this.heap[elementIndex].f_score > this.heap[left_child].f_score){
                        this.swap(elementIndex, left_child);
                        elementIndex = left_child;
                        left_child = ((elementIndex+1)*2) -1;
                    }
                    else{
                        this.swap(elementIndex, right_child);
                        elementIndex = right_child;
                        right_child = (elementIndex+1)*2;
                    }
                }
            }

        }


    }
    remove(element){
        //remove
        removeItem(this.heap, element);
        //reorder heap;
        for(var i = 0; i < this.heap.length; i++){
          this.rescore(this.heap[i]);
        }
      }
  }





function createGrid(graph){
    var new_grid = []
    var id_counter = 0
    for (var i = 0; i < graph.length;i++){//for each element in height
        
        var inner_new_grid = []
        for(var j = 0; j< graph[i].length;j++){//for each element in width
            var tempNode = new Node(id_counter, 1, j, i, true);
            if(graph[i][j] == 0){//if wall
                tempNode.walkable = false;
                tempNode.weight = 1080 * 1920; //make weight really large number
            }
            inner_new_grid.push(tempNode);
            id_counter++;
        }
        new_grid.push(inner_new_grid);

    }
    return new_grid;
}

function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}



function h(start, end){
    return (Math.abs(end.posx-start.posx) + Math.abs(end.posy-start.posy))
}


function setPixel(imageData, x, y, r, g, b, a) {
    var index = 4 * (x + y * imageData.width);
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function astar(start, end, grid){
    // var open = [];//list of nodes to be traversed
    // var closed = [];//list of nodes already traversed
    // open.push(start);//start is a single Node object in the grid 2d list
    start.g_score = 0;
    start.h_score = h(start, end);
    start.f_score = start.g_score + start.h_score;

    var openHeap = new MinHeap();
    openHeap.insert(start);


    var recurringItems = [];
    while(openHeap.heap.length > 0){

        //find lowest fscore in open

        //set lowest fscore to next
        var next = openHeap.heap[0]

                
        recurringItems.push(next);

        if(recurringItems.length >= 6){//fail condition
            if(recurringItems[recurringItems.length-6] === recurringItems[recurringItems.length-1]){
                console.log("failed");
                return "failed";
                
            }
        }

        //goal reached
        if(next.id === end.id){
            // return 
            console.log("goal reached...")
            var path = [];
            var current = next;
            
            while (current.id !== start.id){
                
                path.push(current.pos);
                current = current.parent;
                // console.log(current);
            }
            return path.reverse();
        }

        openHeap.removeMin();
        next.closed = true;
        

        // console.log(next);
        var neighbors = [];
        

        try{
            if(grid[next.posy-1][next.posx].walkable){
                neighbors.push(grid[next.posy-1][next.posx]);//above
            }
        } catch{}

        try{
            if(grid[next.posy+1][next.posx].walkable){
                neighbors.push(grid[next.posy+1][next.posx]);//under
            }
        } catch{}

        try{
            if(grid[next.posy][next.posx-1].walkable){;//to the left){
                neighbors.push(grid[next.posy][next.posx-1]);//to the left
            }
            
        } catch{}

        try{
            if(grid[next.posy][next.posx+1].walkable){
                neighbors.push(grid[next.posy][next.posx+1]);//to the right    
            }
            
        } catch{}


        // console.log(neighbors);

        for(var n=0; n<neighbors.length;n++){
            if(neighbors[n] === undefined){removeItem(neighbors, neighbors[n]);}//clean neighbor list
            
            
            var new_gScore = next.g_score + neighbors[n].weight;
            var beenVisited = neighbors[n].visited;
            


            if(neighbors[n].closed || !neighbors[n].walkable){
                continue;
            }

            if((!beenVisited ||  new_gScore < neighbors[n].g_score)){
                neighbors[n].visited = true;
                neighbors[n].parent = next;
                neighbors[n].g_score = new_gScore;
                neighbors[n].h_score = h(neighbors[n], end);
                neighbors[n].f_score = neighbors[n].g_score + neighbors[n].h_score;

                if(!beenVisited){
                    openHeap.insert(neighbors[n]);
                }
                // else{
                //     openHeap.rescore(neighbors[n]); 
                //     // openHeap.insert(neighbors[n]); 
                // }

            }


//////////////////////////////////////////////////////////////////////////////////////////////////////
            // if(neighbors[n] === undefined){removeItem(neighbors, neighbors[n]);}

            // if(neighbors[n].closed || !neighbors[n].walkable){
            //     continue;
            // }
            // var new_gScore = next.g_score + neighbors[n].weight;
            // var beenVisited = neighbors[n].visited;




            // if(!beenVisited ||  new_gScore < neighbors[n].g_score){
            //     neighbors[n].visited = true;
            //     neighbors[n].parent = next;
            //     neighbors[n].g_score = new_gScore;
            //     neighbors[n].h_score = h(neighbors[n], end);
            //     neighbors[n].f_score = neighbors[n].g_score + neighbors[n].h_score;

            //     if(!beenVisited){
            //         openHeap.insert(neighbors[n]);
            //     }
            //     else{
            //         openHeap.insert(neighbors[n]); 
            //     }

            // }



            // if(neighbors[n] === undefined){removeItem(neighbors, neighbors[n]);}
            
            // if(neighbors[n].closed){
            //     continue;
            // }
        
            // var new_gScore = next.g_score + neighbors[n].weight;
            // if(openHeap.heap.includes(neighbors[n]) && new_gScore < neighbors[n].g_score){
            //     removeItem(openHeap, neighbors[n]);
            // }
            // if(closed.includes(neighbors[n]) && new_gScore < neighbors[n].g_score){
            //     removeItem(closed, neighbors[n]);
            // }
            // if(!(openHeap.includes(neighbors[n])) && !(closed.includes(neighbors[n])) && neighbors[n].walkable){
            //     neighbors[n].parent = next;
            //     openHeap.push(neighbors[n]);
            //     neighbors[n].g_score = new_gScore;
            //     neighbors[n].h_score = h(neighbors[n], end);
            //     neighbors[n].f_score = neighbors[n].g_score + neighbors[n].h_score;
            // }
            
        }
        
        
    }

    console.log("failed");
    
}


function getImage(){
    var image = ctx.getImageData(0,0, canvas.width, canvas.height);
    var imageData = image.data;
    // console.log(canvas.height * canvas.width);
    
    var newGraph = []
    for(var i=0; i<imageData.length; i += 4){
        // console.log(imageData[i]);
        if(imageData[i] === 0  && imageData[i+1] === 0 && imageData[i+2] === 0){
            imageData[i]=1;
            newGraph.push(imageData[i]);
        }
        else{//wall
            imageData[i]=0;
            newGraph.push(imageData[i]);
        }
    }
    // for(var i =0; i<imageData.length; i += 4){
    //   if(imageData[i] > 0){
    //     imageData[i]=0;
    //     newGraph.push(imageData[i]);
    //   }
    //   else{
    //     imageData[i]=1;
    //     newGraph.push(imageData[i]);
    //   }
    // }
    
    return newGraph;
}
  
  
function makeGraph(arr, width) {//returns 2d array of canvas 1 for empty space, 0 for barrier
return(arr.reduce(
    (acc, curr) => {
    const last = acc[acc.length - 1];
    last.length < width ? last.push(curr) : acc.push([curr]);
    return acc;
    },
    [[]],
));
}



var interval; 
var allowDrawing = true;

goButton.addEventListener("click", function(){


    allowDrawing = false;
    var image_with_drawings = ctx.getImageData(0, 0, canvas.width, canvas.height);

    runText.innerHTML = "running...";

    var my_grid = makeGraph(getImage(), canvas.width);

    var graph = createGrid(my_grid);

    var startImg = document.getElementById("monkeImg");
    var endImg = document.getElementById("endImg");

    var startPos = getPos(startImg);
    var endPos = getPos(endImg);
    
    var startMid = [startPos[0] + Math.round(startImg.width/2), startPos[1] + Math.round(startImg.height/2)]
    var endMid = [endPos[0] + Math.round(endImg.width/2), endPos[1] + Math.round(endImg.height/2)]


    startPoint = graph[startMid[1]][startMid[0]];//middle of Startimg
    endPoint = graph[endMid[1]][endMid[0]];//middle of endImg

    var astar_path = astar(startPoint, endPoint, graph);

    // ctx.strokeStyle = "#00FFFF"
    // ctx.lineWidth = 5;
    // ctx.lineCap = "round"
    // ctx.beginPath();
    // ctx.moveTo(startMid[0], startMid[1]);
    // ctx.lineTo(endMid[0], endMid[1]);
    // ctx.stroke();
    // astar_path = [[startMid[0], startMid[1]][endMid[0], endMid[1]]];
    // runText.style.color = "aqua";
    // runText.innerHTML = "banana, mmm!"

    if(astar_path !== "failed"){
        
        runText.style.color = "aqua";
        runText.innerHTML = "banana, mmm!"

        ctx.strokeStyle = "#00FFFF" //cyan
        // ctx.strokeStyle = "#F7CA18";
        ctx.lineWidth = 5;
        ctx.lineCap = "round"
        var skip_amount = 15
        for(var i = 0; i < astar_path.length; i+=skip_amount){
            var next_index = i+skip_amount;
            ctx.beginPath();
            ctx.moveTo(astar_path[i][0], astar_path[i][1]);
            if(next_index < astar_path.length){
                ctx.lineTo(astar_path[next_index][0], astar_path[next_index][1]);    
            }
            else{
                ctx.lineTo(astar_path[astar_path.length-1][0], astar_path[astar_path.length-1][1]);
            }
            ctx.stroke();
        }

    }
    else{
        runText.style.color = "red";
        runText.innerHTML = "no path found";
    }


    // monke animation
    const promise = new Promise((resolve, reject) => {
        let id = null;
        const monke = document.getElementById("monkeImg");
        let pos = 0;
        clearInterval(id);
        id = setInterval(function(){
            var speed = 7;
            pos+=speed;//speed
            if(pos >= astar_path.length-1){
                clearInterval(id);
                resolve("fulfilled");
            }
            else{
                moveTo(astar_path[pos][0], astar_path[pos][1], monke);
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 8;
                ctx.lineCap = "round";
                
                ctx.beginPath();
                ctx.moveTo(astar_path[pos-speed][0], astar_path[pos-speed][1]);
                let nextPos = pos+speed
                if(nextPos >= astar_path.length-1){
                    ctx.lineTo(astar_path[astar_path.length-1][0], astar_path[astar_path.length-1][1]);
                }else{
                    ctx.lineTo(astar_path[nextPos][0], astar_path[nextPos][1]);
                }
                ctx.stroke();
                
            }
        }, 1)
    });

    promise.then(repairDrawings, failedPromise);
    
    function repairDrawings(){
        allowDrawing = true;
        ctx.putImageData(image_with_drawings, 0, 0);
        ctx.beginPath();
    }
    function failedPromise(){
        console.log("failed promise");
    }
    

}); 



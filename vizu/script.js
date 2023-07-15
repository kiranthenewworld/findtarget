("use strict");

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element) {
    if (this.isEmpty()) {
      this.queue.push(element);
    } else {
      let added = false;
      for (let i = 0; i < this.queue.length; i++) {
        if (element[1] < this.queue[i][1]) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.queue.push(element);
      }
    }
  }

  dequeue() {
    return this.isEmpty() ? null : this.queue.shift();
  }

  front() {
    return this.isEmpty() ? null : this.queue[0];
  }

  size() {
    return this.queue.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}

const rowSize = Math.round(window.innerHeight / 23) - 3;
const colSize = Math.round(window.innerWidth / 23) - 1;
document.querySelector(".grid").style.gridTemplateColumns =
  "repeat(" + colSize + ", 23px)";
let clicks = 0;
let addWeights = false;
let addWalls = false;
let remove = false;
let isDisabled = false;
let isFree = true;
let dragS = false;
let dragE = false;

// let reset = 0;
let start, end;
let sId, eId;
let path = [];
let p = [];
let blocked = new Set();
let weighted = new Set();

//drag start or end feature

//--------------------------------------------------------Disablebuttons-----------------------------------------------------------------

function disableButtons() {
  addWalls = false;
  addWeights = false;
  remove = false;
  dragE = false;
  dragS = false;

  document.querySelector(".BFS").classList.remove("active");
  document.querySelector(".BFS").classList.add("disabled");
  document.querySelector(".DFS").classList.remove("active");
  document.querySelector(".DFS").classList.add("disabled");
  document.querySelector(".Dijkstra").classList.remove("active");
  document.querySelector(".Dijkstra").classList.add("disabled");
  document.querySelector(".GBFS").classList.remove("active");
  document.querySelector(".GBFS").classList.add("disabled");
  document.querySelector(".AStar").classList.remove("active");
  document.querySelector(".AStar").classList.add("disabled");
  document.querySelector(".addWeights").classList.remove("active");
  document.querySelector(".addWeights").classList.add("disabled");
  document.querySelector(".addWalls").classList.remove("active");
  document.querySelector(".addWalls").classList.add("disabled");
  document.querySelector(".Remove").classList.remove("active");
  document.querySelector(".Remove").classList.add("disabled");
  document.querySelector(".clearPath").classList.remove("active");
  document.querySelector(".clearPath").classList.add("disabled");
  document.querySelector(".clearGrid").classList.remove("active");
  document.querySelector(".clearGrid").classList.add("disabled");
}
function enableButtons() {
  document.querySelector(".BFS").classList.add("active");
  document.querySelector(".BFS").classList.remove("disabled");
  document.querySelector(".DFS").classList.add("active");
  document.querySelector(".DFS").classList.remove("disabled");
  document.querySelector(".Dijkstra").classList.add("active");
  document.querySelector(".Dijkstra").classList.remove("disabled");
  document.querySelector(".GBFS").classList.add("active");
  document.querySelector(".GBFS").classList.remove("disabled");
  document.querySelector(".AStar").classList.add("active");
  document.querySelector(".AStar").classList.remove("disabled");
  document.querySelector(".addWeights").classList.add("active");
  document.querySelector(".addWeights").classList.remove("disabled");
  document.querySelector(".addWalls").classList.add("active");
  document.querySelector(".addWalls").classList.remove("disabled");
  document.querySelector(".Remove").classList.add("active");
  document.querySelector(".Remove").classList.remove("disabled");
  document.querySelector(".clearPath").classList.add("active");
  document.querySelector(".clearPath").classList.remove("disabled");
  document.querySelector(".clearGrid").classList.add("active");
  document.querySelector(".clearGrid").classList.remove("disabled");
  // const myDiv = document.querySelector(".BFS");
  // const classList = myDiv.classList;
  // console.log(classList);
}

//----------------------------------------------------------clearGrid---------------------------------------------------------------------
document.querySelector(".clearGrid").addEventListener("click", () => {
  clicks = 0;

  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      document.getElementById(`${i}-${j}`).classList.remove("red");
      document.getElementById(`${i}-${j}`).classList.remove("green");
      document.getElementById(`${i}-${j}`).classList.remove("visiting");
      document.getElementById(`${i}-${j}`).classList.remove("visited");
      document.getElementById(`${i}-${j}`).classList.remove("yellow");
      document.getElementById(`${i}-${j}`).classList.remove("block");
      document.getElementById(`${i}-${j}`).classList.remove("weight");
      blocked.clear();
      weighted.clear();
      start = null;
      end = null;
    }
  }
  let F = document.querySelector(".navbar").classList.contains("found");
  let NF = document.querySelector(".navbar").classList.contains("notFound");
  if (F) {
    document.querySelector(".navbar").classList.remove("found");
  }
  if (NF) {
    document.querySelector(".navbar").classList.remove("notFound");
  }
});
//----------------------------------------------------------clearPath---------------------------------------------------------------------

function clearPath() {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      document.getElementById(`${i}-${j}`).classList.remove("visiting");
      document.getElementById(`${i}-${j}`).classList.remove("visited");
      document.getElementById(`${i}-${j}`).classList.remove("yellow");
    }
  }
  let F = document.querySelector(".navbar").classList.contains("found");
  let NF = document.querySelector(".navbar").classList.contains("notFound");
  if (F) {
    document.querySelector(".navbar").classList.remove("found");
  }
  if (NF) {
    document.querySelector(".navbar").classList.remove("notFound");
  }
}
document.querySelector(".clearPath").addEventListener("click", () => {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      document.getElementById(`${i}-${j}`).classList.remove("visiting");
      document.getElementById(`${i}-${j}`).classList.remove("visited");
      document.getElementById(`${i}-${j}`).classList.remove("yellow");
    }
  }
  let F = document.querySelector(".navbar").classList.contains("found");
  let NF = document.querySelector(".navbar").classList.contains("notFound");
  if (F) {
    document.querySelector(".navbar").classList.remove("found");
  }
  if (NF) {
    document.querySelector(".navbar").classList.remove("notFound");
  }
});
//----------------------------------------------------------construct Grid----------------------------------------------------------------

for (let i = 0; i < rowSize; i++) {
  for (let j = 0; j < colSize; j++) {
    let grid = document.querySelector(".grid");
    let div = document.createElement("id", `${i}-${j}`);
    div.setAttribute("id", `${i}-${j}`);
    div.setAttribute("class", "cell");
    grid.append(div);
    div.addEventListener("click", function () {
      if (clicks === 2) clicks++; // s becomes e bug fix
      if (clicks > 0 && (i != start.i || j != start.j)) clicks++;
      if (clicks === 0) clicks++;
      // console.log("clicked " + div.id);
      // console.log(clicks);
      if (clicks === 1) {
        // reset = 0;
        start = { i: i, j: j };
        sId = generateId(start);

        document.getElementById(`${i}-${j}`).classList.add("green");
      } else if (clicks === 2) {
        end = { i: i, j: j };
        eId = generateId(end);

        document.getElementById(`${i}-${j}`).classList.add("red");
        // addWalls = true;

        document.querySelector(".grid").addEventListener("mousedown", (e) => {
          // console.log(e.target.id);
          if (e.target.id === sId) dragS = true;
          if (e.target.id === eId) dragE = true;
        });
        document.querySelector(".grid").addEventListener("mouseup", (e) => {
          dragE = false;
          dragS = false;
        });
        document.querySelector(".grid").addEventListener("mousemove", (e) => {
          //so when s or e  activated disable walls and weights ;
          const newId = e.target.id;
          if (dragE || dragS) {
            let block = document
              .getElementById(newId)
              .classList.contains("block");
            let weight = document
              .getElementById(newId)
              .classList.contains("weight");
            if (dragS && newId != eId && !block && !weight && isFree) {
              document.getElementById(sId).classList.remove("green");
              document.getElementById(newId).classList.add("green");

              sId = newId;
              let [i, j] = sId.split("-").map((str) => parseInt(str));
              start = { i: i, j: j };

              //If weights or blocks are there in new start position then remove them(eraser bug)
            }
            if (dragE && newId != sId && !block && !weight && isFree) {
              document.getElementById(eId).classList.remove("red");
              document.getElementById(newId).classList.add("red");
              eId = newId;
              let [i, j] = eId.split("-").map((str) => parseInt(str));
              end = { i: i, j: j };
              //If weights or blocks are there in new end position then remove them(bro then this becomes eraser (bad idea));
            }
          }
        });

        //After target is selected add mouse event listener to the grid:}
        // addMouseEventListener();
        // Add a mouse up event listener to the grid
        document.querySelector(".addWalls").addEventListener("click", () => {
          // console.log("Add Walls");
          addWalls = true;
          remove = false;
          addWeights = false;
        });
        document.addEventListener("keydown", (e) => {
          if (e.key === "b" && isFree) {
            addWalls = true;
            remove = false;
            addWeights = false;
          }
        });
        document.addEventListener("keydown", (e) => {
          // console.log(e);
          if (e.key === "w" && isFree) {
            addWalls = false;
            remove = false;
            addWeights = true;
          }
        });
        document.addEventListener("keydown", (e) => {
          if (e.key === "r" && isFree) {
            addWalls = false;
            remove = true;
            addWeights = false;
          }
        });
        document.querySelector(".addWeights").addEventListener("click", () => {
          addWeights = true;
          remove = false;
          addWalls = false;
        });
        document.querySelector(".Remove").addEventListener("click", () => {
          addWeights = false;
          addWalls = false;
          remove = true;
        });
        if (1) {
          // console.log("Add walls");
          let isDragging = false;
          document
            .querySelector(".grid")
            .addEventListener("mousedown", function () {
              // console.log("down");
              isDragging = true;
            });

          document
            .querySelector(".grid")
            .addEventListener("mouseup", function () {
              // console.log("up");
              isDragging = false;
            });

          document
            .querySelector(".grid")
            .addEventListener("mousemove", function (event) {
              // console.log(event.target.id);
              // console.log(event);

              if (isDragging && !dragE && !dragS) {
                // Get the cell that the mouse is currently over
                const cell = event.target;
                let s = `${start.i}-${start.j}`;
                let e = `${end.i}-${end.j}`;
                if (cell.classList.contains("cell")) {
                  // Add the "block" class to the cell

                  if (cell.id != s && cell.id != e && addWalls) {
                    // if(cell.classList.contains("block"))
                    // {

                    // }
                    //if the cell is weighted and user tries to add wall then remove the cell from weigted set and remove its weight class
                    if (weighted.has(cell.id)) {
                      cell.classList.remove("weight");
                      weighted.delete(cell.id);
                    }
                    // Add the cell's ID to the blocked set
                    // console.log(cell.id);
                    cell.classList.add("block");
                    const id = cell.id;
                    blocked.add(id);
                  } else if (cell.id != s && cell.id != e && remove) {
                    if (weighted.has(cell.id)) {
                      cell.classList.remove("weight");
                      weighted.delete(cell.id);
                    }
                    if (blocked.has(cell.id)) {
                      cell.classList.remove("block");
                      blocked.delete(cell.id);
                    }
                  }

                  if (cell.id != s && cell.id != e && addWeights) {
                    //if the cell is blocked and user tries to add weight then remove the cell from blocked set and remove its block class

                    if (blocked.has(cell.id)) {
                      cell.classList.remove("block");
                      blocked.delete(cell.id);
                    }
                    cell.classList.add("weight");
                    // Add the cell's ID to the blocked set
                    // console.log(cell.id);
                    const id = cell.id;
                    weighted.add(id);
                    // }
                  }
                }
              }
            });
        }

        document.querySelector(".BFS").addEventListener("click", () => {
          console.log("BFS");

          disableButtons();
          clearPath();
          isFree = false;
          let F = document.querySelector(".navbar").classList.contains("found");
          let NF = document
            .querySelector(".navbar")
            .classList.contains("notFound");
          if (F) {
            document.querySelector(".navbar").classList.remove("found");
          }
          if (NF) {
            document.querySelector(".navbar").classList.remove("notFound");
          }
          console.log(start);
          console.log(end);

          findBFS(start, end, blocked);
        });
        document.querySelector(".DFS").addEventListener("click", () => {
          console.log("DFS");

          let F = document.querySelector(".navbar").classList.contains("found");
          let NF = document
            .querySelector(".navbar")
            .classList.contains("notFound");
          if (F) {
            document.querySelector(".navbar").classList.remove("found");
          }
          if (NF) {
            document.querySelector(".navbar").classList.remove("notFound");
          }
          isFree = false;

          disableButtons();
          clearPath();
          findDFS(start, end, blocked);
        });
        // document.querySelector(".BiBFS").addEventListener("click", () => {
        //   findBiBFS(start, end, blocked);
        // });
        document.querySelector(".Dijkstra").addEventListener("click", () => {
          console.log("Dj");

          let F = document.querySelector(".navbar").classList.contains("found");
          let NF = document
            .querySelector(".navbar")
            .classList.contains("notFound");
          if (F) {
            document.querySelector(".navbar").classList.remove("found");
          }
          if (NF) {
            document.querySelector(".navbar").classList.remove("notFound");
          }
          // console.log("Dijkstra clicked");
          disableButtons();
          isFree = false;
          clearPath();
          findDijkstra(start, end, blocked, weighted);
        });
        document.querySelector(".GBFS").addEventListener("click", () => {
          console.log("Gb");

          let F = document.querySelector(".navbar").classList.contains("found");
          let NF = document
            .querySelector(".navbar")
            .classList.contains("notFound");
          if (F) {
            document.querySelector(".navbar").classList.remove("found");
          }
          if (NF) {
            document.querySelector(".navbar").classList.remove("notFound");
          }
          // console.log("GBFS clicked");
          isFree = false;
          disableButtons();
          clearPath();
          findGBFS(start, end, blocked, weighted);
        });
        document.querySelector(".AStar").addEventListener("click", () => {
          console.log("Astar");

          let F = document.querySelector(".navbar").classList.contains("found");
          let NF = document
            .querySelector(".navbar")
            .classList.contains("notFound");
          if (F) {
            document.querySelector(".navbar").classList.remove("found");
          }
          if (NF) {
            document.querySelector(".navbar").classList.remove("notFound");
          }
          // console.log("GBFS clicked");
          isFree = false;
          disableButtons();
          clearPath();
          findAStar(start, end, blocked, weighted);
        });
        // document.querySelector(".GBFS").addEventListener("click", () => {
        // console.log("Dijkstra clicked");
        //   disableButtons();
        //   clearPath();
        //   findGBFS(start, end, blocked, weighted);
        // });
      }
    });
  }
}
// const PriorityQueue = new PriorityQueue();

//-----------------------------------------------------------BFS--------------------------------------------------------------------------
function findBFS(start, end, blocked) {
  console.log(blocked);
  //If any weights are added remove them

  for (let i of weighted) {
    document.getElementById(i).classList.remove("weight");
    weighted.delete(i);
  }

  let visited = new Set(); //visited cells not blocked cells
  let prev = {};
  let queue = [];
  let rrr = [0, 1, 0, -1, 0];

  queue.push(start);
  visited.add(`${start.i}-${start.j}`);

  while (queue.length > 0) {
    let curr = queue.shift();
    for (let k = 0; k <= 3; k++) {
      let newRow = curr.i + rrr[k];
      let newCol = curr.j + rrr[k + 1];
      let id = `${newRow}-${newCol}`;
      if (blocked.has(id)) continue;
      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < rowSize &&
        newCol < colSize &&
        !visited.has(id)
      ) {
        queue.push({ i: newRow, j: newCol });
        // console.log(id);
        prev[id] = curr;
        if (newRow == end.i && newCol == end.j) {
          // console.log(`Found (${newRow},${newCol})`);
          setTimeout(() => {
            highlightPath(end, prev);
          }, visited.size * 7 + 270);
          return;
        }
        let div = document.getElementById(id);
        setTimeout(() => {
          div.classList.add("visiting");
        }, visited.size * 7); // add delay based on the number of visited cells
        setTimeout(() => {
          div.classList.add("visited");
        }, visited.size * 7 + 270);
        visited.add(id);
      }
    }
  }
  if (queue.length == 0) {
    setTimeout(() => {
      document.querySelector(".navbar").classList.add("notFound");
      enableButtons();
      isFree = true;
    }, visited.size * 7 + 270);
  }
}

//Highlit path for bfs and dijkstra (same for both)
function highlightPath(end, prev) {
  let path = constructPathGBFS(prev, end, start);
  highlightpathGBFS(path);
}

//-----------------------------------------------------------DFS-------------------------------------------------------------------
function findDFS(start, end, blocked) {
  //If any weights are added remove them

  for (let i of weighted) {
    document.getElementById(i).classList.remove("weight");
    weighted.delete(i);
  }
  let found = false;
  let visited = new Set();
  let path = [];
  let c = 0;
  dfs(start.i, start.j);
  if (!found) {
    // console.log(visited.size);
    setTimeout(() => {
      enableButtons();
      isFree = true;
      document.querySelector(".navbar").classList.add("notFound");
    }, visited.size * 20 + 270);
  }
  function dfs(i, j) {
    let id = `${i}-${j}`;

    if (
      found ||
      i < 0 ||
      j < 0 ||
      i == rowSize ||
      j == colSize ||
      visited.has(id) ||
      blocked.has(id)
    ) {
      return;
    }
    visited.add(id);
    path.push({ i: i, j: j }); // add current cell to path
    if (i == end.i && j == end.j) {
      found = true;
      setTimeout(
        (path) => {
          highlightpathDFS(path);
        },
        visited.size * 20 + 270,
        [...path]
      ); // create a copy of path using the spread operator(?)
      return;
    }
    let div = document.getElementById(id);
    setTimeout(() => {
      div.classList.add("visiting");
    }, visited.size * 20);
    setTimeout(() => {
      div.classList.add("visited");
    }, visited.size * 20 + 270);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i + 1, j);
    dfs(i, j - 1);
    path.pop(); // remove current cell from path
  }
}

//Highlight path for DFS
function highlightpathDFS(path) {
  let i = 0;
  setInterval(() => {
    if (i == path.length) {
      // console.log("chamki");
      return;
    }
    let curr = path[i];
    let id = `${curr.i}-${curr.j}`;
    let div = document.getElementById(id);
    div.classList.add("yellow");
    i++;
  }, 30);
  setTimeout(() => {
    enableButtons();
    isFree = true;
    document.querySelector(".navbar").classList.add("found");
  }, 30 * path.length);
}

// Bidirectional BFS
function findBiBFS(start, end, vis) {
  let startVisited = new Set();
  let endVisited = new Set();
  let startQueue = [];
  let endQueue = [];
  let startPrev = {};
  let endPrev = {};
  let rrr = [0, 1, 0, -1, 0];

  startQueue.push(start);
  endQueue.push(end);
  startVisited.add(`${start.i}-${start.j}`);
  endVisited.add(`${end.i}-${end.j}`);

  while (startQueue.length > 0 && endQueue.length > 0) {
    // Search from start
    let curr = startQueue.shift();
    for (let k = 0; k <= 3; k++) {
      let newRow = curr.i + rrr[k];
      let newCol = curr.j + rrr[k + 1];
      let id = `${newRow}-${newCol}`;
      if (vis.has(id)) continue;
      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < rowSize &&
        newCol < colSize &&
        !startVisited.has(id)
      ) {
        startQueue.push({ i: newRow, j: newCol });
        startPrev[id] = curr;
        if (endVisited.has(id)) {
          // console.log(`Found (${newRow},${newCol}) from start`);
          setTimeout(() => {
            highlightBidirectionalPath(end, start, startPrev, endPrev, id);
          }, startVisited.size * 7 + endVisited.size * 7 + 270);
          return;
        }
        let div = document.getElementById(id);
        setTimeout(() => {
          div.classList.add("visiting");
        }, startVisited.size * 7 + endVisited.size * 7); // add delay based on the number of visited cells
        setTimeout(() => {
          div.classList.add("visited");
        }, startVisited.size * 7 + endVisited.size * 7 + 270);
        startVisited.add(id);
      }
    }

    // Search from end
    curr = endQueue.shift();
    for (let k = 0; k <= 3; k++) {
      let newRow = curr.i + rrr[k];
      let newCol = curr.j + rrr[k + 1];
      let id = `${newRow}-${newCol}`;
      if (vis.has(id)) continue;
      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < rowSize &&
        newCol < colSize &&
        !endVisited.has(id)
      ) {
        endQueue.push({ i: newRow, j: newCol });
        endPrev[id] = curr;
        if (startVisited.has(id)) {
          // console.log(`Found (${newRow},${newCol}) from end`);
          setTimeout(() => {
            highlightBidirectionalPath(end, start, startPrev, endPrev, id);
          }, startVisited.size * 7 + endVisited.size * 7 + 270);
          return;
        }
        let div = document.getElementById(id);
        setTimeout(() => {
          div.classList.add("visiting");
        }, startVisited.size * 7 + endVisited.size * 7); // add delay based on the number of visited cells
        setTimeout(() => {
          div.classList.add("visited");
        }, startVisited.size * 7 + endVisited.size * 7 + 270);
        endVisited.add(id);
      }
    }
  }
}
// Highlight shortest path in bidirectional BFS
function highlightBidirectionalPath(
  start,
  end,
  startPrev,
  endPrev,
  intersection
) {
  let path = [];
  let curr = startPrev[intersection];
  while (curr !== undefined) {
    path.unshift(curr);
    curr = startPrev[curr.i + "-" + curr.j];
  }
  path.push({ i: intersection.split("-")[0], j: intersection.split("-")[1] });
  curr = endPrev[intersection];
  while (curr !== undefined) {
    path.push(curr);
    curr = endPrev[curr.i + "-" + curr.j];
  }
  path.push(end);
  console.log(path.length);
  for (let i = 0; i < path.length; i++) {
    let div = document.getElementById(`${path[i].i}-${path[i].j}`);
    setTimeout(() => {
      div.classList.add("yellow");
    }, i * 60);
  }
}

//--------------------------------------------------------Dijkstra------------------------------------------------------------------------
function findDijkstra(start, end, blocked, weighted) {
  //f(x)=g(x);

  let visited = new Set();
  let distance = {};
  let prev = {};
  let nodeWeight = {};
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      let id = `${i}-${j}`;
      distance[id] = Infinity;
      if (blocked.has(id)) continue;
      if (weighted.has(id)) nodeWeight[id] = 15;
      else nodeWeight[id] = 1;
    }
  }
  distance[start] = 0;
  let pq = new PriorityQueue();
  pq.enqueue([start, 0]);
  while (!pq.isEmpty()) {
    let currNode = pq.dequeue();
    // console.log(pq.size());
    let rrr = [0, 1, 0, -1, 0];
    let i = currNode[0].i;
    let j = currNode[0].j;
    let currNodeDist = currNode[1];

    for (let k = 0; k < 4; k++) {
      let newRow = i + rrr[k];
      let newCol = j + rrr[k + 1];
      let newNodeId = `${newRow}-${newCol}`;
      // console.log(newNodeId);
      if (
        i < 0 ||
        j < 0 ||
        i === rowSize ||
        j === colSize ||
        visited.has(newNodeId) ||
        blocked.has(newNodeId)
      )
        continue;
      let newId = { i: newRow, j: newCol };
      if (currNodeDist + nodeWeight[newNodeId] < distance[newNodeId]) {
        visited.add(newNodeId);
        prev[newNodeId] = { i: i, j: j };
        let div = document.getElementById(newNodeId);
        setTimeout(() => {
          div.classList.add("visiting");
        }, visited.size * 7); // add delay based on the number of visited cells
        setTimeout(() => {
          div.classList.add("visited");
        }, visited.size * 7 + 270);
        distance[newNodeId] = currNodeDist + nodeWeight[newNodeId];
        pq.enqueue([newId, distance[newNodeId]]);
      }
      if (newNodeId === `${end.i}-${end.j}`) {
        // console.log(distance[newNodeId]);
        setTimeout(() => {
          highlightPath(end, prev);
        }, visited.size * 7 + 270);
        return;
      }
    }
  }
  if (pq.size() == 0) {
    setTimeout(() => {
      enableButtons();
      isFree = true;
      document.querySelector(".navbar").classList.add("notFound");
    }, visited.size * 7);
  }
}

function findGBFS(start, target, blocked, weighted) {
  //f(x)=h(x);

  let pq = new PriorityQueue();
  let visited = new Set();
  let prev = {};
  pq.enqueue([start, 0]);
  while (!pq.isEmpty()) {
    let node = pq.dequeue();
    let i = node[0].i;
    let j = node[0].j;
    let currNode = { i: i, j: j };
    let currNodeId = `${i}-${j}`;
    visited.add(currNodeId);
    // console.log(currNodeId);
    //currNode === target; why  this is not working?
    if (currNodeId === `${target.i}-${target.j}`) {
      // console.log("targetFound");
      // return;
      setTimeout(() => {
        let path = constructPathGBFS(prev, target, start);
        highlightpathGBFS(path);
      }, 7 * visited.size + 270);
      return;
    }
    setTimeout(() => {
      let div = document.getElementById(currNodeId);
      div.classList.add("visiting");
    }, 7 * visited.size);
    setTimeout(() => {
      let div = document.getElementById(currNodeId);
      div.classList.add("visited");
    }, 7 * visited.size + 270);
    let validNeighbours = getValidNeighbors(currNode, visited, blocked);
    for (let item of validNeighbours) {
      // console.log(item);
      // console.log(prev);
      prev[`${item.i}-${item.j}`] = currNode;
      //when item is given as object its not working why?
      pq.enqueue([item, heuristic(item, target, weighted)]);
    }
  }
  //If target is not found
  if (pq.size() == 0) {
    setTimeout(() => {
      document.querySelector(".navbar").classList.add("notFound");
      enableButtons();
      isFree = true;
    }, visited.size * 7 + 270);
  }
}

function heuristic(currNode, target, weighted) {
  let x1 = currNode.i;
  let y1 = currNode.j;
  let x2 = target.i;
  let y2 = target.j;
  let currNodeId = `${x1}-${y1}`;
  if (weighted.has(currNodeId))
    return 15 + Math.abs(x2 - x1) + Math.abs(y2 - y1);
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
function getValidNeighbors(currNode, visited, blocked) {
  let rrr = [0, 1, 0, -1, 0];
  let validNeighbours = [];
  for (let k = 0; k <= 3; k++) {
    let newRow = currNode.i + rrr[k];
    let newCol = currNode.j + rrr[k + 1];
    let neighbourNodeId = `${newRow}-${newCol}`;
    if (
      newRow >= 0 &&
      newCol >= 0 &&
      newRow < rowSize &&
      newCol < colSize &&
      !blocked.has(neighbourNodeId) &&
      !visited.has(neighbourNodeId)
    ) {
      visited.add(neighbourNodeId);
      validNeighbours.push({ i: newRow, j: newCol });
    }
  }
  return validNeighbours;
}
function constructPathGBFS(prev, target, start) {
  // console.log(prev);
  let path = [];
  let currNode = target;
  // console.log(prev.length);
  while (currNode.i != start.i || currNode.j != start.j) {
    // console.log(currNode);
    path.unshift(currNode);
    let prevNode = prev[`${currNode.i}-${currNode.j}`];
    currNode = prevNode;
  }
  console.log(path.length);
  return path;
}

function highlightpathGBFS(path) {
  let i = 0;
  for (let item of path) {
    setTimeout(() => {
      let itemId = `${item.i}-${item.j}`;
      let div = document.getElementById(itemId);
      div.classList.add("yellow");
    }, 40 * i);
    i++;
  }
  setTimeout(() => {
    enableButtons();
    isFree = true;
    document.querySelector(".navbar").classList.add("found");
  }, 40 * i);
}
function generateId(obj) {
  return `${obj.i}-${obj.j}`;
}
function findAStar(start, target, blocked, weighted) {
  //f(x)=g(x)+h(x);
  let visited = new Set();
  let distance = {};
  let prev = {};
  let nodeWeight = {};
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      let id = `${i}-${j}`;
      distance[id] = Infinity;
      if (blocked.has(id)) continue;
      if (weighted.has(id)) nodeWeight[id] = 15;
      else nodeWeight[id] = 1;
    }
  }
  let startId = generateId(start);
  distance[startId] = 0;
  let pq = new PriorityQueue();
  pq.enqueue([start, 0]);
  while (!pq.isEmpty()) {
    let currNode = pq.dequeue();
    // console.log(pq.size());
    let rrr = [0, 1, 0, -1, 0];
    let i = currNode[0].i;
    let j = currNode[0].j;
    let currNodeId = `${i}-${j}`;
    // console.log(currNode[1]);

    let div = document.getElementById(currNodeId);
    setTimeout(() => {
      div.classList.add("visiting");
    }, visited.size * 7); // add delay based on the n umber of visited cells
    setTimeout(() => {
      div.classList.add("visited");
    }, visited.size * 7 + 270);
    for (let k = 0; k < 4; k++) {
      let newRow = i + rrr[k];
      let newCol = j + rrr[k + 1];
      let newNodeId = `${newRow}-${newCol}`;

      // console.log(newNodeId);
      if (
        i < 0 ||
        j < 0 ||
        i === rowSize ||
        j === colSize ||
        blocked.has(newNodeId)
      )
        continue;

      let newId = { i: newRow, j: newCol };
      if (distance[currNodeId] + nodeWeight[newNodeId] < distance[newNodeId]) {
        prev[newNodeId] = { i: i, j: j };
        visited.add(newNodeId);
        if (newNodeId === `${end.i}-${end.j}`) {
          // console.log(distance[newNodeId]);
          setTimeout(() => {
            highlightPath(end, prev);
          }, visited.size * 7 + 270);
          return;
        }
        distance[newNodeId] = distance[currNodeId] + nodeWeight[newNodeId];
        pq.enqueue([newId, distance[newNodeId] + hx(newId, target)]);
      }
    }
  }
  if (pq.size() == 0) {
    setTimeout(() => {
      enableButtons();
      isFree = true;
      document.querySelector(".navbar").classList.add("notFound");
    }, visited.size * 7);
  }
}
function hx(currNode, target) {
  let x1 = currNode.i;
  let y1 = currNode.j;
  let x2 = target.i;
  let y2 = target.j;
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

// Canvas declared in interface.js
handlers.updateCanvasSize();
ctx.translate(0,canvas.height);
ctx.scale(1,-1);
const player = new Player(canvas.width/2 , -388, 90);
player.fov.xamount = 90;


let wallCount = 0
const walls = [];
let renderWalls = [];
// const walls = JSON.parse(localStorage.getItem("walls"));

let showGraph = false;

// walls.push(new Boundary(canvas.width / 5, 400, canvas.width - canvas.width / 5, 400));
// /// walls.push(new Boundary(canvas.width / 5, 450, canvas.width - canvas.width / 5, 450));
// walls.push(new Boundary(canvas.width / 2, 350, canvas.width - canvas.width / 3, 350));

// walls.push(new Boundary(canvas.width / 7, 470, canvas.width - canvas.width / 7, 470));
// walls[0].hue = 50;

let tmp = ""
walls.forEach(w => {
    tmp = tmp + "walls.push(new Boundary(" + w.pos.x + ", " + w.pos.y + ", " +
                                        w.header.x + ", " + w.header.y + ", " + w.hue + "));\n"
});
console.log(tmp);
walls.push(new Boundary(430, 270, 530, 270));
walls.push(new Boundary(339, 118, 232, 192));
walls.push(new Boundary(157, 197, 113, 387));
walls.push(new Boundary(201, 417, 289, 321));
walls.push(new Boundary(354, 427, 488, 495));
walls.push(new Boundary(615, 464, 702, 417));
walls.push(new Boundary(790, 200, 694, 59));
walls.push(new Boundary(429, 20, 304, 32));
walls.push(new Boundary(148, 58, 39, 95));
walls.push(new Boundary(488, 115, 613, 157));
walls.push(new Boundary(912, 251, 931, 409));
walls.push(new Boundary(762, 345, 815, 472));

player.setFOV();
// console.log(walls)

player.draw();


let show2D = false;
let show2D2 = false;
let show3D = true;
let pause = false;



gameLoop();
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    playerHandler.movement();
    if (show2D) player.draw();
    renderWalls.splice(0, renderWalls.length)
    walls.forEach(wall => {
        // wall.hue +=1;
        if (show2D) wall.draw();
        if (wall.isInsideFOV()) {
            wall.processFOV();
            wall.calculate3D();
            renderWalls.push(wall);
        }
    });
    


    if (renderWalls.length >= 1 && !pause) {
        let sorted = wallsToGraph(renderWalls);
        if (sorted.length <= 1) sorted = [0]
        ctx.save();
                let tmp = [];
                sorted.forEach(i => {
                    tmp.push(renderWalls[i].index)
                });
                
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.font = "30px Arial";
                ctx.fillStyle = "white";
                // if (show2D) {
                ctx.fillText(tmp, 50, 50);
                ctx.font = "20px Arial";
                // ctx.fillText("expected: 2,0,1", 50, 75);
                ctx.fillText(renderWalls.length, 50, 100);
                // }
        ctx.restore();
        if (show3D) {
            sorted.forEach(index => {
                renderWalls[index].display3D();
            });
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.font = "30px Arial";
            ctx.fillStyle = 'white';
            // if (show2D) {
                ctx.fillText(tmp, 50, 50);
                ctx.font = "20px Arial";
                // ctx.fillText("expected: 2,0,1", 50, 75);
                ctx.fillText(renderWalls.length, 50, 100);
            // }
            ctx.restore();
        }
    }

    drawing.start();

    requestAnimationFrame(gameLoop);
}


function logSorted(lst) {
    let tmp = [];
    lst.forEach(i => {
        tmp.push(i.index)
    });
    console.log(tmp)
}



// background terrain
function background() {
    // ctx.fillStyle = '#00d2ff';
    ctx.fillStyle = "#b3b3b3";
    ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, -canvas.height/2, canvas.width, canvas.height);
}


// shapes
// circle(200,200,10, 'cyan', 3);
// ellipse(300,200, 55,25, 'yellow', 2);
// line(50, 50, 200, 50, 'green', 10);

// polygon([canvas.width/2, 50,
//         canvas.width-canvas.width/3, canvas.height/2,
//         canvas.width/2, canvas.height-50,
//         canvas.width/3, canvas.height/2]);



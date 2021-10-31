// const canvas3D = document.getElementById('canvas3D');
// const canvas2D = document.getElementById("canvas2D");
let canvas = document.getElementById('canvas3D');
let ctx = canvas.getContext('2d', { alpha: false });

const canvas2D = document.getElementById("canvas2D");
const ctx2D = canvas2D.getContext("2d", { alpha: false });

function set2Dctx() {
    ctx = canvas2D.getContext("2d", { alpha: false });
}
function set3Dctx() {
    ctx = canvas.getContext('2d', { alpha: false });
}

const cooldown = 15
let currentCooldown = cooldown;
let undoWall = false;

const keysPressed = {};

const mouse = {
    'x': undefined,
    'y': undefined
};

const handlers = {
    click(e) {
        mouse.x = e.offsetX;
        mouse.y = canvas2D.height - e.offsetY;
        drawing.startpos.x = mouse.x;
        drawing.startpos.y = mouse.y;
        // console.table([mouse.x, mouse.y, e.clientX, e.clientY]);
        e.preventDefault();
        drawing.isDrawing = true;
    },
    unclick(e) {
        e.preventDefault();
        document.activeElement.blur();
        drawing.stop();
    },
    updateCanvasSize() {
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
        canvas2D.height = canvas2D.offsetHeight;
        canvas2D.width = canvas2D.offsetWidth;
        // console.log(canvas.height, canvas.width);
    }
};



const drawing = {
    isDrawing : false,
    startpos : {
        'x' : undefined,
        'y' : undefined
    },
    start() {
        if (currentCooldown <= 0) currentCooldown = cooldown;
        if (currentCooldown > 0 && currentCooldown < cooldown) currentCooldown --;
        if (!this.isDrawing) {
            if ((undoWall || (keysPressed.Control && keysPressed.z)) && currentCooldown == cooldown && walls.length > 0) {  // Remove latest wall
                console.log("undioing") // TEST
                currentCooldown = cooldown - 1;
                wallCount --;
                walls.pop();
            }
            undoWall = false;
            if (mouse.x < canvas2D.width && mouse.x > 0 && mouse.y < canvas2D.height && mouse.y > 0) {
                this.startpos.x = mouse.x;
                this.startpos.y = mouse.y;
            } else {
                return;
            }
        }
        if (this.isDrawing && (mouse.x < canvas2D.width && mouse.x > 0 && mouse.y < canvas2D.height && mouse.y > 0)) {
            // if (keysPressed.Shift) {
            //     walls.forEach(wall => {
            //         if (mouse.x >= wall.pos.x -5 && mouse.x <= wall.pos.x + 5 &&
            //             mouse.y >= wall.pos.y -5 && mouse.y <= wall.pos.y + 5 ) {
            //             console.log("yay");
            //         }
            //         if (mouse.x >= wall.pos.x + wall.header.x -5 && mouse.x <= wall.pos.x + wall.header.x + 5 &&
            //             mouse.y >= wall.pos.y + wall.header.y -5 && mouse.y <= wall.pos.y + wall.header.y + 5) {
            //             console.log("yay")
            //         }
            //     });
            // }
            set2Dctx();
            line(this.startpos.x, this.startpos.y, mouse.x, mouse.y);
            set3Dctx();
        }
    },
    stop() {
        if (this.isDrawing && (Math.abs(this.startpos.x - mouse.x) > 10 || Math.abs(this.startpos.y - mouse.y) > 10)) {
            newWall = { "pos":      {   "x": this.startpos.x,
                                        "y": this.startpos.y },
                        "header":   {   "x": mouse.x - this.startpos.x,
                                        "y": mouse.y - this.startpos.y }
            }
            let intCount = 0;
            walls.forEach(wall => {
                if (isIntersectionVectors(wall, newWall)) {
                    intCount ++;
                };
            });
            if (intCount == 0) {
                walls.push(new Boundary(this.startpos.x, this.startpos.y,
                                        mouse.x, mouse.y,
                                        HEXtoHSL(document.getElementById("colorpick").value).h));
            }
        }
        this.isDrawing = false;
    }
};

document.addEventListener('resize', handlers.updateCanvasSize());
document.onkeyup = (e) => delete keysPressed[e.key];
document.onkeydown = (e) => (keysPressed[e.key] = true);

document.ondblclick = (e) => e.preventDefault();

canvas2D.addEventListener("pointermove", (e) => {
    e.preventDefault();
    mouse.x = e.offsetX;
    mouse.y = canvas2D.height - e.offsetY;
    // console.table([mouse.x, mouse.y, e.clientX, e.clientY]);
});
canvas2D.addEventListener("pointerdown", (e) => handlers.click(e));
// canvas 3d event listener in controller
document.addEventListener('pointerup', (e) => handlers.unclick(e));

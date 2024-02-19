class GameOfLife {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private running: boolean;
    private currentGen;
    private nextGen;
    private savedGen;
    private width: number;
    private height: number;
    private clickX: number;
    private clickY: number;
    private clickDrag: boolean;
    private clearBtn: HTMLButtonElement;
    private playBtn: HTMLButtonElement;
    private pauseBtn: HTMLButtonElement;
    private replayBtn: HTMLButtonElement;

    constructor(height: number, width: number) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        let clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
        let playBtn = document.getElementById('playBtn') as HTMLButtonElement;
        let pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
        let replayBtn = document.getElementById('replayBtn') as HTMLButtonElement;
        this.currentGen = [];
        this.nextGen = [];
        this.savedGen = [];
        this.canvas = canvas;
        this.context = context;
        this.clearBtn = clearBtn;
        this.playBtn = playBtn;
        this.pauseBtn = pauseBtn;
        this.replayBtn = replayBtn;
        this.width = width;
        this.height = height;
        this.running = false;
        for (let x = 0; x < this.width +2; x++) {
            this.nextGen[x] = [];
            for (let y = 0; y < this.height +2; y++) {
                this.nextGen[x][y] = false;
            }
        }
        for (let x = 0; x < this.width + 2; x++) {
            this.currentGen[x] = [];
            for (let y = 0; y < this.height +2; y++) {
                this.currentGen[x][y] = false;
            }
        }
        for (let x = 0; x < this.width + 2; x++) {
            this.savedGen[x] = [];
            for (let y = 0; y < this.height + 2; y++) {
                this.savedGen[x][y] = false;
            }
        }
        this.initUserInput();
        this.drawAllTrue();
        this.drawGridLines();

        //Here is the main loop setup to iterate every quarter second to be able to allow the user to see the logic.
        setInterval(() => {
            if (this.running == true) {
                this.deriveNextGen();
                this.drawAllTrue();
            }
            else if (this.running == false) {
            }
        }, 250);
    }

    //Here we check each cell's neighbors to determain if it lives, dies, or is born.
    public deriveNextGen() {
        let neighbors = 0;
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                if (this.currentGen[x - 1][y - 1]) {
                    neighbors++;
                }
                if (this.currentGen[x - 1][y]) {
                    neighbors++;
                }
                if (this.currentGen[x - 1][y + 1]) {
                    neighbors++;
                }
                if (this.currentGen[x][y - 1]) {
                    neighbors++;
                }
                if (this.currentGen[x][y + 1]) {
                    neighbors++;
                }
                if (this.currentGen[x + 1][y - 1]) {
                    neighbors++;
                }
                if (this.currentGen[x + 1][y]) {
                    neighbors++;
                }
                if (this.currentGen[x + 1][y + 1]) {
                    neighbors++;
                }
                if (this.currentGen[x][y] == false && neighbors == 3) {
                    this.nextGen[x][y] = true;
                }
                else if (this.currentGen[x][y] == true && (neighbors < 2 || neighbors > 3)) {
                    this.nextGen[x][y] = false;
                }
                else if (this.currentGen[x][y] == true && (neighbors > 1 && neighbors < 4)) {
                    this.nextGen[x][y] = true;
                }
                neighbors = 0;
            }
        }
        for (let x = 0; x < this.width + 2; x++) {
            for (let y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = this.nextGen[x][y];
            }
        }
    }

    //Checks the 2D array for any cells with a "true" value and draws a square at a position derived from the X and Y value of the index of that cell
    drawAllTrue() {
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                if (this.currentGen[x][y] == true) {
                    this.context.fillRect((x * 10 + x + 0) -11, (y * 10 + y + 0) - 11, 10, 10);
                }
                else if (this.currentGen[x][y] == false) {
                    this.context.clearRect((x * 10 + x + 0) - 11, (y * 10 + y + 0) - 11, 10, 10);
                }
            }
        }
    }

    drawGridLines() {
        if (this.running == false) {
            this.context.strokeStyle = "brown";
        }
        else if (this.running == true) {
            this.context.strokeStyle = "wheat";
        }
        this.context.beginPath();
        for (let i = 1; i < this.width; i++) {
            this.context.moveTo(0 - 0.5, ((i * 11) + 0 - 0.5));
            this.context.lineTo((11 * this.width) + 2 - 0.5, ((i * 11) + 0) - 0.5);
        }
        for (let j = 1; j < this.height; j++) {
            this.context.moveTo(((j * 11) + 0) - 0.5, 0 - 0.5);
            this.context.lineTo(((j * 11) + 0) - 0.5, (11 * this.height) + 2 - 0.5);
        }
        this.context.stroke();
        this.context.fillStyle = "black";
    }

    initUserInput() {
        let canvas = this.canvas;
        let clearBtn = this.clearBtn;
        let playBtn = this.playBtn;
        let pauseBtn = this.pauseBtn;
        let replayBtn = this.replayBtn;

        canvas.addEventListener("mousedown", this.pressEvent);

        canvas.addEventListener("touchstart", this.pressEvent);
        
        clearBtn.addEventListener("click", this.clearGrid);

        playBtn.addEventListener("click", this.pressPlay);

        pauseBtn.addEventListener("click", this.pressPause);

        replayBtn.addEventListener("click", this.replayLastSetup)
    }

    pressEvent = (e: MouseEvent | TouchEvent) => {
        let eventX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let eventY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].clientY :
            (e as MouseEvent).pageY;

        //This uses the X and Y location values of the mousedown and touchstart event, and converts them to a reletive index in the array.
        let arrX = Math.floor(((eventX - (this.canvas.offsetLeft) - 2) + 11) / 11);
        let arrY = Math.floor(((eventY - (this.canvas.offsetTop) - 2)  + 11) / 11);
        if (this.currentGen[arrX][arrY] == true) {
            this.currentGen[arrX][arrY] = false;
        }
        else if (this.currentGen[arrX][arrY] == false) {
            this.currentGen[arrX][arrY] = true;
        }
        for (let x = 0; x < this.width + 2; x++) {
            for (let y = 0; y < this.height + 2; y++) {
                this.savedGen[x][y] = this.currentGen[x][y];
            }
        }
        this.drawAllTrue();
    }

    clearGrid = (e: Event) => {
        for (let x = 0; x < this.width + 2; x++) {
            for (let y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = false;
                this.nextGen[x][y] = false;
            }
        }
        this.running = false;
        this.drawAllTrue();
        this.drawGridLines();
    }

    pressPlay = (e: Event) => {
        this.running = true;
        //this.playBtn.style.backgroundColor = "red";
        this.drawGridLines();
        this.playBtn.value = "<span class='bi-pause-fill'></span>";
        this.playBtn.disabled = true;
    }

    pressPause = (e: Event) => {
        this.running = false;
        //this.playBtn.style.backgroundColor = "gainsboro";
        this.playBtn.disabled = false;
        this.drawGridLines();
    }

    replayLastSetup = (e: Event) => {
        for (let x = 0; x < this.width + 2; x++) {
            for (let y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = false;
                this.nextGen[x][y] = false;
            }
        }
        for (let x = 0; x < this.width + 2; x++) {
            for (let y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = this.savedGen[x][y];
            }
        }
        this.drawAllTrue();
    }
}

new GameOfLife(50, 50);
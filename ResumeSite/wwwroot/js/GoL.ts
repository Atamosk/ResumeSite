class GameOfLife {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private running: boolean;
    private currentGen;
    private nextGen;
    private width: number;
    private height: number;
    private clickX: number;
    private clickY: number;
    private clickDrag: boolean;
    private clearBtn: HTMLButtonElement;
    private playBtn: HTMLButtonElement;

    constructor(height: number, width: number) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        let clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
        let playBtn = document.getElementById('playBtn') as HTMLButtonElement;
        this.currentGen = [];
        this.nextGen = [];
        this.canvas = canvas;
        this.context = context;
        this.clearBtn = clearBtn;
        this.playBtn = playBtn;
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
        this.initUserInput();
        this.drawAllTrue();
    }
    private lifeHappens = (e: Event) => {
        this.running = true;
        for (let j = 0; j < 1; j++) {
            this.deriveNextGen();
            this.drawAllTrue();
        }
        this.running = false;
    }

    private deriveNextGen() {
        let currentCell = false;
        let neighbors = 0;
        for (let x = 1; x <= this.width; x++) {
            this.currentGen[x] = [];
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
                neighbors = 0;
            }
        }
        for (let x = 0; x < this.width + 2; x++) {
            this.currentGen[x] = [];
            for (let y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = this.nextGen[x][y];
            }
        }
        this.drawAllTrue();
    }


    private drawAllTrue() {
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                if (this.currentGen[x][y] == true) {
                    this.context.fillRect((x * 10 + x + 1) -11, (y * 10 + y + 1) - 11, 10, 10);
                }
                else if (this.currentGen[x][y] == false) {
                    this.context.clearRect((x * 10 + x + 1) - 11, (y * 10 + y + 1) - 11, 10, 10);
                }
            }
        }
    }

    private initUserInput() {
        let canvas = this.canvas;
        let clearBtn = this.clearBtn;
        let playBtn = this.playBtn;

        canvas.addEventListener("mousedown", this.pressEvent);

        canvas.addEventListener("touchstart", this.pressEvent);
        
        clearBtn.addEventListener("click", this.clearGrid);

        playBtn.addEventListener("click", this.lifeHappens);
    }

    private pressEvent = (e: MouseEvent | TouchEvent) => {
        let eventX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let eventY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].clientY :
            (e as MouseEvent).pageY;

        let arrX = Math.floor(((eventX - (this.canvas.offsetLeft) - 2) + 11) / 11);
        let arrY = Math.floor(((eventY - (this.canvas.offsetTop) - 2)  + 11) / 11);
        if (this.currentGen[arrX][arrY] == true) {
            this.currentGen[arrX][arrY] = false;
        }
        else if (this.currentGen[arrX][arrY] == false) {
            this.currentGen[arrX][arrY] = true;
        }
        this.drawAllTrue();

    }
    private clearGrid = (e: Event) => {
        for (let x = 0; x < this.width + 2; x++) {
            this.currentGen[x] = [];
            for (let y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = false;
            }
        }
        this.drawAllTrue();
    }
}

new GameOfLife(50, 50);
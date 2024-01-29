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

    constructor(height: number, width: number) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        this.currentGen = [];
        this.nextGen = [];
        this.canvas = canvas;
        this.context = context;
        this.width = width;
        this.height = height;
        this.running = false;
        for (let x = 0; x < this.width; x++) {
            this.nextGen[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.nextGen[x][y] = false;
            }
        }
        for (let x = 0; x < this.width; x++) {
            this.currentGen[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.currentGen[x][y] = false;
            }
        }
        this.initUserInput();
        this.drawAllTrue();
    }

    private drawAllTrue() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.currentGen[x][y] == true) {
                    this.context.fillRect((x * 10 + x + 1), (y * 10 + y + 1), 10, 10);
                }
                else if (this.currentGen[x][y] == false) {
                    this.context.clearRect((x * 10 + x + 1), (y * 10 + y + 1), 10, 10);
                }
            }
        }
    }

    private initUserInput() {
        let canvas = this.canvas;

        canvas.addEventListener("mousedown", this.pressEvent);
        //canvas.addEventListener("mouseup", this.releaseEvent);
        //canvas.addEventListener("mousemove", this.cancelEvent);

        canvas.addEventListener("touchstart", this.pressEvent);
        //canvas.addEventListener("touchend", this.releaseEvent);
        //canvas.addEventListener("touchcancel", this.cancelEvent);
    }

    private click(x: number, y: number, drag: boolean) {
        this.clickX = x;
        this.clickY = y;
        this.clickDrag = drag;
    }

    private pressEvent = (e: MouseEvent | TouchEvent) => {
        let eventX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let eventY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].clientY :
            (e as MouseEvent).pageY;

        let arrX = Math.floor(((eventX -= this.canvas.offsetLeft) - 2)/ 11);
        let arrY = Math.floor(((eventY -= this.canvas.offsetTop) - 2)/ 11);
        if (this.currentGen[arrX][arrY] == true) {
            this.currentGen[arrX][arrY] = false;
        }
        else if (this.currentGen[arrX][arrY] == false) {
            this.currentGen[arrX][arrY] = true;
        }
        this.drawAllTrue();

    }
};

new GameOfLife(50, 50);
var GameOfLife = /** @class */ (function () {
    function GameOfLife(height, width) {
        var _this = this;
        this.pressEvent = function (e) {
            var eventX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var eventY = e.changedTouches ?
                e.changedTouches[0].clientY :
                e.pageY;
            //This uses the X and Y location values of the mousedown and touchstart event, and converts them to a reletive index in the array.
            var arrX = Math.floor(((eventX - (_this.canvas.offsetLeft) - 2) + 11) / 11);
            var arrY = Math.floor(((eventY - (_this.canvas.offsetTop) - 2) + 11) / 11);
            if (_this.currentGen[arrX][arrY] == true) {
                _this.currentGen[arrX][arrY] = false;
            }
            else if (_this.currentGen[arrX][arrY] == false) {
                _this.currentGen[arrX][arrY] = true;
            }
            for (var x = 0; x < _this.width + 2; x++) {
                for (var y = 0; y < _this.height + 2; y++) {
                    _this.savedGen[x][y] = _this.currentGen[x][y];
                }
            }
            _this.drawAllTrue();
        };
        this.clearGrid = function (e) {
            for (var x = 0; x < _this.width + 2; x++) {
                for (var y = 0; y < _this.height + 2; y++) {
                    _this.currentGen[x][y] = false;
                    _this.nextGen[x][y] = false;
                }
            }
            _this.running = false;
            _this.drawAllTrue();
            _this.drawGridLines();
        };
        this.pressPlay = function (e) {
            _this.running = true;
            //this.playBtn.style.backgroundColor = "red";
            _this.drawGridLines();
            _this.playBtn.value = "<span class='bi-pause-fill'></span>";
            _this.playBtn.disabled = true;
        };
        this.pressPause = function (e) {
            _this.running = false;
            //this.playBtn.style.backgroundColor = "gainsboro";
            _this.playBtn.disabled = false;
            _this.drawGridLines();
        };
        this.replayLastSetup = function (e) {
            for (var x = 0; x < _this.width + 2; x++) {
                for (var y = 0; y < _this.height + 2; y++) {
                    _this.currentGen[x][y] = false;
                    _this.nextGen[x][y] = false;
                }
            }
            for (var x = 0; x < _this.width + 2; x++) {
                for (var y = 0; y < _this.height + 2; y++) {
                    _this.currentGen[x][y] = _this.savedGen[x][y];
                }
            }
            _this.drawAllTrue();
        };
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        var clearBtn = document.getElementById('clearBtn');
        var playBtn = document.getElementById('playBtn');
        var pauseBtn = document.getElementById('pauseBtn');
        var replayBtn = document.getElementById('replayBtn');
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
        for (var x = 0; x < this.width + 2; x++) {
            this.nextGen[x] = [];
            for (var y = 0; y < this.height + 2; y++) {
                this.nextGen[x][y] = false;
            }
        }
        for (var x = 0; x < this.width + 2; x++) {
            this.currentGen[x] = [];
            for (var y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = false;
            }
        }
        for (var x = 0; x < this.width + 2; x++) {
            this.savedGen[x] = [];
            for (var y = 0; y < this.height + 2; y++) {
                this.savedGen[x][y] = false;
            }
        }
        this.initUserInput();
        this.drawAllTrue();
        this.drawGridLines();
        //Here is the main loop setup to iterate every quarter second to be able to allow the user to see the logic.
        setInterval(function () {
            if (_this.running == true) {
                _this.deriveNextGen();
                _this.drawAllTrue();
            }
            else if (_this.running == false) {
            }
        }, 250);
    }
    //Here we check each cell's neighbors to determain if it lives, dies, or is born.
    GameOfLife.prototype.deriveNextGen = function () {
        var neighbors = 0;
        for (var x = 1; x <= this.width; x++) {
            for (var y = 1; y <= this.height; y++) {
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
        for (var x = 0; x < this.width + 2; x++) {
            for (var y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = this.nextGen[x][y];
            }
        }
    };
    //Checks the 2D array for any cells with a "true" value and draws a square at a position derived from the X and Y value of the index of that cell
    GameOfLife.prototype.drawAllTrue = function () {
        for (var x = 1; x <= this.width; x++) {
            for (var y = 1; y <= this.height; y++) {
                if (this.currentGen[x][y] == true) {
                    this.context.fillRect((x * 10 + x + 0) - 11, (y * 10 + y + 0) - 11, 10, 10);
                }
                else if (this.currentGen[x][y] == false) {
                    this.context.clearRect((x * 10 + x + 0) - 11, (y * 10 + y + 0) - 11, 10, 10);
                }
            }
        }
    };
    GameOfLife.prototype.drawGridLines = function () {
        if (this.running == false) {
            this.context.strokeStyle = "brown";
        }
        else if (this.running == true) {
            this.context.strokeStyle = "wheat";
        }
        this.context.beginPath();
        for (var i = 1; i < this.width; i++) {
            this.context.moveTo(0 - 0.5, ((i * 11) + 0 - 0.5));
            this.context.lineTo((11 * this.width) + 2 - 0.5, ((i * 11) + 0) - 0.5);
        }
        for (var j = 1; j < this.height; j++) {
            this.context.moveTo(((j * 11) + 0) - 0.5, 0 - 0.5);
            this.context.lineTo(((j * 11) + 0) - 0.5, (11 * this.height) + 2 - 0.5);
        }
        this.context.stroke();
        this.context.fillStyle = "black";
    };
    GameOfLife.prototype.initUserInput = function () {
        var canvas = this.canvas;
        var clearBtn = this.clearBtn;
        var playBtn = this.playBtn;
        var pauseBtn = this.pauseBtn;
        var replayBtn = this.replayBtn;
        canvas.addEventListener("mousedown", this.pressEvent);
        canvas.addEventListener("touchstart", this.pressEvent);
        clearBtn.addEventListener("click", this.clearGrid);
        playBtn.addEventListener("click", this.pressPlay);
        pauseBtn.addEventListener("click", this.pressPause);
        replayBtn.addEventListener("click", this.replayLastSetup);
    };
    return GameOfLife;
}());
new GameOfLife(50, 50);
//# sourceMappingURL=GoL.js.map
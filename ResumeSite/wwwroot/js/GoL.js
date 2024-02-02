var GameOfLife = /** @class */ (function () {
    function GameOfLife(height, width) {
        var _this = this;
        this.lifeHappens = function (e) {
            _this.running = true;
            for (var j = 0; j < 1; j++) {
                _this.deriveNextGen();
                _this.drawAllTrue();
            }
            _this.running = false;
        };
        this.pressEvent = function (e) {
            var eventX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var eventY = e.changedTouches ?
                e.changedTouches[0].clientY :
                e.pageY;
            var arrX = Math.floor(((eventX - (_this.canvas.offsetLeft) - 2) + 11) / 11);
            var arrY = Math.floor(((eventY - (_this.canvas.offsetTop) - 2) + 11) / 11);
            if (_this.currentGen[arrX][arrY] == true) {
                _this.currentGen[arrX][arrY] = false;
            }
            else if (_this.currentGen[arrX][arrY] == false) {
                _this.currentGen[arrX][arrY] = true;
            }
            _this.drawAllTrue();
        };
        this.clearGrid = function (e) {
            for (var x = 0; x < _this.width + 2; x++) {
                _this.currentGen[x] = [];
                for (var y = 0; y < _this.height + 2; y++) {
                    _this.currentGen[x][y] = false;
                }
            }
            _this.drawAllTrue();
        };
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        var clearBtn = document.getElementById('clearBtn');
        var playBtn = document.getElementById('playBtn');
        this.currentGen = [];
        this.nextGen = [];
        this.canvas = canvas;
        this.context = context;
        this.clearBtn = clearBtn;
        this.playBtn = playBtn;
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
        this.initUserInput();
        this.drawAllTrue();
    }
    GameOfLife.prototype.deriveNextGen = function () {
        var currentCell = false;
        var neighbors = 0;
        for (var x = 1; x <= this.width; x++) {
            this.currentGen[x] = [];
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
                neighbors = 0;
            }
        }
        for (var x = 0; x < this.width + 2; x++) {
            this.currentGen[x] = [];
            for (var y = 0; y < this.height + 2; y++) {
                this.currentGen[x][y] = this.nextGen[x][y];
            }
        }
        this.drawAllTrue();
    };
    GameOfLife.prototype.drawAllTrue = function () {
        for (var x = 1; x <= this.width; x++) {
            for (var y = 1; y <= this.height; y++) {
                if (this.currentGen[x][y] == true) {
                    this.context.fillRect((x * 10 + x + 1) - 11, (y * 10 + y + 1) - 11, 10, 10);
                }
                else if (this.currentGen[x][y] == false) {
                    this.context.clearRect((x * 10 + x + 1) - 11, (y * 10 + y + 1) - 11, 10, 10);
                }
            }
        }
    };
    GameOfLife.prototype.initUserInput = function () {
        var canvas = this.canvas;
        var clearBtn = this.clearBtn;
        var playBtn = this.playBtn;
        canvas.addEventListener("mousedown", this.pressEvent);
        canvas.addEventListener("touchstart", this.pressEvent);
        clearBtn.addEventListener("click", this.clearGrid);
        playBtn.addEventListener("click", this.lifeHappens);
    };
    return GameOfLife;
}());
new GameOfLife(50, 50);
//# sourceMappingURL=GoL.js.map
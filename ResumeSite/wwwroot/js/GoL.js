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
            var arrX = Math.floor(((eventX -= _this.canvas.offsetLeft) - 2) / 11);
            var arrY = Math.floor(((eventY -= _this.canvas.offsetTop) - 2) / 11);
            if (_this.currentGen[arrX][arrY] == true) {
                _this.currentGen[arrX][arrY] = false;
            }
            else if (_this.currentGen[arrX][arrY] == false) {
                _this.currentGen[arrX][arrY] = true;
            }
            _this.drawAllTrue();
        };
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        this.currentGen = [];
        this.nextGen = [];
        this.canvas = canvas;
        this.context = context;
        this.width = width;
        this.height = height;
        this.running = false;
        for (var x = 0; x < this.width; x++) {
            this.nextGen[x] = [];
            for (var y = 0; y < this.height; y++) {
                this.nextGen[x][y] = false;
            }
        }
        for (var x = 0; x < this.width; x++) {
            this.currentGen[x] = [];
            for (var y = 0; y < this.height; y++) {
                this.currentGen[x][y] = false;
            }
        }
        this.initUserInput();
        this.drawAllTrue();
    }
    GameOfLife.prototype.drawAllTrue = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.currentGen[x][y] == true) {
                    this.context.fillRect((x * 10 + x + 1), (y * 10 + y + 1), 10, 10);
                }
                else if (this.currentGen[x][y] == false) {
                    this.context.clearRect((x * 10 + x + 1), (y * 10 + y + 1), 10, 10);
                }
            }
        }
    };
    GameOfLife.prototype.initUserInput = function () {
        var canvas = this.canvas;
        canvas.addEventListener("mousedown", this.pressEvent);
        //canvas.addEventListener("mouseup", this.releaseEvent);
        //canvas.addEventListener("mousemove", this.cancelEvent);
        canvas.addEventListener("touchstart", this.pressEvent);
        //canvas.addEventListener("touchend", this.releaseEvent);
        //canvas.addEventListener("touchcancel", this.cancelEvent);
    };
    GameOfLife.prototype.click = function (x, y, drag) {
        this.clickX = x;
        this.clickY = y;
        this.clickDrag = drag;
    };
    return GameOfLife;
}());
;
new GameOfLife(50, 50);
//# sourceMappingURL=GoL.js.map
var SnakeGame = function (canvas, options) {
    options = options || {};

    this.options = $.extend({}, this.defaultOptions, options);

    this.canvas = canvas;
    this.snakeModel = {
        body: [
            {
                x: this.options.startPointX,
                y: this.options.startPointY
            },
            {
                x: this.options.startPointX - this.options.unitSize,
                y: this.options.startPointY
            },
            {
                x: this.options.startPointX - this.options.unitSize*2,
                y: this.options.startPointY
            },
            {
                x: this.options.startPointX - this.options.unitSize*3,
                y: this.options.startPointY
            },
            {
                x: this.options.startPointX - this.options.unitSize*4,
                y: this.options.startPointY
            }
        ],
        direction: 'right',
        turnTo: null
    };
    this._rabbitPosition = null;
    this.init();
};

SnakeGame.prototype = {
    constructor: SnakeGame,
    _intervalId: null,

    defaultOptions: {
        snakeName: 'Zed',
        unitSize: 10, // pixels
        snakeColor: '#395C3A',
        rabbitColor: '#108690',
        startPointX: 100,
        startPointY: 100,
        speed: 200, // ms
        scoreWeight: 100
    },

    keyMappings: {
        _38: 'up',
        _40: 'down',
        _37: 'left',
        _39: 'right'
    },

    init: function () {
        var self = this;

        this.initialSnakeLength = this.snakeModel.body.length;

        this.ctx = this.canvas.getContext('2d');

        this.bindKeyEvents();

        this.drawSnake(true);
        this.drawRabbit();

        this._intervalId = setInterval(function () {
            if (self.isRabbitCaught()) {
                self.increaseSnake();
                self.drawRabbit();
            }
            self.drawSnake();
        }, this.options.speed);
    },

    bindKeyEvents: function () {
        var self = this;

        $('body').on('keydown', function (e) {
            self.snakeModel.turnTo = self.keyMappings['_' + e.keyCode];
        });
    },

    turnSnake: function (turnTo) {
        var self = this;
        var snake = this.snakeModel;
        var newHead;

        self.snakeModel.body.pop();

        switch (true) {
            case (snake.direction == 'right' || snake.direction == 'left') && turnTo == 'up':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.y = this.snakeModel.body[0].y - this.options.unitSize;
                self.snakeModel.direction = turnTo;
                break;
            case (snake.direction == 'right' || snake.direction == 'left') && turnTo == 'down':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.y = this.snakeModel.body[0].y + this.options.unitSize;
                self.snakeModel.direction = turnTo;
                break;
            case (snake.direction == 'up' || snake.direction == 'down') && turnTo == 'left':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.x = this.snakeModel.body[0].x - this.options.unitSize;
                self.snakeModel.direction = turnTo;
                break;
            case (snake.direction == 'up' || snake.direction == 'down') && turnTo == 'right':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.x = this.snakeModel.body[0].x + this.options.unitSize;
                self.snakeModel.direction = turnTo;
                break;
            case snake.direction == 'right':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.x = this.snakeModel.body[0].x + this.options.unitSize;
                break;
            case snake.direction == 'left':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.x = this.snakeModel.body[0].x - this.options.unitSize;
                break;
            case snake.direction == 'up':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.y = this.snakeModel.body[0].y - this.options.unitSize;
                break;
            case snake.direction == 'down':
                newHead = _.clone(this.snakeModel.body[0]);
                newHead.y = this.snakeModel.body[0].y + this.options.unitSize;
                break;
        }

        self.snakeModel.body.unshift(newHead);
    },

    isSnakeAlive: function () {
        var self = this;
        var snakeHead = self.snakeModel.body[0];

        // if clash with border happens
        if (snakeHead.x > self.canvas.width - this.options.unitSize ||
            snakeHead.x < 0 ||
            snakeHead.y > self.canvas.height - this.options.unitSize ||
            snakeHead.y < 0) {
            return false;
        }

        // if clash with tail happens
        for (var i = self.snakeModel.body.length - 1; i > 0; i--) {
            if (self.snakeModel.body[i].x == self.snakeModel.body[0].x &&
                self.snakeModel.body[i].y == self.snakeModel.body[0].y) {
                return false;
            }
        }

        return true;
    },

    isRabbitCaught: function () {
        var rabbitPosition = this.getRabbitPosition();

        return (rabbitPosition.x == this.snakeModel.body[0].x &&
                rabbitPosition.y == this.snakeModel.body[0].y);
    },

    increaseSnake: function () {
        var snakeMax = this.snakeModel.body.length - 1;
        var newSegment;

        switch (true) {
            case this.snakeModel.body[snakeMax].x == this.snakeModel.body[snakeMax - 1].x &&
                this.snakeModel.body[snakeMax].y > this.snakeModel.body[snakeMax - 1].y:
                newSegment = {
                    x: this.snakeModel.body[snakeMax].x,
                    y: this.snakeModel.body[snakeMax].y + this.options.unitSize
                };
                break;
            case this.snakeModel.body[snakeMax].x == this.snakeModel.body[snakeMax - 1].x &&
                this.snakeModel.body[snakeMax].y < this.snakeModel.body[snakeMax - 1].y:
                    newSegment = {
                        x: this.snakeModel.body[snakeMax].x,
                        y: this.snakeModel.body[snakeMax].y - this.options.unitSize
                    };
                    break;
            case this.snakeModel.body[snakeMax].y == this.snakeModel.body[snakeMax - 1].y &&
                this.snakeModel.body[snakeMax].x > this.snakeModel.body[snakeMax - 1].x:
                    newSegment = {
                        x: this.snakeModel.body[snakeMax].x + this.options.unitSize,
                        y: this.snakeModel.body[snakeMax].y
                    };
                    break;
            default:
                    newSegment = {
                        x: this.snakeModel.body[snakeMax].x - this.options.unitSize,
                        y: this.snakeModel.body[snakeMax].y
                    };
        }

        this.snakeModel.body.push(newSegment);

        $(this.canvas).trigger('updateScore.SnakeGame', {name: this.options.snakeName, score: this.getScore()});
    },

    getScore: function () {
        return (this.snakeModel.body.length - this.initialSnakeLength) * this.options.scoreWeight;
    },

    drawSnake: function (isFirstDraw) {
        var self = this;
        var currentSnakePosition = self.getCapturedSnakePosition();

        if (!isFirstDraw) {
            self.turnSnake(self.snakeModel.turnTo);
        }

        if (!self.isSnakeAlive()) {
            $(self.canvas).trigger('snakeIsDead.SnakeGame', {name: self.options.snakeName, score: self.getScore()});
            alert(self.options.snakeName + ' is dead, baby. Game over.');
            clearInterval(self._intervalId);
            return;
        }

        self.eraseSnake(currentSnakePosition);

        self.ctx.fillStyle = self.options.snakeColor;

        $.each(self.snakeModel.body, function (i, item) {
            self.ctx.fillRect(item.x, item.y, self.options.unitSize, self.options.unitSize);
        });
    },

    getCapturedSnakePosition: function () {
        return this.snakeModel.body.slice();
    },

    eraseSnake: function (snakePosition) {
        var self = this;

        $.each(snakePosition, function (i, item) {
            self.ctx.clearRect(item.x, item.y, self.options.unitSize, self.options.unitSize);
        });
    },

    drawRabbit: function () {
        var position = this.setRabbitPosition();
        this.ctx.fillStyle = this.options.rabbitColor;
        this.ctx.fillRect(position.x, position.y, this.options.unitSize, this.options.unitSize);
    },

    setRabbitPosition: function () {
        var x = this.getRandomInt(0, (this.canvas.width - this.options.unitSize) / this.options.unitSize) * this.options.unitSize;
        var y = this.getRandomInt(0, (this.canvas.height - this.options.unitSize) / this.options.unitSize) * this.options.unitSize;

        var isPlaceTaken = _.find(this.snakeModel.body, function (item) {
            return item.x == x && item.y == y;
        });

        if (!isPlaceTaken) {
            this._rabbitPosition = {
                x: x,
                y: y
            };

            return this._rabbitPosition;
        }

        return this.setRabbitPosition();
    },

    getRabbitPosition: function () {
        return this._rabbitPosition;
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
$(function () {
    var canvas = document.getElementById('snake_canvas');
    var $scoreContainer = $('#score');
    var highScoreTmpl = $('#high_score_tmpl').html();
    var $highScoreContainer = $('#high_score');
    var $snakeNameContainer = $('#name');
    var snakeGame;

    $(canvas).on('updateScore.SnakeGame', function (e, data) {
        $scoreContainer.text(data.score);
    });

    $(canvas).on('snakeIsDead.SnakeGame', function (e, data) {
        scoresStorage.refreshScores(data);
    });

    $highScoreContainer.on('refreshScores.ScoresStorage', function (e, data) {
        var compiled = _.template(highScoreTmpl);
        $highScoreContainer.html(compiled(data));
    });

    if (canvas) {
        $.when(
            $.ajax({
                url: 'http://api.uinames.com/',
                dataType: 'jsonp',
                crossDomain: true,
                method: 'GET',
                data: {
                    amount: 1,
                    country: 'United States'
                }
            })
        )
        .then(function (result) {
                snakeGame = new SnakeGame(canvas, {snakeName: result[0].name});
                $snakeNameContainer.text(snakeGame.options.snakeName);
            },
            function () {
                snakeGame = new SnakeGame(canvas);
                $snakeNameContainer.text(snakeGame.options.snakeName);
            });

        var scoresStorage = new ScoresStorage($highScoreContainer);

    }
});
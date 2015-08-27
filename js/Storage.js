var ScoresStorage = function ($highScoreContainer, key) {
    this.key = key || 'highscore';
    this.$highScoreContainer = $highScoreContainer;

    if (localStorage.getItem(this.key) === null) {
        localStorage.setItem(this.key, JSON.stringify(this._defaultScoreTable));
    }

    this.storage = JSON.parse(localStorage.getItem(this.key));

    this.$highScoreContainer.trigger('refreshScores.ScoresStorage', {data: this.storage});

};

ScoresStorage.prototype = {
    constructor: ScoresStorage,

    _defaultScoreTable: [
        {name: '--', score: 0},
        {name: '--', score: 0},
        {name: '--', score: 0}
    ],

    refreshScores: function (candidate) {
        if (!this.isHighScore(candidate.score)) {
            return;
        }

        this.storage[this.storage.length - 1] = candidate;

        this.storage = _.sortBy(this.storage, function (item) {
            return 0 - item.score;
        });

        localStorage.setItem(this.key, JSON.stringify(this.storage));

        this.$highScoreContainer.trigger('refreshScores.ScoresStorage', {data: this.storage});
    },

    isHighScore: function (score) {
        return this.storage[this.storage.length - 1].score < score;
    }
};
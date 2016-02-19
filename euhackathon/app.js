var Game = function(view) {
    this.view = view;

    pubsub.subscribe("answer:drop", $.proxy(function(event) {
        this.handleAnswer(event);
    }), this);

    pubsub.subscribe("game:over", $.proxy(function(event) {
        this.reset();
    }), this);

    pubsub.subscribe("game:reset", $.proxy(function(event) {
        this.view.showQuestion(this.questions.next());
    }), this);
};

Game.prototype.start = function(view) {
    this.questions = new Questions(10);

    this.view.showQuestion(this.questions.next());
};

Game.prototype.reset = function() {
    this.questions.reset();

    this.view.reset();
};

Game.prototype.handleAnswer = function(event) {
    if (this.isAnswerCorrect(event)) {
        this.view.incrementScore();
    }

    this.view.resetHighlightedAreas();

    setTimeout($.proxy(function() {
        this.view.moveQuestionToList();

        if (this.questions.isLastQuestion()) {
            this.view.showGameOver();
        } else {
            this.view.showQuestion(this.questions.next());
        }
    }, this), 2000);
};

Game.prototype.isAnswerCorrect = function(event) {
    var selectedAnswer = event.data.target.id;
    return selectedAnswer === this.questions.currentAnswer();
};

var Questions = function(limit) {
    this.limit = limit;

    this.chooseQuestions();
};

Questions.prototype.chooseQuestions = function() {
    var questionsClone = JSON.parse(JSON.stringify(window.questions));

    this.questions = [];

    for (var i = 0; i < this.limit; i++) {

        var level = "hard";

        if (i < 4) {
            level = "easy"
        } else if (i < 8) {
            level = "medium";
        }

        var rand = Math.floor(Math.random()*questionsClone[level].length);
        this.questions[i] = questionsClone[level][rand];
        questionsClone[level].splice(rand, 1);
    }
};

Questions.prototype.currentAnswer = function() {
    return this.questions[this.number].answer;
};

Questions.prototype.next = function() {
    this.number = ++this.number || 0;
    return this.questions[this.number];
};

Questions.prototype.isLastQuestion = function() {
    return this.number + 1 === this.questions.length;
};

Questions.prototype.reset = function() {
    this.number = undefined;
    this.chooseQuestions();
};


$(function() {
    var view = new View();
    var game = new Game(view);
    game.start();
});

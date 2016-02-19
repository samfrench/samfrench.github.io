var View = function() {
    this.bindEvents();

    this.resetScore();
};

View.prototype.bindEvents = function() {
    interact("#item").draggable({
        onmove: function(event) {
            var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

        }
    });

    interact("path").dropzone({
        accept: "#item",

        ondragenter: function(event) {
            $(event.target).addClass("hover");
        },

        ondragleave: function(event) {
            $(event.target).removeClass("hover");
        },

        ondrop: function (event) {
            pubsub.publish("answer:drop", event);
            $(event.relatedTarget).addClass("hide");
        }
    });
};

View.prototype.resetScore = function() {
    this.score = 0;
    $("#score").text(0);
}

View.prototype.showQuestion = function(question) {
    var item = $("#item");

    if (question.type === "image") {
        item.html($("<div class=\"question\"><img src=" + question.src + " /><div class=\"info\">" + question.info + "</div></div>"));
    } else {
        item.html($("<div class=\"question\"><div class=\"quote\">" + question.text + "</div><div class=\"info\">" + question.info + "</div></div>"));
    }

    item.removeClass("hide");
    item.attr("data-x", 0);
    item.attr("data-y", 0);
    item[0].style.webkitTransform = item[0].style.transform = 'translate(0, 0)';

};

View.prototype.showGameOver = function() {
    $("#questions-list").prepend($("<div class=\"instruction\">Game over. <a href=\"#\" id=\"game-over\">Play again?</a></div>"));

    $("#game-over").click(function(event) {
        event.preventDefault();

        pubsub.publish("game:over", event);
    });
};

View.prototype.moveQuestionToList = function() {
    $("#questions-list").prepend($("#item").html());
};

View.prototype.clearQuestionsList = function() {
    $("#questions-list").empty();
};

View.prototype.incrementScore = function() {
    $("#score").text(++this.score);
};

View.prototype.resetHighlightedAreas = function() {
    $("path").removeClass("hover");
};

View.prototype.reset = function() {
    this.resetScore();

    this.clearQuestionsList();

    pubsub.publish("game:reset");
};



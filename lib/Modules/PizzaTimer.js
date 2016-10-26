var ms = require('ms');

function PizzaTimer() {
}

PizzaTimer.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('pizza', this.onCommand.bind(this));
};

PizzaTimer.prototype.onCommand = function(from, channel, command, message, isQuery) {

    if(isQuery) {
        return false;
    }

    var that = this;
    var minutes = parseInt(message, 10) || 15;
    var timeoutMs = ms(minutes + 'm');

    that.irc.answer(from, channel, "I won't forget it!");

    setTimeout(function() {
        that.irc.answer(from, channel, "Time is up!");
    }, timeoutMs);

    // TODO: send mqtt topic
    // TODO: Limit pizzatimers per user?
};

module.exports = PizzaTimer;
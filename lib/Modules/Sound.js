function Sound() {
}

Sound.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('s', this.onSound.bind(this));
    this.irc.onCommand('sound', this.onSound.bind(this));
};

Sound.prototype.onSound = function(from, channel, command, payload) {
    // TODO: Publish mqtt topic
    this.irc.answer(from, channel, 'Playing ' + payload.trim());
};

module.exports = Sound;
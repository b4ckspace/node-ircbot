
function Help() {
}

Help.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('help', this.onHelp.bind(this));
};

Help.prototype.onHelp = function(channel, nickname, command, payload) {
    this.irc.answer(channel, nickname, 'see https://github.com/b4ckspace/node-ircbot');
};

module.exports = Help;
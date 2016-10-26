var config = require('../configurations');

function Alarm() {

}

Alarm.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('alarm', this.onAlarm.bind(this));
};

Alarm.prototype.onAlarm = function(from, channel, command, payload) {
    // TODO: Publish mqtt topic
    this.irc.answer(from, channel, 'ALAAAARM');
};

module.exports = Alarm;
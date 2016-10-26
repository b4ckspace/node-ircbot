var config = require('../configurations');
var commons = require('../Utils/Common');
var request = require('request');

function SpaceStatus() {
    // TODO: Update topic (open/closed)
    // TODO: Add and remove voice
}

SpaceStatus.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('i', this.onInSpace.bind(this));
    this.irc.onCommand('inspace', this.onInSpace.bind(this));

    this.irc.onJoin(this.onJoin.bind(this));
};

SpaceStatus.prototype.onInSpace = function(channel, nickname) {
    var that = this;

    this.getPresentMembers(function(error, presentMembers) {

        if(error) {
            return that.irc.answer(channel, nickname, "Can't retrieve current Spacestatus!");
        }

        var members = presentMembers.map(function(memberName) {
            return commons.avoidHighlighting(memberName);
        }).join(', ');

        var message = presentMembers.length + ' members present: ' + members;
        that.irc.answer(channel, nickname, message.trim());
    });
};

SpaceStatus.prototype.getPresentMembers = function(callback) {
    request(config.spacestatus.url, function(error, response, body) {

        if(error) {
            return callback(error);
        }

        var json = JSON.parse(body);

        // TODO: Check if path exists etc.
        var presentMembers = json.sensors.people_now_present[0].names;
        return callback(null, presentMembers);
    });
};

SpaceStatus.prototype.onJoin = function(who) {

};

module.exports = SpaceStatus;
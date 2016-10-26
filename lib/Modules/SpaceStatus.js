var config = require('../configurations');
var commons = require('../Utils/Common');
var SpaceAPI = require('../Utils/SpaceAPI');

function SpaceStatus() {
    // TODO: Update topic (open/closed)
    // TODO: Add and remove voice
    var that = this;
    this.spaceApi = new SpaceAPI(config.spacestatus.url);

    setInterval(function() {
        that.spaceApi.update();
        that.updateTopic();
    }, config.spacestatus.interval);
}

SpaceStatus.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('i', this.onInSpace.bind(this));
    this.irc.onCommand('inspace', this.onInSpace.bind(this));

    this.irc.onJoin(this.onJoin.bind(this));
};

SpaceStatus.prototype.onInSpace = function(channel, nickname) {
    var that = this;

    this.spaceApi.getPresentMembers(function(error, presentMembers) {

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

SpaceStatus.prototype.updateTopic = function(isOpen) {

};

SpaceStatus.prototype.onJoin = function(who) {

};

module.exports = SpaceStatus;
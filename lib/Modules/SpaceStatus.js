var config = require('../configurations');
var commons = require('../Utils/Common');
var SpaceAPI = require('../Utils/SpaceAPI');

const MODE_OP = '@';
const MODE_VOICED = '+';

function SpaceStatus() {
    // TODO: Update topic (open/closed)
    // TODO: Add and remove voice
    var that = this;
    this.spaceApi = new SpaceAPI(config.spacestatus.url);

    setInterval(function() {
        that.spaceApi.update().then(function() {
            that.irc.requestTopic();
            that.irc.requestNames();
        });
    }, config.spacestatus.interval);
}

SpaceStatus.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('i', this.onInSpace.bind(this));
    this.irc.onCommand('inspace', this.onInSpace.bind(this));

    this.irc.onNames(this.onNames.bind(this));
};

SpaceStatus.prototype.onInSpace = function(channel, nickname) {
    var that = this;

    this.spaceApi.getPresentMembers(function(error, presentMembers) {

        if(error) {
            return that.irc.answer(channel, nickname, "Can't retrieve current Spacestatus!");
        }

        if(presentMembers.length == 0) {
            return that.irc.answer(channel, nickname, 'Backspace is empty');
        }

        var members = presentMembers.map(function(memberName) {
            return commons.avoidHighlighting(memberName);
        }).join(', ');

        var message = presentMembers.length + ' members present: ' + members;
        that.irc.answer(channel, nickname, message.trim());
    });
};

SpaceStatus.prototype.updateTopic = function(topic) {

};

SpaceStatus.prototype.onNames = function(nicknames) {

    if(nicknames[config.irc.nickname] !== MODE_OP) {
        // TODO: Logging
        return false;
    }

    var that = this;
    var filtered = Object.keys(nicknames).filter(function(nickname) {
        return (nicknames[nickname] == MODE_VOICED);
    });

    var voiced = that.getSanitizedNicknameMap(filtered);

    this.spaceApi.getPresentMembers(function(error, members) {
        var presentMembers = that.getSanitizedNicknameMap(members);

        Object.keys(presentMembers).forEach(function(nickname) {
            // Present member that doesn't currently have voice
            if(!voiced[nickname]) {
                that.irc.setVoice(presentMembers[nickname], true);
            }
        });

        Object.keys(voiced).forEach(function(nickname) {
            // There's a nickname which has voice, but isn't present anymore
            if(!presentMembers[nickname]) {
                that.irc.setVoice(voiced[nickname], false);
            }
        })
    });
};

SpaceStatus.prototype.getSanitizedNicknameMap = function(nicknames) {
    var map = {};

    nicknames.forEach(function(nickname) {
        var sanitizedNickname = commons.sanitizeNickname(nickname);
        map[sanitizedNickname] = nickname;
    });

    return map;
};

module.exports = SpaceStatus;
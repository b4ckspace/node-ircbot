var request = require('request');

function SpaceAPI(url) {
    this.url = url;
    this.spacestatus = null;
}

SpaceAPI.prototype.getPresentMembers = function(callback) {

    this.getSpacestatus()
        .then(function(json) {
            var presentMembers = [];
            if(json.sensors.people_now_present.length > 0) {
                presentMembers = json.sensors.people_now_present[0].names;
            }

            callback(null, presentMembers);
        });
};

SpaceAPI.prototype.isOpen = function(callback) {
    this.getSpacestatus()
        .then(function(json) {
            var open = (json.sensors.people_now_present[0].names.length > 0);
            callback(open);
        });
};

SpaceAPI.prototype.getSpacestatus = function() {
    var that = this;

    return new Promise(function(resolve, reject) {

        if(that.spacestatus) {
            return resolve(that.spacestatus);
        }

        return that.update().then(resolve, reject);
    });
};

SpaceAPI.prototype.update = function() {
    var that = this;

    return new Promise(function(resolve, reject) {

        request(that.url, function (error, response, body) {

            if (error) {
                return reject('Can\'t retrieve spacestatus');
            }

            var json = JSON.parse(body);
            if (!json) {
                return reject('Invalid json body');
            }

            that.spacestatus = json;
            return resolve(json);
        });
    });
};

module.exports = SpaceAPI;
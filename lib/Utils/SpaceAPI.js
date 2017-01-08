const request = require('request');

class SpaceAPI {

    constructor(url) {
        this.url = url;
        this.spacestatus = null;
    }

    getPresentMembers(callback) {
        this.getSpacestatus()
            .then((json) => {
                let presentMembers = [];
                if (json.sensors.people_now_present.length > 0) {
                    presentMembers = json.sensors.people_now_present[0].names;
                }

                callback(null, presentMembers);
            })
            .catch(callback);
    }

    getSpacestatus() {
        return new Promise((resolve, reject) => {

            if (this.spacestatus) {
                return resolve(this.spacestatus);
            }

            return this.update().then(resolve, reject);
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            request(this.url, (error, response, body) => {

                if (error) {
                    return reject('Can\'t retrieve spacestatus');
                }

                let json = '';
                try {
                    json = JSON.parse(body);
                } catch (e) {
                    return reject('Invalid json body');
                }

                this.spacestatus = json;
                return resolve(json);
            });
        });
    }
}

module.exports = SpaceAPI;
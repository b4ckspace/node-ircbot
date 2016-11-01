var config = require('../configurations');
var request = require('request');
var moment = require('moment');

function Redmine(karma) {
    this.karma = karma;
    this.lastUpdated = new Date();
}

Redmine.prototype.setup = function(irc) {
    var that = this;
    this.irc = irc;

    setInterval(function() {
        that.update().then(function(issues) {
            that.handleIssues(issues);
        });
    }, config.redmine.intervalMs);
};

Redmine.prototype.handleIssues = function (issues) {
    var that = this;

    issues.forEach(function(issue) {
        if(issue.assigned_to && issue.assigned_to.name) {
            var msg = [
                issue.assigned_to.name, 'completed ticket', '"' + issue.subject + '"',
                '<' + config.redmine.url + '/issues/' + issue.id + '>'
            ];

            that.karma.incrementKarma(config.assigned_to.name);
            that.irc.say(msg.join(' '));
        }
    });
};

Redmine.prototype.update = function() {

    var options = {
        url: config.redmine.url + '/projects/' + config.redmine.project + '/issues.json',
        auth: {
            user: config.redmine.username,
            password: config.redmine.password
        },
        qs: {
            closed_on: '>=' + this.lastUpdated.toISOString().slice(0, 10),
            status_id: 4,
            sort: 'closed_on:desc'
        }
    };

    return new Promise(function(resolve, reject) {

        request(options, function (error, response, body) {

            if(error) {
                return reject(error);
            }

            try {
                var result = JSON.parse(body);

                if(!result.issues) {
                    return reject('Can\'t find attribute issues');
                }

                that.lastUpdated = new Date();
                return resolve(result.issues);
            } catch (e) {
                return reject('Invalid JSON');
            }
        });
    });


};

module.exports = Redmine;
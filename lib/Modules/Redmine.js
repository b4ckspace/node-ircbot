var config = require('../configurations');
var request = require('request');

class Redmine {

    constructor(karma) {
        this.karma = karma;
        this.lastUpdated = new Date();
    }

    setup(irc) {
        this.irc = irc;

        setInterval(() => {
            this.update().then((issues) => {
                this.handleIssues(issues);
            });
        }, config.redmine.intervalMs);
    }

    handleIssues(issues) {
        issues.forEach((issue) => {
            if(issue.assigned_to && issue.assigned_to.name) {
                var msg = [
                    issue.assigned_to.name, 'completed ticket', '"' + issue.subject + '"',
                    '<' + config.redmine.url + '/issues/' + issue.id + '>'
                ];

                this.karma.incrementKarma(issue.assigned_to.name);
                this.irc.say(msg.join(' '));
            }
        });
    }

    update() {

        var options = {
            url: config.redmine.url + '/projects/' + config.redmine.project + '/issues.json',
            auth: {
                user: config.redmine.username,
                password: config.redmine.password
            },
            qs: {
                closed_on: '>=' + this.lastUpdated.toISOString().slice(0, 19) + 'Z',
                status_id: 4,
                sort: 'closed_on:desc'
            }
        };

        return new Promise((resolve, reject) => {

            request(options, (error, response, body) => {

                if (error) {
                    return reject(error);
                }

                try {
                    var result = JSON.parse(body);

                    if (!result.issues) {
                        return reject('Can\'t find attribute issues');
                    }

                    this.lastUpdated = new Date();
                    return resolve(result.issues);
                } catch (e) {
                    return reject('Invalid JSON');
                }
            });
        });
    }
}

module.exports = Redmine;
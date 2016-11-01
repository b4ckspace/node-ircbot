var config = require('./configurations');

var Irc = require('./Irc/Irc');
var mqtt = require('mqtt');
var mqttClient  = mqtt.connect('mqtt://' + config.mqtt.server);

var KarmaDatabase = require('./Utils/Karma');

var PizzaTimer = require('./Modules/PizzaTimer');
var SpaceStatus = require('./Modules/SpaceStatus');
var Karma = require('./Modules/Karma');
var Alarm = require('./Modules/Alarm');
var Sound = require('./Modules/Sound');
var Redmine = require('./Modules/Redmine');

var irc = new Irc();
var karmaDb = new KarmaDatabase(config.karma.database);

irc.addModule(new PizzaTimer(mqttClient));
irc.addModule(new SpaceStatus);
irc.addModule(new Karma(karmaDb));
irc.addModule(new Redmine(karmaDb));
irc.addModule(new Alarm(mqttClient));
irc.addModule(new Sound(mqttClient));
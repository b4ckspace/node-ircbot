var config = require('./configurations');

var Irc = require('./Irc/Irc');
var mqtt = require('mqtt');
var mqttClient  = mqtt.connect('mqtt://' + config.mqtt.server);

var PizzaTimer = require('./Modules/PizzaTimer');
var SpaceStatus = require('./Modules/SpaceStatus');
var Karma = require('./Modules/Karma');
var Alarm = require('./Modules/Alarm');
var Sound = require('./Modules/Sound');

var irc = new Irc();
irc.addModule(new PizzaTimer(mqttClient));
irc.addModule(new SpaceStatus);
irc.addModule(new Karma);
irc.addModule(new Alarm(mqttClient));
irc.addModule(new Sound(mqttClient));
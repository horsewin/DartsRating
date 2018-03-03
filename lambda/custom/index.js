'use strict';

/**
 * アレクサのSDKライブラリ
 */
const Alexa = require("alexa-sdk");

/**
 * メッセージ格納変数
 */
const MESSAGE = require("./message");

/**
 *
 * @param event
 * @param context
 */
exports.handler = function(event, context) {
    let alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//
let handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'SayHello': function () {
        this.response.speak('Hello World!')
                     .cardRenderer('hello world', 'hello world');
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.emit("AMAZON.CancelIntent");
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(MESSAGE.help.speechOutput)
            .listen(MESSAGE.help.repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(MESSAGE.session.end.speechOutput);
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak(MESSAGE.unhandled.speechOutput)
            .listen(MESSAGE.unhandled.repromptText);
        this.emit(":responseReady");
    }
};

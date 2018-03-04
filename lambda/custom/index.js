'use strict';

//------------------------------------------------------
// ライブラリ定義
//------------------------------------------------------
/**
 * Alexa開発に用いるSDKライブラリ
 */
let Alexa = require('alexa-sdk');

/**
 * 応答を組み立てるためのライブラリ
 */
let util = require('util');

//------------------------------------------------------
// 変数・定数定義
//------------------------------------------------------
/**
 * メッセージ格納変数
 */
const MESSAGE = require("./message");

/**
 * 状態定義クラス
 */
const state = require("../dataAssets/state.json");

/**
 * Alexaの処理定義
 * 各状態をハンドリングするハンドラーを追加する必要がある
 * @param event
 * @param context
 */
exports.handler = function(event, context) {
    let alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(
        NewSessionHandler,
        TypeHandler
    );
    alexa.execute();
};

//
let NewSessionHandler = {
    'LaunchRequest': function () {
        this.response.speak(MESSAGE.welcome.base + MESSAGE.welcome.speechOutput)
            .listen(MESSAGE.welcome.repromptText);
        // .cardRenderer('hello world', 'hello world');
        this.emit(':responseReady');
    },
    'TypeIntent': function () {
        this.response.speak('Hello World!')
            .cardRenderer('hello world', 'hello world');
        this.emit(':responseReady');
    },
    'TypeOnlyIntent': function () {
        this.emit('TypeIntent');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(MESSAGE.welcome.base + MESSAGE.help.speechOutput)
            .listen(MESSAGE.help.repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent' : function() {
        this.emit("AMAZON.CancelIntent");
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(MESSAGE.session.end.speechOutput);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak(MESSAGE.welcome.base + MESSAGE.welcome.unhandled.speechOutput)
            .listen(MESSAGE.welcome.repromptText);
        this.emit(":responseReady");
    }
};

let TypeHandler = Alexa.CreateStateHandler(state.TYPE_SELECT, {
    'TypeOnlyIntent': function () {
        this.emit("TypeIntent");
    },
    'TypeIntent': function () {
        this.response.speak('Hello World!')
            .cardRenderer('hello world', 'hello world');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(MESSAGE.help.speechOutput)
            .listen(MESSAGE.help.repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit("AMAZON.CancelIntent");
    },
    'AMAZON.CancelIntent' : function() {
        this.emit("AMAZON.CancelIntent");
    },
    'Unhandled' : function() {
        this.response.speak(MESSAGE.unhandled.speechOutput)
            .listen(MESSAGE.unhandled.repromptText);
        this.emit(":responseReady");
    }
});

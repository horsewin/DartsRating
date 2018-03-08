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
        const nameSlot = this.event.request.intent.slots.DartsType;

        if (Validator("DARTS_TYPE", nameSlot.value)) {
            this.response.speak(util.format(MESSAGE.action.type.speechOutput, nameSlot.value))
                .listen(MESSAGE.action.type.repromptText);
        } else {
            this.response.speak(util.format(MESSAGE.error.type.speechOutput, nameSlot.value))
                .listen(MESSAGE.error.type.repromptText);
        }
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
        this.emit("LaunchRequest");
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

const slotJson = require("../../models/ja-JP");
const Validator = (typeName, checkValue) => {
    let typeNameArray;
    for (let key in slotJson.interactionModel.languageModel.types[0]) {
        if (key === "name" && slotJson.interactionModel.languageModel.types[0][key] === typeName) {
            typeNameArray = slotJson.interactionModel.languageModel.types[0].values;
            break;
        }
    }

    if (!typeNameArray) return false;

    for (let i in typeNameArray) {
        if (typeNameArray[i].name.value === checkValue) {
            return true;
        }
    }

    return false;
}

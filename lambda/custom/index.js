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
        TypeHandler,
        GameHandler
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
        this.handle.state = state.TYPE_SELECT;
        this.emitWithState('TypeIntent');
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
    'TypeIntent': function () {
        const nameSlot = this.event.request.intent.slots.DartsType;

        // TODO シノニムを考慮したリクエストに対応させる
        // "slots": {
        //     "song": {
        //         "name": "song",
        //             "value": "single",
        //             "resolutions": {
        //             "resolutionsPerAuthority": [
        //                 {
        //                     "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.MEDIA_TYPE",
        //                     "status": {
        //                         "code": "ER_SUCCESS_MATCH"
        //                     },
        //                     "values": [
        //                         {
        //                             "value": {
        //                                 "name": "song",
        //                                 "id": "SONG"
        //                             }
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        if (Validator(0, "DARTS_TYPE", nameSlot.value)) {
            this.handle.state = state.GAME_SELECT;
            this.response.speak(util.format(MESSAGE.action.type.speechOutput, nameSlot.value))
                .listen(MESSAGE.action.type.repromptText);
        } else {
            this.response.speak(util.format(MESSAGE.error.type.speechOutput, nameSlot.value))
                .listen(MESSAGE.error.type.repromptText);
        }
        this.emit(':responseReady');
    },
    'TypeOnlyIntent': function () {
        this.emitWithState('TypeIntent');
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

let GameHandler = Alexa.CreateStateHandler(state.GAME_SELECT, {
    'GameIntent': function () {
        const nameSlot = this.event.request.intent.slots.GameType;

        if (Validator(1, "GAME_TYPE", nameSlot.value)) {
            this.handle.state = state.GAME_SELECT;
            this.response.speak(util.format(MESSAGE.action.type.speechOutput, nameSlot.value))
                .listen(MESSAGE.action.type.repromptText);
        } else {
            this.response.speak(util.format(MESSAGE.error.type.speechOutput, nameSlot.value))
                .listen(MESSAGE.error.type.repromptText);
        }
        this.emit(':responseReady');
    },
    'GameOnlyIntent': function () {
        this.emitWithState('GameIntent');
    },
    'SessionEndedRequest': function () {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(MESSAGE.help.speechOutput)
            .listen(MESSAGE.help.repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit("AMAZON.CancelIntent");
    },
    'AMAZON.CancelIntent': function () {
        this.emit("AMAZON.CancelIntent");
    },
    'Unhandled': function () {
        this.response.speak(MESSAGE.unhandled.speechOutput)
            .listen(MESSAGE.unhandled.repromptText);
        this.emit(":responseReady");
    }
});

const slotJson = require("../../models/ja-JP");
const Validator = (index, typeName, checkValue) => {
    let typeNameArray;
    for (let key in slotJson.interactionModel.languageModel.types[index]) {
        if (key === "name" && slotJson.interactionModel.languageModel.types[index][key] === typeName) {
            typeNameArray = slotJson.interactionModel.languageModel.types[index].values;
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

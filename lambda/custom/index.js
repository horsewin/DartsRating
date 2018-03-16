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
const state = require("./dataAssets/state.json");


const ER_SUCCESS_MATCH = "ER_SUCCESS_MATCH";
const ER_SUCCESS_NO_MATCH = "ER_SUCCESS_NO_MATCH";

/**
 * Alexaの処理定義
 * 各状態をハンドリングするハンドラーを追加する必要がある
 * @param event
 * @param context
 */
exports.handler = function(event, context) {
    // console.log(JSON.stringify(event, null, 2));
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
        this.handler.state = state.TYPE_SELECT;
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
        const value = nameSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        if (customValidator(nameSlot)) {
            this.handler.state = state.GAME_SELECT;
            this.response.speak(util.format(MESSAGE.action.type.speechOutput, value))
                .listen(MESSAGE.action.type.repromptText);
        } else {
            this.response.speak(util.format(MESSAGE.error.type.speechOutput, value))
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
        if (customValidator(nameSlot)) {
            const gameValue = nameSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;

            const statsSlot = this.event.request.intent.slots.Stats;
            if (Validator(statsSlot)) {
                let stats = null;

                // 小数点ありの入力かどうか確認する
                const decimalSlot = this.event.request.intent.slots.Float;
                if (customValidator(decimalSlot)) {
                    // 小数点ありの計算を処理
                    // 小数スロットに値はなくても整数で計算してあげる
                    const statsDecimalSlot = this.event.request.intent.slots.StatsSmall;
                    if (Validator(statsDecimalSlot)) {
                        const v = `${statsSlot.value}.${statsDecimalSlot.value}`;
                        stats = Number(v);
                    } else {
                        stats = Number(statsSlot.value);
                    }

                    // TODO レーティング計算
                    const rating = checkMyRating(stats);

                    this.response.speak(util.format(MESSAGE.action.game.speechOutput, gameValue, stats.toString(), rating))
                        .listen(MESSAGE.action.game.repromptText);
                } else {
                    stats = Number(statsSlot.value);

                    // TODO レーティング計算
                    const rating = checkMyRating(stats);
                    this.response.speak(util.format(MESSAGE.action.game.speechOutput, gameValue, stats.toString(), rating))
                        .listen(MESSAGE.action.game.repromptText);
                }
            } else {
                this.response.speak(util.format(MESSAGE.error.stats.speechOutput, gameValue))
                    .listen(MESSAGE.error.stats.repromptText);
            }
        } else {
            this.response.speak(util.format(MESSAGE.error.game.speechOutput, gameValue))
                .listen(MESSAGE.error.game.repromptText);
        }
        this.handler.state = state.GAME_SELECT;
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


/**
 *
 * @param slot
 * @returns {boolean}
 * @constructor
 */
const customValidator = (slot) => {
    return slot && slot.resolutions.resolutionsPerAuthority[0].status.code === ER_SUCCESS_MATCH;
}

/**
 *
 * @param slot
 * @returns {*|boolean}
 * @constructor
 */
const Validator = (slot) => {
    return slot && slot.value && slot.value !== "?";
}


const checkMyRating = (stats) => {
    return "8";
}
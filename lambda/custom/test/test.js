"use strict";

const conversation = require('alexa-conversation');
const target = require('../index.js'); // your Alexa skill's main file.
const appID = require("../../../.ask/config.json").deploy_settings.default.skill_id;

const opts = { // those will be used to generate the requests to your skill
    name: 'ダーツレーティング　単体テスト',
    appId: appID,
    // Either provide your app (app.handler must exist)...
    app: target,
    // Other optional parameters. See readme.md
    locale: 'ja-JP'
};

process.env.FEATURE_FLAG = "1";
process.env.APP_ID = appID;

conversation(opts)
    .userSays('LaunchRequest')
    .ssmlResponse
    .shouldEqual(
        "<speak> ダーツレーティングスキルへようこそ。ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .userSays('AMAZON.StopIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> もっとダーツをエンジョイしましょう！ </speak>"
    )
    .end();

conversation(opts)
    .userSays('AMAZON.CancelIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> もっとダーツをエンジョイしましょう！ </speak>"
    )
    .end();

conversation(opts)
    .userSays('Unhandled')
    .ssmlResponse
    .shouldEqual(
        "<speak> ダーツレーティングスキルへようこそ。ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .userSays('AMAZON.CancelIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> もっとダーツをエンジョイしましょう！ </speak>"
    )
    .end();

/**
 * 機種選択
 */
conversation(opts)
    .userSays('LaunchRequest')
    .ssmlResponse
    .shouldEqual(
        "<speak> ダーツレーティングスキルへようこそ。ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .userSays('TypeIntent', {DartsType: 'ライブ'})
    .ssmlResponse
    .shouldEqual(
        "<speak> 機種はライブですね。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .end();

conversation(opts)
    .userSays('LaunchRequest')
    .ssmlResponse
    .shouldEqual(
        "<speak> ダーツレーティングスキルへようこそ。ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .userSays('TypeIntent', {DartsType: 'フェニックス'})
    .ssmlResponse
    .shouldEqual(
        "<speak> 機種はフェニックスですね。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .end();
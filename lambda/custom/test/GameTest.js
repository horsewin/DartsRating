"use strict";

const conversation = require('alexa-conversation');
const target = require('../index.js'); // your Alexa skill's main file.
const appID = require("../../../.ask/config.json").deploy_settings.default.skill_id;

const opts = { // those will be used to generate the requests to your skill
    name: 'ダーツレーティング　単体テスト スタッツ',
    appId: appID,
    // Either provide your app (app.handler must exist)...
    app: target,
    // Other optional parameters. See readme.md
    locale: 'ja-JP'
};

process.env.FEATURE_FLAG = "1";
process.env.APP_ID = appID;

/**
 * スタッツ入力
 */
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
    .userSays('GameIntent', {GameType: 'ゼロワン', Stats: '18', Float: '点', StatsSmall: '15'})
    .ssmlResponse
    .shouldEqual(
        "<speak> フェニックスのゼロワンのスタッツが18.15ですね。レーティングは8です。他のレーティングも知りたい場合は、同様にゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'クリケット', Stats: '1', Float: '点', StatsSmall: '91'})
    .ssmlResponse
    .shouldEqual(
        "<speak> フェニックスのクリケットのスタッツが1.91ですね。レーティングは8です。他のレーティングも知りたい場合は、同様にゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'クリケット', Stats: '1'})
    .ssmlResponse
    .shouldEqual(
        "<speak> フェニックスのクリケットのスタッツが1ですね。レーティングは1です。他のレーティングも知りたい場合は、同様にゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'クリケット', Stats: '1', Float: '点'})
    .ssmlResponse
    .shouldEqual(
        "<speak> フェニックスのクリケットのスタッツが1ですね。レーティングは1です。他のレーティングも知りたい場合は、同様にゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'クリケット', Stats: '1', StatsSmall: '333'})
    .ssmlResponse
    .shouldEqual(
        "<speak> フェニックスのクリケットのスタッツが1ですね。レーティングは1です。他のレーティングも知りたい場合は、同様にゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('AMAZON.CancelIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> もっとダーツをエンジョイしましょう！ </speak>"
    )
    .end();

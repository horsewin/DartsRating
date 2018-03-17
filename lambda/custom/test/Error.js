"use strict";

const conversation = require('alexa-conversation');
const target = require('../index.js'); // your Alexa skill's main file.
const appID = require("../../../.ask/config.json").deploy_settings.default.skill_id;

const opts = { // those will be used to generate the requests to your skill
    name: 'ダーツレーティング　単体テスト エラー系',
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
    .userSays('TypeIntent', {DartsType: 'フェニックス'})
    .ssmlResponse
    .shouldEqual(
        "<speak> 機種はフェニックスですね。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'ゼロワン'})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンが選択されましたがスタッツを上手く聞き取れませんでした。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'ゼロワン', Float: '点'})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンが選択されましたがスタッツを上手く聞き取れませんでした。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'ゼロワン', Float: '点', StatsSmall: "33"})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンが選択されましたがスタッツを上手く聞き取れませんでした。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'ゼロワン', StatsSmall: "33"})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンが選択されましたがスタッツを上手く聞き取れませんでした。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {StatsSmall: "33"})
    .ssmlResponse
    .shouldEqual(
        "<speak> 私が知らないゲームではレーティングは計算できません。ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('Unhandled')
    .ssmlResponse
    .shouldEqual(
        "<speak> うまく聞き取れなかったのでもう一度お願いします。 </speak>",
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
    .userSays('Unhandled')
    .ssmlResponse
    .shouldEqual(
        "<speak> うまく聞き取れなかったのでもう一度お願いします。 </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
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
    .userSays('Unhandled')
    .ssmlResponse
    .shouldEqual(
        "<speak> うまく聞き取れなかったのでもう一度お願いします。 </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .end();
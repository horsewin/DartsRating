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
        "<speak> また話しかけてくださいね。 </speak>"
    )
    .end();

conversation(opts)
    .userSays('AMAZON.HelpIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> ダーツレーティングスキルへようこそ。ダーツレーティングスキルは、ライブかフェニックスのスタッツからレーティングを教えます。ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .userSays('AMAZON.StopIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> また話しかけてくださいね。 </speak>"
    )
    .end();

conversation(opts)
    .userSays('AMAZON.CancelIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> また話しかけてくださいね。 </speak>"
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
        "<speak> また話しかけてくださいね。 </speak>"
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

conversation(opts)
    .userSays('LaunchRequest')
    .ssmlResponse
    .shouldEqual(
        "<speak> ダーツレーティングスキルへようこそ。ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .userSays('TypeIntent', {DartsType: 'やほ'})
    .ssmlResponse
    .shouldEqual(
        "<speak> やほは対応外の機種です。ライブかフェニックスのどちらにしますか？ </speak>",
        "<speak> ライブ、フェニックスのどちらのレーティングを知りたいですか？ </speak>"
    )
    .end();

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
    .userSays('GameIntent', {GameType: 'ゼロワン', Stats: '18.15'})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンのスタッツが18.15ですね。レーティングは8です。他のレーティングも知りたいですか？ </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'クリケット', Stats: '1.91'})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンのスタッツが1.91ですね。レーティングは8です。他のレーティングも知りたいですか？ </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('AMAZON.CancelIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> また話しかけてくださいね。 </speak>"
    )
    .end();

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
    .userSays('GameIntent', {GameType: 'ゼロワン', Stats: '70.0'})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンのスタッツが70.0ですね。レーティングは8です。他のレーティングも知りたいですか？ </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('GameIntent', {GameType: 'クリケット', Stats: '2.5'})
    .ssmlResponse
    .shouldEqual(
        "<speak> ゼロワンのスタッツが2.5ですね。レーティングは8です。他のレーティングも知りたいですか？ </speak>",
        "<speak> ゼロワンまたはクリケットのスタッツを教えて下さい。 </speak>"
    )
    .userSays('AMAZON.CancelIntent')
    .ssmlResponse
    .shouldEqual(
        "<speak> また話しかけてくださいね。 </speak>"
    )
    .end();

// conversation(opts)
//     .userSays('MyVegetableIntent', {VegetableName: 'にんじん', SeasonName: ''})
//     .ssmlResponse
//     .shouldEqual(
//         "<speak> ベジチャットへようこそ。にんじんの旬は4月から7月、11月から12月です。湿気に弱いので冷蔵庫に丸のまま保存する際には新聞紙などで包みましょう。冬など寒い季節は新聞紙にくるんだり、箱のまま冷暗所においておいても大丈夫です。切った物は切り口から傷み始めるので、ぴったりとラップで包んで冷蔵庫に入れておき、3日-4日位で使い切るようにしましょう。。他にどの野菜について知りたいですか？ </speak>",
//         "<speak> 他にどの野菜について知りたいですか？ </speak>"
//     )
//     .userSays('MyVegetableIntent', {VegetableName: 'にんじん', SeasonName: '旬'})
//     .ssmlResponse
//     .shouldEqual(
//         "<speak> にんじんの旬は4月から7月、11月から12月です。。。他にどの野菜について知りたいですか？ </speak>",
//         "<speak> 他にどの野菜について知りたいですか？ </speak>"
//     )
//     .userSays('AMAZON.CancelIntent')
//     .ssmlResponse
//     .shouldEqual(
//         "<speak> また話しかけてくださいね。 </speak>"
//     )
//     .end();

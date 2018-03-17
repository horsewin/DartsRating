let event = require('../../UnitJson/GameIntent_nogame');

let context = {
    succeed: function (data) {
        console.log("========= Lambda Response ===========");
        console.log(JSON.stringify(data, ' ', 4));
        console.log("=====================================");
        return (JSON.stringify(data, ' ', 4));
    },
    fail: function (data) {
        console.log("fail!!\n" + JSON.stringify(data, ' ', 4));
    },
    invokedFunctionArn: 'test:development',
    functionName: 'test',
    functionVersion: '$LATEST'
};
let callback = function (str, json) {
    "use strict";

    console.log("********* Lambda Response *********");

    if (str && str !== null) {
        console.error(str);
    }

    if (json) {
        console.log(JSON.stringify(json, ' ', 4));
    }
    console.log("************************************");

};

function test() {
    "use strict";

    process.env.APP_ID = require("../../.ask/config.json").deploy_settings.default.skill_id;
    return new Promise(() => {
        let lambda = require('./index.js');
        lambda.handler(event, context, callback);
    });
}

process.on('unhandledRejection', function (error) {
    console.log('error: ' + error);
});
process.on('uncaughtException', function (error) {
    console.log('error: ' + error);
});

test();
module.exports.handler = test;
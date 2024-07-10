require('dotenv').config()
const { App } = require('@slack/bolt');
const sshpk = require('sshpk');
const { execFileSync } = require("node:child_process")
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

(async () => {
    async function createUserAccount({ name, username, sshkey, ack }) {
        /*
        You have two options to message the user:
        
        1. Show an "only you can see" message
         await client.chat.postEphemeral({
                        channel: process.env.BOREAL_CHANNEL,
                        user: body.user.id,
                        text: "your account has been created"
        });
        2. DM the user
          await client.chat.postMessage({
                        channel: body.user.id,
                        user: ,
                        text: "your account has been created"
        });
        */
    }
    app.view('register', async ({ ack, body, client, logger, view }) => {
        let values = view.state.values;
        let name, username, sshkey;

        for (let key in values) {
            for (let innerKey in values[key]) {
                if (innerKey === 'name') {
                    name = values[key][innerKey].value;
                } else if (innerKey === 'username') {
                    username = values[key][innerKey].value;
                } else if (innerKey === 'sshkey') {
                    sshkey = values[key][innerKey].value;
                }
            }
        }

        await createUserAccount({ name, username, sshkey, ack })


    })
    app.command('/boreal-register', async ({ ack, command, say, body }) => {
        await ack()
        if (body.channel_id !== process.env.BOREAL_CHANNEL) return respond("This can only be ran from the secret channel.")

        await app.client.views.open({
            trigger_id: body.trigger_id,
            view: require("./blocks/register.json")
        })
    })
    console.log('⚡️ Bolt app is running!');

    await app.start(process.env.PORT || 3000);

})();
const dotenv = require('dotenv')
dotenv.config()
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_KEY,
    apiKey: process.env.OPENAI_API_KEY
})
const openAi = new OpenAIApi(configuration)

bot.start((ctx) => ctx.reply('Welcome'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on(message("text"), (ctx) => {
    openAi.createChatCompletion({
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": ctx.message.text }],
        "temperature": 0
    }).then(async (response) => {
        await ctx.telegram.sendMessage(ctx.message.chat.id, `${response.data.choices[0].message.content}`);
    }).catch((err) => {
        console.log("err");
        ctx.reply("err")
    })
});

bot.launch();






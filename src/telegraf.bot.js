const config = require('./config/config.js');
const {Telegraf} = require('telegraf');

const bot = new Telegraf(config.telegram.apiKey)

async function communicateWithBot() {
    console.log('Bot started');
    bot.start(function (ctx) {
        console.log(ctx);
        return ctx.reply('Uptime monitor is active');
    });
    const message = 'Stats';
    bot.on('hi', function (ctx) {
        ctx.telegram.sendMessage(config.telegram.chatId, `Hello ${message}`)
    });
    await bot.launch();
}

communicateWithBot();



const config = require('./config/config.js');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(config.telegram.apiKey)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
const axios = require("axios");
const {LoggerService} = require("./logger.service");

class TelegramRepository {
    constructor(_apiKey, _chatId) {
        this.apiKey = _apiKey;
        this.chatId = _chatId;
        this.logger = new LoggerService('TelegramRepository');
    }

    async sendMessage(message) {
        this.logger.log('sendMessage', message);
        const url = `https://api.telegram.org/bot${this.apiKey}/sendMessage?chat_id=${this.chatId}&text=${message}`;
        return await axios.get(url);
    }
}

module.exports = {
    TelegramRepository
}
const axios = require("axios");
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('AvailableCheckerService');

class AvailableCheckerService {
    /**
     * Makes HTTP request to the given URL and returns true if the url is available and false if not
     * @param url
     * @returns {Promise<boolean>}
     */
    static async httpCheck(url) {
        // Download url and check status is 200
        try {
            const result = await axios.get(url);
            logger.log(url, 'OK', result.status);
            return (result.status >= 200) && (result.status <= 299);
        } catch (err) {
            logger.log(url, 'ERR', err.message);
            return false;
        }
    }
}

module.exports = {
    AvailableCheckerService
}



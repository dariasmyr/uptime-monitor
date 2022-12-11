const axios = require("axios");
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('AvailableCheckerService');

class AvailableCheckerService {
    /**
     * Makes HTTP request to the given URL and returns true if the url is available and false if not
     * @param url
     * @returns {Promise<{result: boolean, message: string}>}
     */
    static async isSiteAvailableViaHttp(url) {
        const executionStart = Date.now();
        // Download url and check status is 200-299
        try {
            const httpRes = await axios.get(url);
            const result = (httpRes.status >= 200) && (httpRes.status <= 299);
            const resolve = {
                result,
                message: `HTTP status ${httpRes.status}`
            }
            logger.debug(url, 'OK', resolve.message);
            return resolve;
        } catch (err) {
            logger.error(url, 'ERR', err.message);
            return {
                result: false,
                message: err.message.toString()
            }
        } finally {
            const executionEnd = Date.now();
            logger.debug(url, 'Execution time', executionEnd - executionStart, 'ms');
        }
    }
}

module.exports = {
    AvailableCheckerService
}



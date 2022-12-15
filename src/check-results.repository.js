class CheckResultsRepository {
    constructor() {
        this.httpCheckResults = new Map();
    }

    save(url, result, message) {
        this.httpCheckResults.set(url, {
            result,
            message
        });
    }

    getResultsAsJson() {
        const results = {};
        for (const [url, result] of this.httpCheckResults.entries()) {
            results[url] = result;
        }
        return results;
    }
}

module.exports = {
    CheckResultsRepository
}
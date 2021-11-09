const joi = require('joi');

const ChampionsValidation = {
    getChampions: async function (queryParams) {
        return joi.object({
            tags: joi.string(),
            name: joi.string()
        })
        .validate(queryParams);
    }
}

module.exports = ChampionsValidation;
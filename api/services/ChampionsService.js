const { query } = require("express");

class ChampionsService {
    constructor(championModel, championValidation) {
        this.championModel = championModel;
        this.championValidation = championValidation;
    }

    async getChampions(queryParams, headers) {
        logger.info({
            message: 'start-get-champions ' + JSON.stringify(queryParams),
            correaltionId: headers['x-knight-correlation-id'],
            tracePoint: 'START'
        });

        let results;

        const validation = await this.championValidation.getChampions(queryParams);
        


        if (!validation) {
            logger.info('Error');
        }

        const buildParams = queryParams => ({
            ...queryParams.name && { name: queryParams.name },
            ...queryParams.tags && { tags: { $all: queryParams.tags.split(',') } },
        })

        const params = buildParams(queryParams);

        try {
            results = await this.championModel.find(params);
        } catch (error) {
            throw error;
        }

        return results;
    }

    async postChampions(champions, headers) {
        try {
            await this.championModel.create(champions);
        } catch (error) {
            throw error;
        }

        return champions;
    }
}

module.exports = ChampionsService;
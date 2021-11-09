class ChampionsService {
    constructor(championModel, championValidation) {
        this.championModel = championModel;
        this.championValidation = championValidation;
    }

    async getChampions(queryParams) {
        let results;

        try {
            results = await this.championModel.find({});
        } catch (error) {
            throw error;
        }

        return results;
    }

    async postChampions(champions) {
        try {
            await this.championModel.create(champions);
        } catch (error) {
            throw error;
        }

        return champions;
    }
}

module.exports = ChampionsService;
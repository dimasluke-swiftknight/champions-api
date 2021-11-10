const Services = require('../services/index');
const Champion = require('../models/champion');

const ChampionsController = require('express').Router();

ChampionsController
    .get('/champions', async (req, res, next) => {
        const ChampionsService = new Services.ChampionsService(Champion, Services.ChampionsValidation);

        let result;

        try {
            result = await ChampionsService.getChampions(req.query, req.headers);
        } catch (error) {
            console.log('error-controller');
            next(error);
        }

        res.status(200).send(result);
    })
    .post('/champions', async (req, res, next) => {
        const ChampionsService = new Services.ChampionsService(Champion, Services.ChampionsValidation);

        const result = ChampionsService.postChampions(req.body);

        res.status(201).send(result);
    })

module.exports = ChampionsController;
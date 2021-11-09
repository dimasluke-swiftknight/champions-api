const mongoose = require('mongoose');

const ChampionSchema = require('./util/champion-schema');

module.exports = mongoose.model('v1_champions', ChampionSchema);
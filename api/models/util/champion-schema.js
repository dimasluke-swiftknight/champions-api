const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChampionInfoSchema = {
    attack: { type: String, default: null },
    defense: { type: String, default: null },
    magic: { type: String, default: null },
    difficulty: { type: String, default: null }
};

const ChampionImageSchema = {
    full: { type: String, default: null },
    sprite: { type: String, default: null },
    group: { type: String, default: null },
    x: { type: Number, default: null },
    y: { type: Number, default: null },
    w: { type: Number, default: null },
    h: { type: Number, default: null }
};

const ChampionStatsSchema = {
    hp: { type: Number, default: 0 },
    hpperlevel: { type: Number, default: 0 },
    mp: { type: Number, default: 0 },
    mpperlevel: { type: Number, default: 0 },
    movespeed: { type: Number, default: 0 },
    armor: { type: Number, default: 0 },
    armorperlevel: { type: Number, default: 0 },
    spellblock: { type: Number, default: 0 },
    spellblockperlevel: { type: Number, default: 0 },
    attackrange: { type: Number, default: 0 },
    hpregen: { type: Number, default: 0 },
    hpregenperlevel: { type: Number, default: 0 },
    mpregen: { type: Number, default: 0 },
    mpregenperlevel: { type: Number, default: 0 },
    crit: { type: Number, default: 0 },
    critperlevel: { type: Number, default: 0 },
    attackdamage: { type: Number, default: 0 },
    attackdamageperlevel: { type: Number, default: 0 },
    attackspeedperlevel: { type: Number, default: 0 },
    attackspeed: { type: Number, default: 0 }
};

const ChampionSchema = {
    version: { type: String, default: null },
    id: { type: String, default: null },
    key: { type: String, default: null },
    name: { type: String, default: null },
    title: { type: String, default: null },
    blurb: { type: String, default: null },
    info: ChampionInfoSchema,
    image: ChampionImageSchema,
    tags: [{
        type: String, default: null
    }],
    partype: { type: String, default: null },
    stats: ChampionStatsSchema
};

module.exports = new Schema(ChampionSchema);
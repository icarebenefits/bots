import { Mongo } from 'meteor/mongo';

class RFMScoreBoardCollection extends Mongo.Collection {

}

class RFMTopTenCollection extends Mongo.Collection {

}

// RFM collections
export const RFMScoreBoard = new RFMScoreBoardCollection('rfm_scoreboard');
export const RFMTopTen = new RFMTopTenCollection('rfm_topten');


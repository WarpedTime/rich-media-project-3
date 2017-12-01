const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let SlimeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SlimeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  id: {
    type: Number,
    required: true,
    min: 0,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

});

SlimeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

SlimeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return SlimeModel.find(search).select('name id').exec(callback);
};

SlimeModel = mongoose.model('Slime', SlimeSchema);

module.exports.SlimeModel = SlimeModel;
module.exports.SlimeSchema = SlimeSchema;

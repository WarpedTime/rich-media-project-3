const models = require('../models');
const SlimeData = require('../SlimeData.js');

const Slime = models.Slime;
const totalSlimes = SlimeData.Total();

const makerPage = (req, res) => {
  Slime.SlimeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), slimes: docs });
  });
};

const makeSlime = (req, res) => {

  const num = Math.floor(Math.random() * totalSlimes);
  const slimeData = {
    id: num,
    name: SlimeData.GetById(num).name,
    owner: req.session.account._id,
  };

  const newSlime = new Slime.SlimeModel(slimeData);

  const slimePromise = newSlime.save();

  slimePromise.then(() => res.json({ redirect: '/maker' }));

  slimePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slime already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return slimePromise;
};

const getSlimes = (request, response) => {
  const req = request;
  const res = response;

  return Slime.SlimeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.json({ slimes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeSlime;
module.exports.getSlimes = getSlimes;

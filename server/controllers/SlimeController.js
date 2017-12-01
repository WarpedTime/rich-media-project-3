const models = require('../models');

const Slime = models.Slime;
const slimeNum = 20;

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
  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWR! Name is required.' });
  }

  const slimeData = {
    name: req.body.name,
    id: Math.floor(Math.random() * slimeNum),
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

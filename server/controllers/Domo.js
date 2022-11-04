const models = require('../models');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'both name and age are required' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };
  console.log(domoData);
  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const makerPage = (req, res) => {
  Domo.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });

  // res.render('app');
};

module.exports = {
  makerPage,
  makeDomo,
};

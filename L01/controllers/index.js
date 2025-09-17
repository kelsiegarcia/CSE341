const name = (req, res, next) => {
  res.json('Rox Stone');
};

const returnAnotherName = (req, res, next) => {
  res.json('Ren Stone');
};

const returnYetAnotherName = (req, res, next) => {
  res.json('Roz Stone');
};

module.exports = { name, returnAnotherName, returnYetAnotherName };

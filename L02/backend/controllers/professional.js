const mongodb = require('../db/link');

// GET /professional  -> returns all docs from 'user'
const getData = async (req, res) => {
  try {
    const docs = await mongodb
      .getDb()                      // returns Db object
      .collection('user')
      .find({})
      .toArray();

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fetch_failed' });
  }
};

// POST /professional -> inserts one doc into 'user'
const createData = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()                      // returns Db object
      .collection('user')
      .insertOne(req.body);

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'insert_failed' });
    }
    res.status(201).json({ message: 'User created', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
};

module.exports = { getData, createData };
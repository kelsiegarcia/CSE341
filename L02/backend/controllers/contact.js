const mongodb = require('../db/link');
const { ObjectId } = require('bson');

// GET /contact - returns all docs from 'user'
const getData = async (req, res) => {
  try {
    const docs = await mongodb
      .getDb()                      // returns Db object
      .collection('contacts')
      .find({})
      .toArray();

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fetch_failed' });
  }
};

// POST /contact - inserts one doc into 'user'
const createData = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // require all fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ error: 'Missing fields, all fields are required.' });
    }

    const result = await mongodb
      .getDb()                      // returns Db object
      .collection('contacts')
      .insertOne({ firstName, lastName, email, favoriteColor, birthday });

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Insert failed' });
    }
    res.status(201).json({ _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /contact/:id - updates an existing contact (all fields required)
const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, favoriteColor, birthday } = req.body || {};

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const missing = [];
    if (!firstName) missing.push('firstName');
    if (!lastName) missing.push('lastName');
    if (!email) missing.push('email');
    if (!favoriteColor) missing.push('favoriteColor');
    if (!birthday) missing.push('birthday');
    if (missing.length) {
      return res.status(400).json({ error: 'Missing fields, all fields are required.', missing });
    }

    const db = mongodb.getDb(); // if your helper returns a client, use: dbLink.getDb().db()
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { firstName, lastName, email, favoriteColor, birthday } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Even if nothing changed, that's not an error for PUT
    return res.status(204).send();
  } catch (err) {
    console.error('[PUT /contacts/:id] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
// GET /contact/:id - returns a single contact by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const db = mongodb.getDb();
    const contact = await db
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error('[GET /contacts/:id] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// DELETE /contact/:id - deletes a contact by id
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const result = await mongodb
      .getDb()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Return 200 ok
    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getData, createData, updateData, getById, deleteData };
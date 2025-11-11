const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');

// GET /api/gifts - all gifts
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const gifts = await collection.find({}).toArray();
    return res.json(gifts);
  } catch (e) {
    console.error('Error fetching gifts:', e);
    return res.status(500).send('Error fetching gifts');
  }
});

// GET /api/gifts/:id - single gift
router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    const id = req.params.id; // e.g. "875"

    let gift = null;

    // 1) match string id from gifts.json
    gift = await collection.findOne({ id: id });

    // 2) if not found and numeric-looking, try numeric id
    if (!gift && !Number.isNaN(parseInt(id, 10))) {
      gift = await collection.findOne({ id: parseInt(id, 10) });
    }

    // 3) if still not found and valid ObjectId, try _id
    if (!gift && ObjectId.isValid(id)) {
      gift = await collection.findOne({ _id: new ObjectId(id) });
    }

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    return res.json(gift);
  } catch (e) {
    console.error('Error fetching gift:', e);
    return res.status(500).json({ error: 'Error fetching gift' });
  }
});

// POST /api/gifts - create new gift
router.post('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const result = await collection.insertOne(req.body);

    return res.status(201).json({
      _id: result.insertedId,
      ...req.body,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

// models
const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);

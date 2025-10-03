const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String },
    role: { type: String },
    interviewType: { type: String }, // e.g., Technical, HR
    questionsAsked: [{ type: String }],
    preparationTips: { type: String },
    personalInsights: { type: String },
    // Difficulty aligns with UI tags
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Medium-Hard'], required: false },
    // New fields to align with Post Card and form
    experience: { type: String }, // e.g., '0-1 years', '1-2 years'
    numberOfRounds: { type: Number },
    numberOfProblems: { type: Number },
    tags: [{ type: String }],
    createdByEmail: { type: String },
    createdByName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

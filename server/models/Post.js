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
    topicTags: [{ type: String }],
    rounds: [
      new mongoose.Schema(
        {
          title: { type: String },
          type: { type: String },
          difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: false },
          questions: [{ type: String }],
          notes: { type: String },
        },
        { _id: false }
      ),
    ],
    hiringType: { type: String, enum: ['On-Campus', 'Off-Campus'], required: false },
    interviewDate: { type: Date },
    resources: [{ type: String }],
    // Newly added fields for extended Add Post form
    statusVerdict: { type: String, enum: ['Selected', 'Rejected', 'Waitlisted'], required: false },
    yearBatch: { type: String },
    salary: { type: String }, // free-form e.g., '15 LPA' or '₹40,000/mo'
    salaryVisibility: { type: String, enum: ['Public', 'Private'], required: false },
    location: { type: String },
    cgpaCutoff: { type: Number },
    postAnonymously: { type: Boolean, default: false },
    createdByEmail: { type: String },
    createdByName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

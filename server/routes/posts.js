const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      role,
      interviewType,
      questionsAsked,
      preparationTips,
      personalInsights,
      difficulty,
      experience,
      numberOfRounds,
      numberOfProblems,
      tags,
      createdByEmail,
      createdByName,
    } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const post = await Post.create({
      title,
      description,
      company,
      role,
      interviewType,
      questionsAsked: Array.isArray(questionsAsked) ? questionsAsked : (questionsAsked ? [questionsAsked] : []),
      preparationTips,
      personalInsights,
      difficulty,
      experience,
      numberOfRounds,
      numberOfProblems,
      tags: Array.isArray(tags) ? tags : [],
      createdByEmail: req.user?.email || createdByEmail,
      createdByName: req.user?.name || createdByName,
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a post by id (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.createdByEmail && req.user?.email && post.createdByEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not allowed to edit this post' });
    }

    const allowed = [
      'title',
      'description',
      'company',
      'role',
      'interviewType',
      'questionsAsked',
      'preparationTips',
      'personalInsights',
      'difficulty',
      'experience',
      'numberOfRounds',
      'numberOfProblems',
      'tags',
    ];

    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }

    // Normalize arrays
    if (update.questionsAsked && !Array.isArray(update.questionsAsked)) {
      update.questionsAsked = [update.questionsAsked].filter(Boolean);
    }
    if (update.tags && !Array.isArray(update.tags)) {
      update.tags = [update.tags].filter(Boolean);
    }

    const updated = await Post.findByIdAndUpdate(id, update, { new: true });
    return res.json(updated);
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { createdByEmail } = req.query;
    const filter = createdByEmail ? { createdByEmail } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error('List posts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all saved posts for a user (must be before '/:id')
router.get('/saved', auth, async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ email: userEmail }).select('savedPosts');
    if (!user) return res.json([]);

    const ids = (user.savedPosts || [])
      .map((id) => String(id))
      .filter((id) => /^[a-fA-F0-9]{24}$/.test(id));

    if (!ids.length) return res.json([]);

    const posts = await Post.find({ _id: { $in: ids } }).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error('Get saved posts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single post by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    console.error('Get post by id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.createdByEmail && req.user?.email && post.createdByEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not allowed to delete this post' });
    }
    await Post.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Save a post to user's savedPosts
router.post('/save', auth, async (req, res) => {
  try {
    const { postId } = req.body;
    const userEmail = req.user?.email;
    if (!userEmail || !postId) return res.status(400).json({ message: 'userEmail and postId are required' });
    const is24Hex = typeof postId === 'string' && /^[a-fA-F0-9]{24}$/.test(postId);
    if (!is24Hex) return res.status(400).json({ message: 'Invalid postId' });

    // Ensure post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Upsert user and add postId to savedPosts without duplicates
    await User.findOneAndUpdate(
      { email: userEmail },
      { $addToSet: { savedPosts: postId } },
      { upsert: true }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Save post error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Dev-only: Cleanup invalid savedPosts entries across all users
router.post('/cleanup-saved', async (req, res) => {
  try {
    const allow = process.env.ALLOW_MAINTENANCE === 'true' || process.env.NODE_ENV !== 'production';
    if (!allow) return res.status(403).json({ message: 'Maintenance route disabled' });

    const users = await User.find({}).select('_id savedPosts');
    let usersUpdated = 0;
    let entriesRemoved = 0;

    for (const u of users) {
      const raw = (u.savedPosts || []).map((id) => String(id));
      const validHex = raw.filter((id) => /^[a-fA-F0-9]{24}$/.test(id));
      if (!validHex.length) {
        if (raw.length) {
          // All invalid -> clear
          u.savedPosts = [];
          await u.save();
          usersUpdated += 1;
          entriesRemoved += raw.length;
        }
        continue;
      }

      const existingDocs = await Post.find({ _id: { $in: validHex } }).select('_id');
      const existingSet = new Set(existingDocs.map((d) => String(d._id)));
      const cleaned = validHex.filter((id) => existingSet.has(id));
      const toRemove = raw.length - cleaned.length;
      if (toRemove > 0 || cleaned.length !== raw.length) {
        u.savedPosts = cleaned;
        await u.save();
        usersUpdated += 1;
        entriesRemoved += toRemove;
      }
    }

    return res.json({ ok: true, usersUpdated, entriesRemoved });
  } catch (err) {
    console.error('Cleanup saved posts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

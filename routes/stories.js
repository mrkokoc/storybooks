const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load model
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories Index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
            .populate('user')
            .then(stories => {
                res.render('stories/index', {
                    stories: stories
                });
            });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Process add Story
router.post('/', (req, res) => {
    // console.log(req.body);
    let allowComments;

    allowComments = !!req.body.allowComments;
    // if (req.body.allowComments) {
    //     allowComments = true;
    // } else {
    //     allowComments = false;
    // }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    };

    // Create Story
    new Story(newStory)
            .save()
            .then(story => {
                res.redirect(`/stories/show/${story.id}`)
            })

});

module.exports = router;
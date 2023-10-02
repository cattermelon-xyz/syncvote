const express = require('express');
const router = express.Router();
const CurrentVoteDataController = require('../controllers/CurrentVoteDataController');

router.post(
  '/create',
  CurrentVoteDataController.createCurrentVoteData
);

module.exports = router;

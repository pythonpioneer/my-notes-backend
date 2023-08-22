const express = require('express');
const router = express.Router();

// managing all routes
router.get('/', (req, res) => {
    res.json([]);
});

module.exports = router;
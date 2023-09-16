const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");

router.post("/prompt", openaiController.prompt);

module.exports = router;

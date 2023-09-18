const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");
const multer = require("multer");
const upload = multer({ dest: "Files/" });

router.post("/prompt", openaiController.prompt);
router.post("/analys-employee", upload.any(), openaiController.analysEmployee);
router.post("/analys-project", upload.any(), openaiController.analysProject);
router.post("/analys-project-specifi-employee", openaiController.analysProjectSpecifiEmployees);

module.exports = router;

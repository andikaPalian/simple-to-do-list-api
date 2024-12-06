const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addTask, getAllTask, getSingleTask, updateTask, deleteTask } = require("../controllers/task.controllers");
const router = express.Router();

router.use(authMiddleware);
router.post("/add-task", addTask);
router.get("/get-all-task", getAllTask);
router.get("/get-single-task/:id", getSingleTask);
router.put("/update-task/:id", updateTask);
router.delete("/delete-task/:id", deleteTask);

module.exports = router;
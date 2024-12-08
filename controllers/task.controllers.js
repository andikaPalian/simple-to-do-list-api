const mongoose = require("mongoose");
const Task = require("../models/task.models");

// ADD TASK
const addTask = async (req, res) => {
    try {
        const {title, description, deadline, status, priority} = req.body;
        if (!title || !description || !deadline || !status || !priority) {
            return res.status(400).json({message: "Please provide all required fields"});
        };
        const validStatus = ["pending", "in-progress", "completed"];
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({message: `Invalid status. Allowed status are : ${validStatus.join(", ")}`});
        };
        const validPriorities = ["low", "medium", "high"];
        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({message: `Invalid priority. Allowed priority are : ${validPriorities.join(", ")}`});
        };
        const task = new Task({title, description, deadline, status, priority, user_id: req.user.id});
        await task.save();
        res.status(200).json({message: "Task added successfully", task});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", server});
    };
};

// GET ALL TASK
const getAllTask = async (req, res) => {
    try {
        const {status, priority} = req.query;
        const filters = {user_id: req.user.id};
        // Filter berdasarkan statusnya
        if (status) {
            filters.status = status;
        };
        // Filter berdasarkan prioritynya
        if (priority) {
            filters.priority = priority;
        };
        const task = await Task.find(filters);
        if (!task) {
            return res.status(404).json({message: "Task Not Found"});
        };
        res.status(200).json({task});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", error});
    };
};

// GET SINGLE TASK
const getSingleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message: "Task Not Found"});
        };
        res.status(200).json({task});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", error});
    };
};

// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid task id"});
        };
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message: "Task Not Found"});
        };
        if (task.user_id.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to update this task"});
        };
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({message: "Task updated successfully", updatedTask});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", error});
    };
};

// DELET TASK
const deleteTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid task id"});
        };
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({message: "Task Not Found"});
        };
        if (task.user_id.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to delete this task"});
        };
        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", error});
    };
};

module.exports = {addTask, getAllTask, getSingleTask, updateTask, deleteTask};
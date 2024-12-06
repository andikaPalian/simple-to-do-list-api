const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    isComplete: {type: Boolean, default: false},
    deadline: {type: Date},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps:  true,
});

module.exports = mongoose.model("Task", taskSchema);
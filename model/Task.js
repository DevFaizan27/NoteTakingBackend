import mongoose from "mongoose";


const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'To Do',
            enum: ['To Do', 'In Progress', 'Done'],
        },
        priority: {
            type: String,
            required: true,
            enum: ['Low', 'Medium', 'High'],
        },
        assignedTo: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        board: {
            type: mongoose.Schema.ObjectId,
            ref: "Board",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);



export const Task = mongoose.model("Task", taskSchema);

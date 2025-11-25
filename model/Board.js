import mongoose from "mongoose";


const boardSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
  },
  { timestamps: true }
);



export const Board = mongoose.model("Board", boardSchema);

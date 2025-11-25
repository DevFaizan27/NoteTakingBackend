import express from 'express';
import { Board } from '../model/Board.js';

const router=express.Router();



router.post('/create-board',async(req,res)=>{
    try {
        const {name}=req.body;

        console.log(req.body)

        if(!name){
            return res.status(400).json({error:"Board name is required"});
        }


        const board =new Board({name});
        await board.save();

        res.status(201).json({message:"Board created successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:"Server Error"});
    }
})


router.get('/get-boards',async(req,res)=>{
    try {
        
        const boards=await Board.find().sort({createdAt:-1});  


        if(boards.length===0){
            return res.status(404).json({error:"No boards found"});
        }

        res.status(200).json({boards});
    } catch (error) {   
        console.log(error.message);
        return res.status(500).json({error:"Server Error"});
    }
})


export default router;
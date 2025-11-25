import { connect } from "mongoose";
import 'dotenv/config';

const connectToMongo=async()=>{
    try {
        await connect(process.env.MONGO_URI);
        console.log("---***Database Connected Successfully***---")
    } catch (error) {
        console.log(error.message);
    }
}


export default connectToMongo;

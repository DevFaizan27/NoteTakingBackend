import connectToMongo from './database/db.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import board from './routes/board.js';
import task from './routes/task.js';


connectToMongo();
const app = express();
const port = 4000;


const corsOptions = {
    origin: true, // Allow all origins temporarily for testing
    origin: ["http://localhost:5173","https://task-script-guru-frontend.vercel.app"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Server Working Fine')
});


app.use('/api/v1/board', board);

app.use('/api/v1/task', task);





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

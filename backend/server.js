import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js';

// Initialize dotenv to use env variables : 
dotenv.config();
connectDB();

// Create an express application : ->
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.get('/api', (req, res) => {
    res.json({message: "Welcome to insta clone api!"});
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`App listening on the port : ${PORT}`);
});
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DB connected successfully...`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit(1);
    }
}
export default connectDB;
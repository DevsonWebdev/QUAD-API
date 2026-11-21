const mongoose = require('mongoose');
// MONGDB  LOCAL SERVER
const connectLocalDB = async () => {
  try {
      const uri = "mongodb://localhost:27017/";
    await mongoose.connect(uri);
    console.info(`MongoDB Connected locally`);
  } catch (error) {
    console.error(`Error connecting to DB locally: ${error.message}`);
    process.exit(1);
  }
};
// ATLAS
const connectDB = async () => {
  try {
    // Mongoose strictQuery setting for future-proofing queries
    mongoose.set('strictQuery', true);
    const connectionURI =process.env.MONGO_URI;
    const conn = await mongoose.connect(connectionURI, {});

    console.info(`MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners for monitoring
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure if initial connection fails
  process.env.NODE_ENV === "development"?null: process.exit(1);
  }
};

module.exports ={connectLocalDB, connectDB};

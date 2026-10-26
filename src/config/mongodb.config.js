const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose strictQuery setting for future-proofing queries
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Note: useNewUrlParser and useUnifiedTopology are deprecated in newer Mongoose versions
      // as they are now enabled by default, but keeping options clean is key.
    });

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
    process.exit(1);
  }
};

module.exports = connectDB;

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const dotenv = require("dotenv")
dotenv.config();

async function startServer() {
  try {
    server.listen(5000, () =>
      console.log("💻💻💻 server running 🏃‍♂️🏃‍♂️🏃‍♂️ on port 5000... ✔✔✔"),
    );
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}
//Catch Synchronous Uncaught Exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

startServer()

//Catch Asynchronous Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  // Graceful shutdown: Stop accepting new requests, finish existing ones, then exit
  server.close(() => {
    process.exit(1);
  });
});

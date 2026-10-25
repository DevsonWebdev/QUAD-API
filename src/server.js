const http = require("http");
const app = require("./app");
const server = http.createServer(app);

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

startServer()

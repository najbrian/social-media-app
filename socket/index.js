import { Server } from "socket.io";

// connection to frontend server
const io = new Server({ cors: "http://localhost:5173" });

io.on("connection", (socket) => {
  console.log("new connection: ", socket.id);

  //listen to a connection
  
});

io.listen(5000);
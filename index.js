const express = require('express');
var http = require('http');
const cors = require('cors');
const e = require('express');
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require('socket.io')(server,
    {
    
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

//middleware
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
    console.log("User connected");

    // socket.on("send_message", (data) => {
    //     console.log(data);
    //     io.emit("receive_message", data);
    // });
}
);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);
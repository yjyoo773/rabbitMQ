const express = require('express');
const amqp = require('amqplib');
const app = express();
const PORT = process.env.PORT || 3000;

let channel, connection;

app.use(express.json());
connectQueue();
app.get("/send-msg", (req, res) => {

    const data = {
        title: "Queue Message",
        description: "First message"
    }

    sendData(data)
    console.log("A message is sent to queue")
    res.send("Message Sent");
})

app.listen(PORT, () => console.log(`Server on ${PORT}`));


async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();

        await channel.assertQueue("test-queue");
    } catch (err) {
        console.log(err)
    }
}

async function sendData(data) {
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));

    await channel.close();
    await connection.close();
}



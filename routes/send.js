var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var bodyParser = require('body-parser');
var  { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

var connectionString = "Endpoint=sb://aafsh-service-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=29O65w6C8QSLUT3LIEWOghyCjePEbFZCeo5TWaW6eP8="
var queueName = "myqueue"
var errors = "";
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, (req, res) => {
    var msg = req.body.msg;
    var doc = String(msg);
    var arr = doc.split(",");
    sendToBus(arr);
    console.log('Got doc:', doc);
    var msgSent = "You added the entry/entries: " + arr;
    res.render("serviceBusSend", { output: msgSent });
});

async function sendToBus(x) {
    var messages = [
        { body: "Albert Einstein" },
        { body: "Werner Heisenberg" },
        { body: "Marie Curie" },
        { body: "Steven Hawking" },
        { body: "Isaac Newton" },
        { body: "Niels Bohr" },
        { body: "Michael Faraday" },
        { body: "Galileo Galilei" },
        { body: "Johannes Kepler" },
        { body: "Nikolaus Kopernikus" }
     ];
    var sbClient = new ServiceBusClient(connectionString);
    var sender = sbClient.createSender(queueName);

    try {
		let batch = await sender.createMessageBatch(); 
		for (let i = 0; i < messages.length; i++) {
			if (!batch.tryAddMessage(messages[i])) {			
				await sender.sendMessages(batch);
				batch = await sender.createMessageBatch();
				if (!batch.tryAddMessage(messages[i])) {
                    errors = "Message too big to fit in a batch!";
					throw new Error("Message too big to fit in a batch");
				}
			}
		}

		await sender.sendMessages(batch);

		console.log(`Sent a batch of messages to the queue: ${queueName}`);
		await sender.close();
	} finally {
		await sbClient.close();
	}
};

module.exports = router;
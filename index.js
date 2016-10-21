const amqp = require('amqplib/callback_api');
const sequelize = require('sequelize');

amqp.connect('amqp://admin:admin@rabbit.io:5672', (err, conn) => {
	if (err) console.log(err);
	conn.createChannel((err, ch) => {
		if (err) console.log(err);
		var q = 'pgtasks';
		ch.assertQueue(q, {durable: true});
		ch.prefetch(1);
		console.log('Waiting for message in %s ...', q);
		ch.consume(q, (msg) => {
			console.log('Message received :');	
			console.log(msg.content.toString());
			ch.ack(msg);
		}, {noAck: false});
	});
});

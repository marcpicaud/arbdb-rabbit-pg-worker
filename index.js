// cf. https://www.npmjs.com/package/amqplib
const amqp = require('amqplib/callback_api');

// cf. https://www.npmjs.com/package/sequelize
const sequelize = require('sequelize');

amqp.connect('amqp://admin:admin@rabbit.io:5672', (err, conn) => {
    if (err) {
      console.error('Cannot connect to the rabbit');
      throw err;
    }

    conn.createChannel((err, ch) => {
      if (err) {
        // May fail if there are no more channels available (i.e., if there are already channelMax channels open).
        console.error('Cannot create a channel on the rabbit');
        throw err;
      }

      // The queue
      const queue = 'pgtasks';

      // Durable: the queue will survive broker restarts
      ch.assertQueue(queue, {durable: true});

      // Maximum number of messages sent over the channel that can be awaiting acknowledgement
      ch.prefetch(1);

      // Set up a consumer with a callback to be invocked for each message
      ch.consume(
          queue,
          (msg) => {
            console.log('***Message received: ***');
            console.log(msg.content.toString());

            // Acknowledge the given msg. The rabbit won't forget until then as we provided
            // {noAck: false} as an option argument
            ch.ack(msg);
          },
          {noAck: false});
    });
});

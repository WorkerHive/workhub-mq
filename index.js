import amqplib from 'amqplib';

export default async (opts) => {
  let MQ_URL = opts.host;
  
  let conn = await amqplib.connect(MQ_URL)
  let channel = await conn.createChannel()

  return {
    queue: async (queueName, job) => {
      await channel.assertQueue(queueName)
      return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)))
    },
    watch: async (queueName, watchFn) => {
      await channel.assertQueue(queueName)
      return channel.consume(queueName, (msg) => {
        if(msg !== null){
          console.log(msg.content.toString())
          try{
            watchFn(JSON.parse(msg.content.toString()))
          }catch(e){
            console.log(e, msg.content.toString())
          }
        }
      })
    }
  }
}


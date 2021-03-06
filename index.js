import amqplib from 'amqplib';

export default async (opts) => {
  let url = `amqp://${opts.user}:${opts.pass}@${opts.host}`
  let conn = await amqplib.connect(url)
  let channel = await conn.createChannel()

  return {
    host: opts.host,
    user: opts.user,
    pass: opts.pass,
    url: url,
    getQueuePressure: async (queueName) => {
      let queue = await channel.assertQueue(queueName)
      return queue
    },
    queue: async (queueName, job) => {
      let queue = await channel.assertQueue(queueName)
      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)))
      return queue
    },
    watch: async (queueName, watchFn, proccessedFn) => {
      await channel.assertQueue(queueName)
      return channel.consume(queueName, async (msg) => {
        if(msg !== null){
          console.log(msg.content.toString())
          try{
            let queue = await channel.assertQueue(queueName)
            let result = await watchFn(JSON.parse(msg.content.toString()), queue)
            if(result){ 
              await channel.ack(msg)
              proccessedFn(null, queue)
            }
            if(!result){
              await channel.nack(msg)
              proccessedFn("Wasn't accepted")
            }
          }catch(e){
            await channel.nack(msg)
            proccessedFn(msg.content.toString())
            console.log(e, msg.content.toString())
          }
        }
      })
    }
  }
}


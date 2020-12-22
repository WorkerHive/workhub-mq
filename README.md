# Workhub Message Queue

Message queue library for workhub

## Functions

- Add message to queue
- Watch queue for job result items
- Get pressure on queue


```
MQ.getQueuePressure('queue').then(pressure => {
    pressure.messageCount 
    pressure.consumerCount
})

MQ.queue('queue', {job_id: id, data: {}})

MQ.watch('queue', (job_result, queue_pressure) => {

})
```

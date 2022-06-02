const job = require('./service')

async function runJob() {
  const today = new Date()
  const hour = today.getHours()

  console.log('Actual hour', hour)

  if (hour > 7 && hour < 23) {
    console.log(`Service started at ${new Date()}`)
    //TODO: check if service already was executed
    await job()
      .then(r => {
        console.log(`Process executed successfully at ${new Date()}`)
        console.log(r.data)
      })
      .catch((err) => {
        console.log(`Process executed without success ${new Date()}`)
        console.error(err)
      })

      console.log(`Job finished at ${new Date()}`)
  }

  console.log(`Service finished at ${new Date()}`)
}

//runJob()
setInterval(runJob, 1000 * 60 * 60)
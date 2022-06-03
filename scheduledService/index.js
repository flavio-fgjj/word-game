const job = require('./service')

let timesPerDay = 1
async function runJob() {
  const today = new Date()
  const hour = today.getHours()

  console.log('Actual hour', hour)
  console.log(`Service started at ${new Date()}`)

  if ((hour > 7 && hour < 23) && timesPerDay < 4) {
    //TODO: check if service was already executed
    await job()
      .then(r => {
        console.log(`Process number (${timesPerDay}) executed successfully at ${new Date()}`)
        console.log(r.data)
      })
      .catch((err) => {
        console.log(`Process number (${timesPerDay}) executed without success ${new Date()}`)
        console.error(err)
      })

      if (timesPerDay < 4) {
        timesPerDay++
        console.log(`Job finished at ${new Date()}`)
      }
  }

  console.log(`Service finished at ${new Date()}`)
}

runJob()
console.log(`Process number (${timesPerDay}) executed successfully at ${new Date()}`)

setInterval(runJob, 1000 * 60 * 60)
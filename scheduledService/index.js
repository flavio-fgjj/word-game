const { job, saveForNextDay } = require('./service')

let timesPerDay = 1
async function runJob() {
  const today = new Date()
  const hour = today.getHours()

  console.log('Actual hour', hour)
  
  if ((hour >= 18 && hour < 23) && timesPerDay < 4) {
    console.log(`Service started at ${new Date()}`)

    //TODO: check if service was already executed (send email)
    await job()
      .then(r => {
        console.log(`Process number for job (${timesPerDay}) executed successfully at ${new Date()}`)
        console.log(r.data)
      })
      .catch((err) => {
        console.log(`Process number for job (${timesPerDay}) executed without success ${new Date()}`)
        console.error(err)
      })

      if (timesPerDay < 4) {
        timesPerDay++
        console.log(`Service Job ${timesPerDay} finished at ${new Date()}`)
      }
  }

  if (hour > 21 && hour <= 23) {
    console.log(`Service 'saveForNextDay' started at ${new Date()}`)
    await saveForNextDay()

    console.log(`Service finished at ${new Date()}`)
  }
  
}

runJob()
console.log(`Process number (${timesPerDay}) executed successfully at ${new Date()}`)

setInterval(runJob, 1000 * 60 * 60) // run job every one hour
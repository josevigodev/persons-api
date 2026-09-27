const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://josevigodev_db_user:${password}@firstdatabase.5kyklev.mongodb.net/personsApp?retryWrites=true&w=majority&appName=FirstDatabase`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (!process.argv[3] || !process.argv[4]) {
  Person.find({}).then((result) => {
    console.log('phonebook')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
  return
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then((result) => {
  console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
  mongoose.connection.close()
})

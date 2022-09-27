const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.s4ehzoa.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// schema defines a structure
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

// model Person created based on the schema of personSchema
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      return person.save()
    })
    .then((person) => {
      console.log(`Added ${person.name} as ${person.number} to phonebook!`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  mongoose
    .connect(url)
    .then((result) => {
      Person.find({})
      .then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        return mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
}
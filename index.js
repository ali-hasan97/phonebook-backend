require('dotenv').config()
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

// allows Express to show static content. Checks build folder first
app.use(express.static('build'))

// Grants access to data from external requests
app.use(cors())

// JSON parser middleware
app.use(express.json())

const Person = require('./models/person')
const { findByIdAndRemove } = require('./models/person')

// let persons = [
//     { 
//         id: 1,
//         name: "Arto Hellas", 
//         number: "040-123456"
//     },
//     { 
//         id: 2,
//         name: "Ada Lovelace", 
//         number: "39-44-5323523"
//     },
//     { 
//         id: 3,
//         name: "Dan Abramov", 
//         number: "12-43-234345"
//     },
//     { 
//         id: 4,
//         name: "Mary Poppendieck", 
//         number: "39-23-6423122"
//     }
// ]

morgan.token('requestParams', req => JSON.stringify(req.body));
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms :requestParams';
app.use(morgan(morganFormat));

app.get('/', (request, response) => {
    response.send('HOME')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.countDocuments({}, function( err, count) {
        response.send(
            `Phonebook has info for ${count} people <br/>
            ${date}`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
    return maxId + 1
}

const searchName = name => {
    const person = persons.find(person => person.name === name)
    return person
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'name or number missing'
        })
    }
    // const existingPerson = searchName(body.name)
    // if (existingPerson) {
    //     return response.status(404).json({
    //         error: 'duplicate person'
    //     })
    // }
    const person = new Person ({
        id: generateId(),
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
})
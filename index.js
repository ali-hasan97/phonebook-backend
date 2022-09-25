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

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

morgan.token('requestParams', req => JSON.stringify(req.body));
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms :requestParams';
app.use(morgan(morganFormat));

app.get('/', (request, response) => {
    response.send('HOME')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `Phonebook has info for ${persons.length} people <br/>
        ${date}`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.json(persons)
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
    const existingPerson = searchName(body.name)
    if (existingPerson) {
        return response.status(404).json({
            error: 'duplicate person'
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
})
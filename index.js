const express = require('express')
const app = express()

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

app.post('/api/persons', (request, response) => {
    const body = request.body
    const person = {
        id: generateId(),
        name: body.name,
        num: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
})
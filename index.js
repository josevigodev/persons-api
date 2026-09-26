const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
)

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find((person) => person.id === id)

  if (!person) {
    res.statusMessage = 'The person does not exists'
    return res.status(404).end()
  }

  res.json(person)
})

app.get('/api/info', (req, res) => {
  const personsLength = persons.length
  const time = new Date().getDate()

  res.send(
    `<p>Phonebook has info for ${personsLength} ${personsLength > 1 ? 'people' : 'person'}</p><p>${time}</p>`
  )
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(422).json({
      error: 'name is missing'
    })
  }

  const alreadyExists = persons.findIndex(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  )

  if (alreadyExists !== -1) {
    return res.status(409).json({
      error: `${body.name} already exists`
    })
  }

  if (!body.number) {
    return res.status(422).json({
      error: 'number is missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

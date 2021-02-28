const express = require('express')
const fs = require('fs')
const path = require('path')

// serve to port for heroku or use default
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express()

// middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// make css files available to use
app.use(express.static('./develop/public'));
app.use(express.static('public'));

// route that front end can request data from
const notes = require('./develop/db/db.json')
//const saveNote = require('./develop/public/assets/js')

// reads the db.json file
app.get('/api/notes', (req, res) => {
    res.json(notes)
})

// returns index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

// returns notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'))
})

// post receives a new note to save on the request body
// add new note to the db.json file and return the new note to the client with unique ID
app.post('/api/notes', (req, res) => {
    const newNote = req.body
    newNote.id = notes.length.toString()
    notes.push(newNote)

    fs.writeFile('./develop/db/db.json', JSON.stringify(notes), 'UTF8', function(err) {
        if (err) throw err
        console.log('wrote to file.')
    })

    res.json(newNote)
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})
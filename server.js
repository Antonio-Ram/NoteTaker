const fs = require('fs');
const path = require('path');
const { notes } = require ('./db/db');

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    console.log(req.query)
    res.json(results);
});

function validateNote(note) {
    if(!note.title || typeof note.title !=='string') {
        return false;
    }
    if (!note.text || typeof note.text !=='string') {
        return false;
    }
    return true;
}

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    }else{
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(3001, () => {
console.log(`API server now on port 3001!`);
});


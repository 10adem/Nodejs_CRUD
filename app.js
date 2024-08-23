const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let currentId = 1;

// Kök dizin için route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Kullanıcı girişi
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, message: 'Giriş başarılı' });
    } else {
        res.status(401).json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre' });
    }
});

// Kullanıcı ekleme
app.post('/users', (req, res) => {
    const newUser = { id: currentId++, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Tüm kullanıcıları listeleme
app.get('/users', (req, res) => {
    res.json(users);
});

// Kullanıcı güncelleme
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        res.json(users[index]);
    } else {
        res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
});

// Kullanıcı silme
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
});

app.listen(port, () => {
    console.log(`Uygulama http://localhost:${port} adresinde çalışıyor`);
});
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContacts, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

// menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts); // third party middleware
app.use(express.static('public')); // built in middleware
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.get('/', (req, res) => {
    // res.sendFile('./index.html', { root: __dirname });
    const arrMahasiswa = [
        {
            nama: 'noelle',
            email: 'noelle@gmail.com'
        },
        {
            nama: 'nero',
            email: 'nero@gmail.com'
        },
        {
            nama: 'vanessa',
            email: 'vanessa@gmail.com'
        }
    ]
    res.render('index', { 
        layout: 'layouts/main-layout',
        nama: 'rio gestavito',
        title: 'Halaman Home',  
        mahasiswa: arrMahasiswa
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'halaman about'});
});

app.get('/contact', (req, res) => {
    const contacts = loadContacts();
    
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'halaman contact',
        contacts,
        msg: req.flash('msg')
    });
});

// halaman form tambah data contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'halaman tambah contact'
    });
});

// proses data contact
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value);
        if (duplikat) {
            throw new Error('Nama contact sudah di gunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('noHP','No HP tidak valid!').isMobilePhone('id-ID')
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        res.render('add-contact', {
            layout: 'layouts/main-layout',
            title: 'halaman tambah contact',
            errors: errors.array()
        });
    } else {
        addContact(req.body);
        // kirimkan flash message
        req.flash('msg','Data kontak berhasil di tambahkan!');
        res.redirect('/contact');
    }
});

// proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    // jika contact tidak ada
    if (!contact) {
        res.status(404);
        res.send('404');
    } else {
        deleteContact(req.params.nama);
        // kirimkan flash message
        req.flash('msg','Data kontak berhasil dihapus!');
        res.redirect('/contact');
    }
});

// halaman form ubah data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'halaman ubah contact',
        contact
    });
});

// proses ubah data
app.post('/contact/update', [
    body('nama').custom((value, {req}) => {
        const duplikat = cekDuplikat(value);
        if (value !== req.body.oldNama && duplikat) {
            throw new Error('Nama contact sudah di gunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('noHP','No HP tidak valid!').isMobilePhone('id-ID')
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        res.render('edit-contact', {
            layout: 'layouts/main-layout',
            title: 'halaman ubah contact',
            errors: errors.array(),
            contact: req.body
        });
    } else {
        updateContacts(req.body);
        // kirimkan flash message
        req.flash('msg','Data kontak berhasil diubah!');
        res.redirect('/contact');
    }
});

// halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: `detail contact ${req.params.nama}`,
        contact
    });
});

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
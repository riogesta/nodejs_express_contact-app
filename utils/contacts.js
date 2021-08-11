const fs = require('fs');

// mengecek apakah folder 'data' tersedia
const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

// mengecek apakah file 'contacts.json' tersedia
const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// ambil semua data di contact .json
const loadContacts = () => {
    const file = fs.readFileSync('data/contacts.json','utf-8');
    const contacts = JSON.parse(file);
    return contacts;
};

// cari contact berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContacts();
    const contact = contacts.find((contact) => contact.nama === nama);
    return contact;
};

// menuliskan / menimpa file contacts.json dengan data yang baru
const  saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// menambahkan data contact baru
const addContact = (contact) => {
    const contacts = loadContacts();
    contacts.push(contact);
    saveContacts(contacts);
}

// cek nama yang duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContacts();
    return contacts.find((contact) => contact.nama === nama);
};

// hapus contact
const deleteContact = (nama) =>{
    const contacts = loadContacts();
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
    
    saveContacts(filteredContacts);
};

// untuk mengubah contacts
const updateContacts = (contactBaru) => {
    const contacts = loadContacts();
    // hilangkan contact lama yang namanya sama dengan oldNama
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);
}

module.exports = { loadContacts, findContact, addContact, cekDuplikat, deleteContact, updateContacts};
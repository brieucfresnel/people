let id = 0;
let persons = [
    {
        id: id++,
        firstname: "Jane",
        lastname: "Smith",
        score: 1250,
        avatar: 'avatarF1.png'
    }, {
        id: id++,
        firstname: "John",
        lastname: "Dow",
        score: 1780,
        avatar: 'avatarM1.png'
    }, {
        id: id++,
        firstname: "Betty",
        lastname: "O'Brian",
        score: 2120,
        avatar: 'avatarF2.png'
    }
];

function getPersons() {
   return persons;
}

function getPerson(id) {
    return persons.find(p => p.id === +id);
}

function removePerson(id) {
    persons = persons.filter(p => p.id !== +id);
}

function updatePerson(person) {
    persons = persons.map(p => p.id === +person.id ? person : p);
}

module.exports = {
   getPersons,
   getPerson,
   removePerson,
   updatePerson
};

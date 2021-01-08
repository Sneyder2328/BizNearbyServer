import faker from "faker";
import {genUUID} from "../utils/utils";

function genUser(id = genUUID()) {
    return {
        id,
        email: faker.internet.email(),
        username: faker.name.firstName(),
        password: faker.internet.password() + "7984",
    };
}

function genBusiness(id = genUUID()) {
    return {
        id,
        name: faker.company.companyName().substr(0, 10),
        basisCurrency: 'USD',
    };
}

export const users = [
    {   //GOOD EMAIL USER
        id: genUUID(),
        fullname: 'Franklin Clinton',
        email: 'thebilldot@gmail.com',
        phoneNumber: '123456',
        thumbnailUrl: 'myPic',
        password: '123456789',
        apiKey: '12345',
        typeLogin: 'email',
        typeUser: 'normal'
    },
    {   //GOOD GOOGLE USER
        id: genUUID(),
        fullname: "James",
        email: "kevinch2000@gmail.com",
        phoneNumber: null,
        thumbnailUrl: null,
        password: null,
        apiKey: "123456789",
        typeLogin: "google",
        typeUser: "normal"
    },
    {   //GOOD FACEBOOK USER
        id: genUUID(),
        fullname: "John Cena",
        email: "Jake@gmail.com",
        phoneNumber: null,
        thumbnailUrl: null,
        password: null,
        apiKey: "123456789",
        typeLogin: "facebook",
        typeUser: "normal"
    },
    {   //BAD USER (PASSWORD WITH EMPTY STRING "")
        id: genUUID(),
        fullname: "Kevin Cheng",
        email: "chengkev2000@gmail.com",
        phoneNumber: "",
        thumbnailUrl: "",
        password: "",
        apiKey: null,
        typeLogin: "email",
        typeUser: "normal"
    },
    {//BAD USER NAME TOO LONG
        id: genUUID(),
        fullname: "Kevin Cheng fdsajlfdjaljfadslkjkldasjkfldsjlkdfsjaljasdfkljdsaljfdlsjdslfjfasfdsajlfdjaljfadslkjkldasjkfldsjlkdfsjaljasdfkljdsaljfdlsjdslfjfasfdsajlfdjaljfadslkjkldasjkfldsjlkdfsjaljasdfkljdsaljfdlsjdslfjfasfdsajlfdjaljfadslkjkldasjkfldsjlkdfsjaljasdfkljdsaljfdlsjdslfjfas",
        email: "chengev2000@gmail.com",
        phoneNumber: "",
        thumbnailUrl: "",
        password: "1234567890",
        apiKey: null,
        typeLogin: "email",
        typeUser: "normal"
    },
    {//BAD USER PHONE TOO LONG
        id: genUUID(),
        fullname: "Kevin Cheng",
        email: "chingev2000@gmail.com",
        phoneNumber: "jaldfjlkjsafdljlkdjsfljfdslajfldjaklajfdlajslsajlfdkjfkl",
        thumbnailUrl: "",
        password: "1234567890",
        apiKey: null,
        typeLogin: "email",
        typeUser: "normal"
    },
    {//BAD USER password TOO LONG
        id: genUUID(),
        fullname: "Kevin Cheng",
        email: "cngev2000@gmail.com",
        phoneNumber: "",
        thumbnailUrl: "jaldfjlkjsafdljlkdjsfljfdslajfldjaklajfdlajslsajlfdkjfklFJSADLJFLSADKJFLAJLAJKLSJFSKLAJFLKJLASJLJLSDJLFKDSJLAJFLDS",
        password: "12345678lsfdjlkfjaljsldkjlkdsfjlfsdajljfasdljfsdlajljdfsklsadfjlfsadjlfksdajlasfdjlfsdjlfsajlsfjslfjkl90",
        apiKey: null,
        typeLogin: "email",
        typeUser: "normal"
    }
];

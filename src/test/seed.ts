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

function genText(length: number){
    let text = "";
    for(let i=0;i<length;i++) text += "a";
    return text;
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
        fullname: genText(251),
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
        phoneNumber: genText(51),
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
        thumbnailUrl: genText(501),
        password: genText(151),
        apiKey: null,
        typeLogin: "email",
        typeUser: "normal"
    },
    {//Extreme User, maximum entry lenght capacity
        id: genUUID(),
        fullname: genText(250),
        email: "cngev2000@gmail.com",
        phoneNumber: "",
        thumbnailUrl: genText(500),
        password: genText(150),
        apiKey: null,
        typeLogin: "email",
        typeUser: "normal"
    }
];

export const business = [
    {
        // GOOD BUSINESS
        userId: "ebf9b67a-50a4-439b-9af6-25dd7ff4810f",
        businessId: genUUID(),
        addressId: genUUID(),
        name: "Bodega La Trinidad",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059972,
        longitude: -69.340570,
        cityCode: 212,
        stateCode: 12,
        countryCode: 862,
        bannerUrl: "SomeExampleOfAnUrl",
        hours: [
            {
                day: 1,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 1,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: ["04120984532"],
        categories: [1],
        role: "owner"
    },
    {
        // BUSINESS WITHOUT CITYCODE, STATECODE, AND COUNTRYCODE
        userId: "ebf9b67a-50a4-439b-9af6-25dd7ff4810f",
        businessId: genUUID(),
        addressId: genUUID(),
        name: "Bodega La Trinidad",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059972,
        longitude: -69.340570,
        cityCode: null,
        stateCode: null,
        countryCode: null,
        bannerUrl: "SomeExampleOfAnUrl",
        hours: [
            {
                day: 1,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 1,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: ["04120984532"],
        categories: [1],
        role: "owner"
    },
    {
        // BUSINESS WITHOUT PHONE NUMBERS
        userId: "ebf9b67a-50a4-439b-9af6-25dd7ff4810f",
        businessId: genUUID(),
        addressId: genUUID(),
        name: "Bodega La Trinidad",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059972,
        longitude: -69.340570,
        cityCode: 212,
        stateCode: 12,
        countryCode: 862,
        bannerUrl: "SomeExampleOfAnUrl",
        hours: [
            {
                day: 1,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 1,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: [],
        categories: [1],
        role: "owner"
    },
    {
        // BUSINESS WITHOUT LATITUTE AND LONGITUDE
        userId: "ebf9b67a-50a4-439b-9af6-25dd7ff4810f",
        businessId: genUUID(),
        addressId: genUUID(),
        name: "Bodega La Trinidad",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: null,
        longitude: null,
        cityCode: 212,
        stateCode: 12,
        countryCode: 862,
        bannerUrl: "SomeExampleOfAnUrl",
        hours: [
            {
                day: 1,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 1,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: ["04120984532"],
        categories: [1],
        role: "owner"
    },
    {
        // USER NOT FOUND IN DATABASE
        userId: "cad2a3a9-363e-47d0-9dc8-0ff77c90301a",
        businessId: genUUID(),
        addressId: genUUID(),
        name: "Bodega La Trinidad",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059972,
        longitude: -69.340570,
        cityCode: 212,
        stateCode: 12,
        countryCode: 862,
        bannerUrl: "SomeExampleOfAnUrl",
        hours: [
            {
                day: 1,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 1,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: ["04120984532"],
        categories: [1],
        role: "owner"
    },
    {
        // BUSINESS NAME TOO LONG
        userId: "ebf9b67a-50a4-439b-9af6-25dd7ff4810f",
        businessId: genUUID(),
        addressId: genUUID(),
        name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059972,
        longitude: -69.340570,
        cityCode: 212,
        stateCode: 12,
        countryCode: 862,
        bannerUrl: "SomeExampleOfAnUrl",
        hours: [
            {
                day: 1,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 1,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: ["04120984532"],
        categories: [1],
        role: "owner"
    }
];
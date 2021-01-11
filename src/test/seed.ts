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
        typeLogin: 'email',
        typeUser: 'normal'
    },
    {   //GOOD GOOGLE USER
        id: genUUID(),
        fullname: "Sneyder Angulo",
        email: "sneyder2328@gmail.com",
        phoneNumber: "45646",
        googleAuth: {
            userId: "107318059015310771201",
            token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1MmZjYjk3ZGY1YjZiNGY2ZDFhODg1ZjFlNjNkYzRhOWNkMjMwYzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MzQ0Nzc1Mzg2OTgtZHI2YTl0aDM4b2ppY2lqcmYxdDhkMDU1bnZzdjkwZTYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MzQ0Nzc1Mzg2OTgtcW4xNmI4MTZlM2k0ZDdnbWVxY2hjMG9maDB1bmVlM24uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDczMTgwNTkwMTUzMTA3NzEyMDEiLCJlbWFpbCI6InNuZXlkZXIyMzI4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU25leWRlciBBbmd1bG8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2d0UXA0aDFCOFhFOXpkbWgta2ltWVA0ckl2RFJLQU00TVhsVzB1MkE9czk2LWMiLCJnaXZlbl9uYW1lIjoiU25leWRlciIsImZhbWlseV9uYW1lIjoiQW5ndWxvIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MTAzMjI2NzksImV4cCI6MTYxMDMyNjI3OX0.ZmylaXFHCpWGg1S2rWSUisRuInE-s0gaGKSt371S3zndAXaUnD0m1blXO3gsYVq1bgS0l89wnxSVo09sJni2_ITUW9hyW-CbR3--u3_c7-S-9ESnuSOPnnVQuiK1pwLIm01s1DYOYg_u7VY5pzF-S0H2Td-vUsO83oTS0Dw4sjFQRRzOtvu53IQ-zVTkfUCpo8OLcCusruU1yKhxMWlPhrnGHgvYX5tXWEvGUeNUl1Bl2572djvKLBaCyhZGYnEagUsxTLxm542yR5emvJQjImgA_lP-CD0y2E9ecsSMX_FHtHtjlmSJKGm3CXRx9Yf5Rssg86Bj_z1e7GSvvj57zA"
        },
        typeLogin: "google",
        typeUser: "normal"
    },
    {   //GOOD FACEBOOK USER
        id: genUUID(),
        fullname: "Timmy FB User",
        email: "timmy_pbcbfpc_user@tfbnw.net",
        phoneNumber: null,
        thumbnailUrl: null,
        password: null,
        googleAuth: null,
        facebookAuth: {
            token: "EAAC4KPwhvtABACkKZC2u1JuyAIcqZCVEOmntes6NmAnS9RliiZAh9YkPYD9P8dmjARzjk6gXiqFHGzgxhZAJZCLpgaZCwCvQtd078ZBmaZAtiY5CiT56UQZBxOsfQCSiwDIsGnDXeofNTIPSaJax0RjZCHEs1Uxqdn4Oc5yVkX37CQjZBVeQw4IrKZBq8FSeYZBMijsIF9sSbvuuXZAoa8CCBaC8OD",
            userId: "116167220374115"
        },
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
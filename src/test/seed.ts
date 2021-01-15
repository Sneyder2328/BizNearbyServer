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
        password: '123456789user1',
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
        facebookAuth: null,
        password: null,
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
            token: "EAAC4KPwhvtABAHtmxIjjdeJXt42wZBJesWKswzywQ8M4qusGbSJFSYSYyEgYlZCTBcYyI8Kaw5aBL6CnRSP60veh0uiKdXljMv69ymTNm2TtTJPwYEIKvX6k9q8EFbB5PdQ7KyqnIcM9sp71pvEHG6yjtSwSWDif3OuZCoUyJxgJa9mVSSzZBblDoXN2fGwHNZBLpgV37DM2mrnKnGP6d",
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
        fullname: genText(69),
        email: "cngev2000@gmail.com",
        phoneNumber: genText(14),
        thumbnailUrl: genText(499),
        password: genText(254),
        typeLogin: "email",
        typeUser: "normal"
    }
];

export const admin = [{
    id: genUUID(),
    fullname: 'Douglas Matias',
    email: 'douglas@gmail.com',
    phoneNumber: '123456',
    thumbnailUrl: 'myPic',
    password: '123456789admin',
    typeLogin: 'email',
    typeUser: 'admin'
},
{
    id: genUUID(),
    fullname: 'Elon MVP',
    email: 'Elon@gmail.com',
    phoneNumber: '123456',
    thumbnailUrl: 'myPic',
    password: '123456789admin2',
    typeLogin: 'email',
    typeUser: 'admin'
}
]

export const moderator = [{
    id: genUUID(),
    fullname: 'Abel moderator',
    email: 'Abel@gmail.com',
    phoneNumber: '123456',
    thumbnailUrl: 'myPic',
    password: '123456789moderator',
    typeLogin: 'email',
    typeUser: 'moderator'
},
{
    id: genUUID(),
    fullname: 'Cain moderator',
    email: 'Cain@gmail.com',
    phoneNumber: '123456',
    thumbnailUrl: 'myPic',
    password: '123456789moderator2',
    typeLogin: 'email',
    typeUser: 'moderator'
}
]

export const business = [
    {
        // GOOD BUSINESS
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
    },
    {
        // BUSINESS WITHOUT CITYCODE, STATECODE, AND COUNTRYCODE
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
    },
    {
        // BUSINESS WITHOUT PHONE NUMBERS
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
    },
    {
        // BUSINESS WITHOUT LATITUTE AND LONGITUDE
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
    },
    {
        // BUSINESS NAME TOO LONG
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
    }
];

export const updateBusiness = [
    {
        // UPDATE NAME
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
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
    },
    {
        // UPDATE DESCRIPTION
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
        description: "New description",
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
    },
    {
        // UPDATE ADDRESS
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 48 entre carreras 13c y 14",
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
    },
    {
        // UPDATE LATITUTE AND LONGITUDE
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059984,
        longitude: -69.340595,
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
    },
    {
        // UPDATE CITYCODE, STATECODE AND COUNTRYCODE
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
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
    },
    {
        // UPDATE BANNERURL
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
        description: "Bodega dedicada a la venta de viveres al detal. encontraras todos los articulos que necesitas.",
        address: "Calle 50 entre carreras 14 y 15",
        latitude: 10.059972,
        longitude: -69.340570,
        cityCode: 212,
        stateCode: 12,
        countryCode: 862,
        bannerUrl: "NewBanner",
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
    },
    {
        // UPDATE HOURS
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
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
            },
            {
                day: 2,
                openTime: "08:00",
                closeTime: "12:00"
            },
            {
                day: 2,
                openTime: "14:00",
                closeTime: "18:00"
            }
        ],
        phoneNumbers: ["04120984532"],
        categories: [1],
    },
    {
        // UPDATE PHONE NUMBER
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
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
        phoneNumbers: ["04122697450"],
        categories: [1],
    },
    {
        // UPDATE CATEGORIES
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: null,
        name: "Bodega La Comadre",
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
        categories: [1,2],
    },
    {
        // ADD NEW USER TO USERBUSINESS
        addressId: "eee15b20-917f-4d69-a055-e306d938d196",
        emailNewUser: "andres@gmail.com",
        name: "Bodega La Comadre",
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
    },
    {
        // WRONG ADRESSID 
        addressId: "f137edc7-043f-4d89-ac60-e225318688fb",
        emailNewUser: null,
        name: "Bodega La Comadre",
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
    }
];

export const newReport = [
    {
        // GOD REPORT
        id: genUUID(),
        businessId: 'a8bcd05e-4606-4a55-a5dd-002f8516493e',
        title: 'A report for example',
        description: 'This report it is only for example'
    },
    {
        // BUSINESSID DOES NOT EXIST
        id: genUUID(),
        businessId: '588b98a4-f506-4ff8-84f7-cf41dab09f02',
        title: 'A report for example',
        description: 'This report it is only for example'
    },
    {
        // NULL TITLE
        id: genUUID(),
        businessId: 'a8bcd05e-4606-4a55-a5dd-002f8516493e',
        title: null,
        description: 'This report it is only for example'
    },
    {
        // VERY LONG TITLE
        id: genUUID(),
        businessId: 'a8bcd05e-4606-4a55-a5dd-002f8516493e',
        title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        description: 'This report it is only for example'
    },
    {
        // NULL DESCRIPTION
        id: genUUID(),
        businessId: 'a8bcd05e-4606-4a55-a5dd-002f8516493e',
        title: 'A report for example',
        description: null
    },
    {
        // VERY LONG DESCRIPTION
        id: genUUID(),
        businessId: 'a8bcd05e-4606-4a55-a5dd-002f8516493e',
        title: 'A report for example',
        description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    }
];
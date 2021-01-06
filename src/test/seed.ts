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
    {
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
    {
        id: genUUID(),
        email: 'damario@gmail.com',
        username: 'DMario',
        password: '4567987891'
    },
    {
        id: genUUID(),
        email: 'dquavis12@gmail.com',
        username: 'Dquavis',
        password: 'qwertyuioi'
    }
];

import jwt from "jsonwebtoken";
import config from "../config/config";

export const signJWT = async (id) => {
    return jwt.sign({id},
        config.jwtSecret,
        {expiresIn: config.auth.accessTokenLifeTime}
    );
};

export type DecodedToken = {
    id: string;
}
// @ts-ignore
export const verifyJWT = async (accessToken): Promise<DecodedToken> => jwt.verify(accessToken, config.jwtSecret);
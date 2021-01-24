import { OAuth2Client } from 'google-auth-library';
import { Session, SessionObject } from '../../database/models/Session';
import { User, UserObject } from '../../database/models/User';
import axios from 'axios';
import { raw } from 'objection';

export const findSession = async (accessToken: string): Promise<SessionObject> => {
    return await Session.query().findById(accessToken)
}

const ONE_MONTH_IN_MINUTES = 30 * 24 * 60
export const isSessionExpired = (session: SessionObject): boolean => {
    const differenceInMins = new Date().getMinutes() - session.createdAt.getMinutes()
    return differenceInMins >= ONE_MONTH_IN_MINUTES
}

export const findUserById = async (userId: string): Promise<UserObject> => {
    return await User.query().findById(userId).where(raw('deletedAt IS NULL'));
}

export const verifyGoogleToken = async (userId: string, token: string, email: string) => {
    console.log("verifyGoogleToken", userId, token, email);

    const CLIENT_ID = "434477538698-qn16b816e3i4d7gmeqchc0ofh0unee3n.apps.googleusercontent.com";
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();

    return payload?.sub === userId && payload?.email === email
}

export const verifyFBToken = async (userId: string, accessToken: string) => {
    const appAccessToken = "202486168272592|f596f78dd89bf75b14142e9c88ef7b3b";
    const appId = "202486168272592";
    const application = "BizNearby";
    const url = "https://graph.facebook.com/debug_token";

    let response = await axios.get(url + `?input_token=${accessToken}&access_token=${appAccessToken}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    const data = {
        appId: response['data']['data']['app_id'],
        isValid: response['data']['data']['is_valid'],
        application: response['data']['data']['application'],
        userId: response['data']['data']['user_id']
    };

    return data.isValid && data.appId == appId && data.application == application && data.userId == userId
}
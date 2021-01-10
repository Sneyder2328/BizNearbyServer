import { OAuth2Client } from 'google-auth-library';
import { Session, SessionObject } from '../../database/models/Session';
import { User, UserObject } from '../../database/models/User';

export const findSession = async (accessToken: string): Promise<SessionObject> => {
    return await Session.query().findById(accessToken)
}

const ONE_MONTH_IN_MINUTES = 30 * 24 * 60
export const isSessionExpired = (session: SessionObject): boolean => {
    console.log('Session', session.createdAt, new Date()); // TODO verify that createdAt dates to less than one month ago
    const differenceInMins = new Date().getMinutes() - session.createdAt.getMinutes()
    console.log('differenceInMins', differenceInMins);
    return differenceInMins >= ONE_MONTH_IN_MINUTES
}

export const findUserById = async (userId: string): Promise<UserObject> => {
    return await User.query().findById(userId)
}

export const verifyGoogleToken = async (userId: string, accessToken: string) => {
    const CLIENT_ID = "434477538698-8ulu0utc36ugu3ob252o5bptt1s52clk.apps.googleusercontent.com";
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const responseUserId = payload?.sub;
    return responseUserId == userId
}

export const verifyFBToken = async (userId: string, accessToken: string) => {
    const appAccessToken = "158152681487301|xQmAWuwi1ZGF_QBB4egZZCGh1YQ";
    const appId = "158152681487301";
    const application = "SDMessages";
    const url = "https://graph.facebook.com/debug_token";

    let response = await fetch(url + `?input_token=${accessToken}&access_token=${appAccessToken}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    response = await response.json();
    const data = {
        appId: response['data']['app_id'],
        isValid: response['data']['is_valid'],
        application: response['data']['application'],
        userId: response['data']['user_id']
    };
    return data.isValid && data.appId == appId && data.application == application && data.userId == userId
}
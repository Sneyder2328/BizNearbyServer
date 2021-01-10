
import { OAuth2Client } from 'google-auth-library';

export const verifyGoogleToken = async (accessToken: string ,userId: string) => {
    const CLIENT_ID = "448494042748-vm28epp6eol7hcv0so4bn4i83q83keu9.apps.googleusercontent.com";
    const CLIENT_SECRET = "DUGN8s0UMBlYfLpW5zvoPIoY"
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const responseUserId = payload?.sub;
    if(responseUserId == userId)
        return true;
    else
        return false;
}

export const verifyFBToken = async (accessToken: string, userId: string) => {
    const appAccessToken = "158152681487301|xQmAWuwi1ZGF_QBB4egZZCGh1YQ";
    const appId = "158152681487301";
    const application = "SDMessages";
    const url = "https://graph.facebook.com/debug_token";

    let response = await fetch(url + `?input_token=${accessToken}&access_token=${appAccessToken}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    response = await response.json();
    const data = {
        appId: response['data']['app_id'],
        isValid: response['data']['is_valid'],
        application: response['data']['application'],
        userId: response['data']['user_id']
    };
    if(data.isValid && data.appId==appId && data.application==application && data.userId == userId)
        return true;
    else 
        return false;
}
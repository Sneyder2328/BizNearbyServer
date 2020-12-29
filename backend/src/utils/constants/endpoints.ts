export default {
    auth: {
        LOG_IN: 'sessions',
        LOG_OUT: 'seccions',
        REFRESH_TOKEN: 'tokens'
    },
    user: {
        SIGN_UP: '/users',
        UPDATE_PROFILE: (userId) => `/users/${userId}`, 
        DELETE_ACCOUNT: (userId) => `/users/delete/${userId}`,
        business: {
            REGISTER: (userId) => `/business/create/${userId}`,
            UPDATE: (userId,bizId) => `/business/edit/${userId}?bizId=${bizId}`,
            DELETE: (userId, bizId) => `/business/delete/${userId}?bizId=${bizId}`
        },
        REPORT: (bizId) => `users/report/${bizId}`,

    }
}
export default {
    auth: {
        LOG_IN: 'sessions',
        LOG_OUT: 'seccions',
        REFRESH_TOKEN: 'tokens'
    },
    users: {
        SIGN_UP: '/users',
        UPDATE_PROFILE: (userId) => `/users/${userId}`, 
        DELETE_ACCOUNT: (userId) => `/users/delete/${userId}`,
        owner:{
            BUSINESS_REGISTER: (userId) => `/businesses/create/${userId}`,
            BUSINESS_UPDATE: (userId,bizId) => `/businesses/update/${userId}?bizId=${bizId}`,
            BUSINESS_DELETE: (userId, bizId) => `/businesses/delete/${userId}?bizId=${bizId}`,
        },
        moderator:{
            GET_ALL_REPORTS: '/businesses/getReports',
        },
        REPORT: (bizId) => `/users/report/${bizId}`,
    },
    review: {
        REVIEW_ADD: (bizId) => `/reviews/create/${bizId}`,
        REVIEW_UPDATE: (bizId) => `/reviews/update/${bizId}`,
        REVIEW_DELETE: (bizId) => `/reviews/delete/${bizId}`,
    },
    REVIEW_GET: (bizId)=>`/reviews/get/${bizId}`,
    NEARBY_BUSINESS_GET: `/businesses/get`,
}
export const endpoints = {
    auth: {
        LOG_IN: '/sessions',
        LOG_OUT: '/seccions',
        REFRESH_TOKEN: '/tokens'
    },
    users: {
        SIGN_UP: '/users',
        UPDATE_PROFILE: (userId) => `/users/${userId}`, 
        DELETE_ACCOUNT: (userId) => `/users/delete/${userId}`,
        owner:{
            BUSINESS_REGISTER: 'post/businesses',
            BUSINESS_UPDATE: '/businesses/update/',
            BUSINESS_DELETE: '/businesses/delete/',
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
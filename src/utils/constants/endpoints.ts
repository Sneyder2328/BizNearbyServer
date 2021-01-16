export const endpoints = {
    auth: {
        LOG_IN: '/sessions',
        LOG_OUT: '/sessions',
        REFRESH_TOKEN: '/tokens'
    },
    users: {
        SIGN_UP: '/users',
        UPDATE_PROFILE: `/users/:userId`, 
        DELETE_ACCOUNT: `/users/:userId`,
        GET_PROFILE: `/users/:userId`,
        owner:{
            BUSINESS_REGISTER: '/businesses',
            BUSINESS_UPDATE: '/businesses/:businessId',
            BUSINESS_DELETE: '/businesses/:businessId',
            GET_ALL_BUSINESSES: '/users/:userId/businesses'
        },
        REPORT: (bizId) => `/users/report/${bizId}`,
    },
    moderator:{
        CREATE_MODERATOR: '/moderators/:moderatorId',
        REMOVE_MODERATOR: '/moderators/:moderatorId',
        GET_ALL_REPORTS: '/businesses/getReports',
    },
    DELETE_USERS: `/users`,
    review: {
        REVIEW_ADD: (bizId) => `/reviews/create/${bizId}`,
        REVIEW_UPDATE: (bizId) => `/reviews/update/${bizId}`,
        REVIEW_DELETE: (bizId) => `/reviews/delete/${bizId}`,
    },
    REVIEW_GET: (bizId)=>`/reviews/get/${bizId}`,
    NEARBY_BUSINESS_GET: `/businesses/get`,
    GET_BUSINESS: '/businesses/:businessId'
}
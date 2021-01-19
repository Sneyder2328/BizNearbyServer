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
            GET_ALL_BUSINESSES: '/users/:userId/businesses',
            GET_ALL_CATEGORIES: '/categories'
        },
    },
    moderator:{
        CREATE_MODERATOR: '/moderators/:moderatorId',
        REMOVE_MODERATOR: '/moderators/:moderatorId',
        GET_ALL_REPORTS: '/businesses/getReports',
    },
    report: {
        CREATE_REPORT: `/reports/`,
        GET_REPORTS: `/reports/`,
        REVIEW_REPORT: `/reports/:reportId`,
        DELETE_REPORT: `/reports/:reportId`
    },
    businessReview: {
        CREATE_BUSINESS_REVIEW: `/businessReview/`,
        UPDATE_BUSINESS_REVIEW: `/businessReview/`
    },
    LOCATION_AUTOCOMPLETE: `/locations/`,
    NEARBY_BUSINESS_GET: `/businesses/get`,
    GET_BUSINESS: '/businesses/:businessId',
    DELETE_USERS: `/users`,
    ADD_CATEGORY: `/categories`
}
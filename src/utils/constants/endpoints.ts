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
        CREATE_MODERATOR: '/moderators/:userEmail',
        REMOVE_MODERATOR: '/moderators/:userEmail',
        GET_ALL_REPORTS: '/businesses/getReports',
        GET_MODERATOR: '/moderators'
    },
    report: {
        CREATE_REPORT: `/reports/`,
        GET_REPORTS: `/reports/`,
        REVIEW_REPORT: `/reports/:reportId`,
        DELETE_REPORT: `/reports/:reportId`
    },
    businessReview: {
        CREATE_BUSINESS_REVIEW: `/businessReview/`,
        UPDATE_BUSINESS_REVIEW: `/businessReview/`,
        DELETE_BUSINESS_REVIEW: `/businessReview/:userId`
    },
    LOCATION_AUTOCOMPLETE: `/locations/`,
    GET_NEARBY_BUSINESSES: `/businesses`,
    GET_BUSINESS: '/businesses/:businessId',
    DELETE_USERS: `/users`,
    ADD_CATEGORY: `/categories`,
    DELETE_CATEGORY: `/categories/:code`
}
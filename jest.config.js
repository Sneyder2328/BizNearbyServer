module.exports = {
    roots: ['<rootDir>/dist'],
    testRegex: `business.spec.js$`,
    testEnvironment: "node",
    testPathIgnorePatterns: ['/node_modules/']
};
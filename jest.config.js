module.exports = {
    roots: ['<rootDir>/dist'],
    testRegex: `report.spec.js$`,
    testEnvironment: "node",
    testPathIgnorePatterns: ['/node_modules/']
};
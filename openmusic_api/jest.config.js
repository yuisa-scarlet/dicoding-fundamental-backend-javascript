/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/migrations/**',
        '!src/utils/constants.js'
    ],
    testMatch: [
        '**/src/tests/**/*.test.js',
        '**/src/**/*.test.js'
    ],
    globals: {
        'jest': true
    },
    reporters: ['<rootDir>/reporters/minimal.js']
};

module.exports = config;
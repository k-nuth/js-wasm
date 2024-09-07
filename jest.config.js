// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

module.exports = {
    preset: 'ts-jest',
    bail: true,
    testEnvironment: 'node',
    testRegex: [ "tests\/.*\.test\.ts" ],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    collectCoverageFrom: [],
    transform: {
        "\\.ts$": ['ts-jest', {
            tsconfig: {
                "types": ["jest"]
            }
        }]
    }
};

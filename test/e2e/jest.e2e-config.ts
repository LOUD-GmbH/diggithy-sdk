import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    clearMocks: true,
    restoreMocks: true,
    silent: false,
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRunner: "jest-circus/runner",
    testRegex: "\\.e2e-spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
};

export default config;

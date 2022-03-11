import { ApolloQueryResult, ApolloClient } from "@apollo/client/core";
import { Diggithy } from "../../src";
import { errors } from "../../src/errors";
import { warnings } from "../../src/warnings";
import * as graphQlClient from "../../src/graphql/graphQlClient";
import { auth } from "../../src/graphql/queries";

describe("Auth", () => {
    beforeEach(() => {
        process.env.DIGGITHY_API_KEY = "someApiKey";
        Reflect.set(Diggithy.Auth, "instance", undefined);
    });

    describe("static functions", () => {
        describe("init", () => {
            it("should create instance and set apiKey from env var", () => {
                expect(Reflect.get(Diggithy.Auth, "instance")).toBeUndefined();

                Diggithy.Auth.init();

                const instance = Reflect.get(Diggithy.Auth, "instance");
                expect(instance).toBeTruthy();
                expect(Reflect.get(instance, "apiKey")).toBe("someApiKey");
            });

            it("should override apiKey", () => {
                expect(process.env.DIGGITHY_API_KEY).toBe("someApiKey");

                Diggithy.Auth.init("anotherApiKey");

                const instance = Reflect.get(Diggithy.Auth, "instance");
                expect(instance).toBeTruthy();
                expect(Reflect.get(instance, "apiKey")).toBe("anotherApiKey");
            });

            it("should warn if no API key is configured", () => {
                delete process.env.DIGGITHY_API_KEY;
                const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

                Diggithy.Auth.init();

                expect(consoleSpy).toBeCalledWith(warnings.noApiKeyConfigured);
            });

            it("should delete token on subsequent calls with a different API key", () => {
                Diggithy.Auth.init();

                const instance = Reflect.get(Diggithy.Auth, "instance");
                Reflect.set(instance, "token", "someToken");

                Diggithy.Auth.init("someDifferentApiKey");

                expect(Reflect.get(instance, "token")).toBeUndefined();
            });

            it("should keep token on subsequent calls with equal API key", () => {
                Diggithy.Auth.init();

                const instance = Reflect.get(Diggithy.Auth, "instance");
                Reflect.set(instance, "token", "someToken");

                Diggithy.Auth.init();

                expect(Reflect.get(instance, "token")).toBe("someToken");
            });

            it("should throw if API key is not a string", () => {
                expect(() => Diggithy.Auth.init(4 as unknown as string)).toThrowError(
                    new Error(`"apiKey" must be a string`),
                );
            });
        });

        describe("getToken", () => {
            it("should throw if no API key is configured", () => {
                delete process.env.DIGGITHY_API_KEY;
                jest.spyOn(console, "warn").mockImplementation();

                Diggithy.Auth.init();

                const instance = Reflect.get(Diggithy.Auth, "instance");
                expect(Reflect.get(instance, "apiKey")).toBeUndefined();
                expect(Diggithy.Auth.getToken).toThrowError(new Error(errors.noApiKeyConfigured));
            });

            it("should resolve with token if one is set", async () => {
                Diggithy.Auth.init();
                Reflect.set(Reflect.get(Diggithy.Auth, "instance"), "token", "someToken");

                const graphQlQuerySpy = jest.spyOn(graphQlClient, "getGraphQlClient");

                await expect(Diggithy.Auth.getToken()).resolves.toBe("someToken");

                expect(graphQlQuerySpy).not.toBeCalled();
            });

            it("should authenticate with API if no token is set", async () => {
                Diggithy.Auth.init();

                const graphQlQuerySpy = jest.fn().mockResolvedValue({
                    data: {
                        auth: {
                            token: "someToken",
                        },
                    },
                } as ApolloQueryResult<any>);

                jest.spyOn(graphQlClient, "getGraphQlClient").mockReturnValue({
                    query: graphQlQuerySpy,
                } as unknown as ApolloClient<any>);

                await expect(Diggithy.Auth.getToken()).resolves.toBe("someToken");

                expect(graphQlQuerySpy).toBeCalledWith({
                    query: auth,
                    variables: {
                        apiKey: "someApiKey",
                    },
                });
            });

            it("should reject with GraphQL error", () => {
                Diggithy.Auth.init();

                jest.spyOn(graphQlClient, "getGraphQlClient").mockReturnValue({
                    query: jest.fn().mockResolvedValue({
                        error: {
                            message: "Something went wrong.",
                        },
                    } as ApolloQueryResult<any>),
                } as unknown as ApolloClient<any>);

                return expect(Diggithy.Auth.getToken()).rejects.toEqual(new Error("Something went wrong."));
            });

            it("should reject if no token returned", () => {
                Diggithy.Auth.init();

                jest.spyOn(graphQlClient, "getGraphQlClient").mockReturnValue({
                    query: jest.fn().mockResolvedValue({} as ApolloQueryResult<any>),
                } as unknown as ApolloClient<any>);

                return expect(Diggithy.Auth.getToken()).rejects.toEqual(new Error(errors.noTokenReturned));
            });
        });
    });
});

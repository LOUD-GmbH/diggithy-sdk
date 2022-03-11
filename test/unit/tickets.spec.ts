import faker from "@faker-js/faker";
import { Diggithy } from "../../src";
import * as authenticatedGraphQlClient from "../../src/graphql/authenticatedGraphQlClient";
import { createTickets, deleteTickets } from "../../src/graphql/mutations";
import { errors } from "../../src/errors";

describe("Tickets", () => {
    describe("static functions", () => {
        let getGraphQlClientSpy: jest.SpyInstance;

        beforeEach(() => {
            getGraphQlClientSpy = jest.spyOn(authenticatedGraphQlClient, "getAuthenticatedGraphQlClient");
        });

        describe("createTickets", () => {
            it("should call API to create tickets", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({ data: { createTickets: [] } }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                await expect(Diggithy.Tickets.createTickets(42)).resolves.toEqual([]);
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: createTickets,
                    variables: {
                        amount: 42,
                    },
                });
            });

            it("should call API to create tickets if amount is expressed as string", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({ data: { createTickets: [] } }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                await expect(Diggithy.Tickets.createTickets("42" as unknown as number)).resolves.toEqual([]);
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: createTickets,
                    variables: {
                        amount: 42,
                    },
                });
            });

            it("should reject if no valid result is returned from the API", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({}),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                await expect(Diggithy.Tickets.createTickets(42)).rejects.toEqual(new Error(errors.noTicketsReturned));
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: createTickets,
                    variables: {
                        amount: 42,
                    },
                });
            });

            it("should reject with GraphQL errors", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({
                        errors: [],
                    }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                await expect(Diggithy.Tickets.createTickets(42)).rejects.toEqual(
                    new Error(errors.mutationThrewMultipleErrors),
                );
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: createTickets,
                    variables: {
                        amount: 42,
                    },
                });
            });

            it("should throw if amount is not a positive integer", () => {
                expect(() => Diggithy.Tickets.createTickets(undefined as unknown as number)).toThrowError(
                    new Error(`"amount" is required`),
                );
                expect(() => Diggithy.Tickets.createTickets(-1)).toThrowError(
                    new Error(`"amount" must be a positive number`),
                );
                expect(() => Diggithy.Tickets.createTickets(1.5)).toThrowError(
                    new Error(`"amount" must be an integer`),
                );
            });
        });

        describe("deleteTickets", () => {
            it("should resolve with true if tickets were deleted", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({ data: { deleteTickets: true } }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                const uuid = faker.datatype.uuid();

                await expect(Diggithy.Tickets.deleteTickets([uuid])).resolves.toEqual(true);
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: deleteTickets,
                    variables: {
                        ticketUuids: [uuid],
                    },
                });
            });

            it("should resolve with false if tickets were not deleted", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({ data: { deleteTickets: false } }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                const uuid = faker.datatype.uuid();

                await expect(Diggithy.Tickets.deleteTickets([uuid])).resolves.toEqual(false);
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: deleteTickets,
                    variables: {
                        ticketUuids: [uuid],
                    },
                });
            });

            it("should reject with GraphQL errors", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({
                        errors: [],
                    }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                const uuid = faker.datatype.uuid();

                await expect(Diggithy.Tickets.deleteTickets([uuid])).rejects.toEqual(
                    new Error(errors.mutationThrewMultipleErrors),
                );
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: deleteTickets,
                    variables: {
                        ticketUuids: [uuid],
                    },
                });
            });

            it("should resolve with false if ticketUuids are empty", () =>
                expect(Diggithy.Tickets.deleteTickets([])).resolves.toBe(false));

            it("should throw if ticketUuids is not a valid array of UUIDs", () => {
                expect(() => Diggithy.Tickets.deleteTickets(undefined as unknown as string[])).toThrowError(
                    new Error(`"ticketUuids" is required`),
                );
                expect(() => Diggithy.Tickets.deleteTickets([1, 2] as unknown as string[])).toThrowError(
                    new Error(`"[0]" must be a string`),
                );
                expect(() => Diggithy.Tickets.deleteTickets([null] as unknown as string[])).toThrowError(
                    new Error(`"[0]" must be a string`),
                );
                expect(() => Diggithy.Tickets.deleteTickets([undefined] as unknown as string[])).toThrowError(
                    new Error(`"ticketUuids" must not be a sparse array item`),
                );
                expect(() => Diggithy.Tickets.deleteTickets(["x", "y"])).toThrowError(
                    new Error(`"[0]" must be a valid GUID`),
                );
            });
        });
    });
});

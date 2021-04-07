import { Diggithy } from "../../src";
import * as authenticatedGraphQlClient from "../../src/graphql/authenticatedGraphQlClient";
import { createTickets, deleteTickets } from "../../src/graphql/mutations";
import { errors } from "../../src/errors";

describe(Diggithy.Tickets.name, () => {
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
        });

        describe("deleteTickets", () => {
            it("should resolve with true if tickets were deleted", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({ data: { deleteTickets: true } }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                await expect(Diggithy.Tickets.deleteTickets(["anExistingTicketUuid"])).resolves.toEqual(true);
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: deleteTickets,
                    variables: {
                        ticketUuids: ["anExistingTicketUuid"],
                    },
                });
            });

            it("should resolve with false if tickets were not deleted", async () => {
                const graphQlClientMock = {
                    mutate: jest.fn().mockResolvedValue({ data: { deleteTickets: false } }),
                };

                getGraphQlClientSpy.mockReturnValue(graphQlClientMock);

                await expect(Diggithy.Tickets.deleteTickets(["aNonExistingTicketUuid"])).resolves.toEqual(false);
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: deleteTickets,
                    variables: {
                        ticketUuids: ["aNonExistingTicketUuid"],
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

                await expect(Diggithy.Tickets.deleteTickets(["SchroedingersTicketUuid"])).rejects.toEqual(
                    new Error(errors.mutationThrewMultipleErrors),
                );
                expect(getGraphQlClientSpy).toBeCalled();
                expect(graphQlClientMock.mutate).toBeCalledWith({
                    mutation: deleteTickets,
                    variables: {
                        ticketUuids: ["SchroedingersTicketUuid"],
                    },
                });
            });

            it("should resolve with false if ticketUuids are empty", () =>
                expect(Diggithy.Tickets.deleteTickets([])).resolves.toBe(false));
        });
    });
});

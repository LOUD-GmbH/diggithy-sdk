import Joi = require("joi");
import { createTickets, deleteTickets } from "../graphql/mutations";
import { errors } from "../errors";
import { getAuthenticatedGraphQlClient } from "../graphql/authenticatedGraphQlClient";

export class Tickets {
    /**
     * Creates tickets and resolves with the corresponding ticket UUIDs for end users.
     * @param amount The amount of tickets that should be created.
     */
    public static createTickets(amount: number): Promise<string[]> {
        amount = Joi.attempt(amount, Joi.number().required().integer().positive().label("amount"));

        return getAuthenticatedGraphQlClient()
            .mutate({
                mutation: createTickets,
                variables: {
                    amount,
                },
            })
            .then((result) => {
                if (result.errors) throw new Error(errors.mutationThrewMultipleErrors);
                if (!result.data?.createTickets) {
                    throw new Error(errors.noTicketsReturned);
                }

                return result.data.createTickets;
            });
    }

    /**
     * Deletes tickets. Resolves with `true` if at least one of the tickets was deleted or with `false` if no ticket
     * could be deleted or the `ticketUuid` array was empty.
     * @param ticketUuids An array of ticket UUIDs to delete
     */
    public static deleteTickets(ticketUuids: string[]): Promise<boolean> {
        ticketUuids = Joi.attempt(ticketUuids, Joi.array().required().items(Joi.string().uuid()).label("ticketUuids"));

        if (ticketUuids.length <= 0) return Promise.resolve(false);

        return getAuthenticatedGraphQlClient()
            .mutate({
                mutation: deleteTickets,
                variables: {
                    ticketUuids,
                },
            })
            .then((result) => {
                if (result.errors) throw new Error(errors.mutationThrewMultipleErrors);
                if (!result.data) throw new Error(errors.unexpectedApiResponse);

                return result.data.deleteTickets;
            });
    }
}

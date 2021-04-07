import { createTickets } from "../graphql/mutations";
import { errors } from "../errors";
import { getAuthenticatedGraphQlClient } from "../graphql/authenticatedGraphQlClient";

export class Tickets {
    /**
     * Creates tickets and returns the corresponding ticket UUIDs for end users.
     * @param amount The amount of tickets that should be created.
     */
    public static createTickets(amount: number): Promise<String[]> {
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
}

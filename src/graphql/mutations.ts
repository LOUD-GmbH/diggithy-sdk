import { gql } from "@apollo/client/core";

export const createTickets = gql`
    mutation createTickets($amount: Int!) {
        createTickets(amount: $amount)
    }
`;

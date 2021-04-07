import { gql } from "@apollo/client/core";

export const createTickets = gql`
    mutation createTickets($amount: Int!) {
        createTickets(amount: $amount)
    }
`;

export const deleteTickets = gql`
    mutation deleteTickets($ticketUuids: [ID]!) {
        deleteTickets(ticketUuids: $ticketUuids)
    }
`;

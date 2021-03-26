import { gql } from "@apollo/client/core";

export const auth = gql`
    query auth($apiKey: String!) {
        auth(apiKey: $apiKey) {
            token
        }
    }
`;

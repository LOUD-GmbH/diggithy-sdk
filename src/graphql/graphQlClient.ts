import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { createHttpLink } from "./createHttpLink";

let graphQlClient: ApolloClient<any>;

export const getGraphQlClient = (): ApolloClient<any> => {
    if (!graphQlClient) {
        graphQlClient = new ApolloClient<any>({
            cache: new InMemoryCache(),
            link: createHttpLink(),
        });
    }

    return graphQlClient;
};

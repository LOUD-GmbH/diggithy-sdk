import "cross-fetch/polyfill";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

let graphQlClient: ApolloClient<any>;

export const getGraphQlClient = (): ApolloClient<any> => {
    if (!graphQlClient) {
        graphQlClient = new ApolloClient<any>({
            cache: new InMemoryCache(),
            uri: process.env.DIGGITHY_API_URI || "https://api.diggithy.de/public",
        });
    }

    return graphQlClient;
};

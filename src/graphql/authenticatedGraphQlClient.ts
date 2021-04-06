import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { Auth } from "../auth";
import { createHttpLink } from "./createHttpLink";

let authenticatedGraphQlClient: ApolloClient<any>;

export const getAuthenticatedGraphQlClient = (): ApolloClient<any> => {
    if (!authenticatedGraphQlClient) {
        const authLink = setContext(async (request, { headers }) => {
            if (request.operationName === "auth") return { headers };
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${await Auth.getToken()}`,
                },
            };
        });

        authenticatedGraphQlClient = new ApolloClient<any>({
            cache: new InMemoryCache(),
            link: authLink.concat(createHttpLink()),
        });
    }

    return authenticatedGraphQlClient;
};

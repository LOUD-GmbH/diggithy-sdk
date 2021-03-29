import { errors } from "../errors";
import { getGraphQlClient } from "../graphql";
import { auth } from "../graphql/queries";
import { warnings } from "../warnings";

export namespace Diggithy {
    export class Auth {
        private static instance: Auth;

        private apiKey: string | undefined;
        private token: string | undefined;

        private constructor() {}

        private static getInstance(): Auth {
            if (!Auth.instance) {
                Auth.init();
            }
            return Auth.instance;
        }

        public static init(apiKey?: string): void {
            if (!Auth.instance) {
                Auth.instance = new Auth();
            }

            const newApiKey = apiKey ?? process.env.DIGGITHY_API_KEY;

            if (!newApiKey) {
                console.warn(warnings.noApiKeyConfigured);
            }

            if (newApiKey !== Auth.instance.apiKey) {
                Auth.instance.apiKey = newApiKey;
                Auth.instance.token = undefined;
            }
        }

        public static getToken(): Promise<string> {
            const instance = Auth.getInstance();

            if (!instance.apiKey) {
                throw new Error(errors.noApiKeyConfigured);
            }

            if (instance.token) return Promise.resolve(instance.token);

            return getGraphQlClient()
                .query({
                    query: auth,
                    variables: {
                        apiKey: instance.apiKey,
                    },
                })
                .then((result) => {
                    if (result.error) throw new Error(result.error.message);
                    if (result.data?.auth?.token) {
                        instance.token = result.data.auth.token;
                        return result.data.auth.token;
                    }

                    throw new Error(errors.noTokenReturned);
                });
        }
    }
}

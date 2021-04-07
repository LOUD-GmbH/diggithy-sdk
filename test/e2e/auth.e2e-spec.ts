import * as dotenv from "dotenv";
import { Diggithy } from "../../src";

dotenv.config();

describe(Diggithy.Auth.name, () => {
    it("should resolve with valid token", () => expect(Diggithy.Auth.getToken()).resolves.toBeTruthy());
});

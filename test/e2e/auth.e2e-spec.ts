import * as dotenv from "dotenv";
import { Diggithy } from "../../src";

dotenv.config();

describe(Diggithy.Auth.name, () => {
    it("should return valid token", () => expect(Diggithy.Auth.getToken()).resolves.toBeTruthy());
});

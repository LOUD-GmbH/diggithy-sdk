import * as dotenv from "dotenv";
import { Diggithy } from "../../src";

dotenv.config();

describe(Diggithy.Tickets.name, () => {
    it("should resolve with ticket UUIDs", () => {
        expect.assertions(2);

        const promise = Diggithy.Tickets.createTickets(3);

        expect(promise).resolves.toBeTruthy();

        return promise.then((result) => expect(result.length).toBe(3));
    });

    it("should resolve with true", () =>
        Diggithy.Tickets.createTickets(3).then((tickets) =>
            expect(Diggithy.Tickets.deleteTickets(tickets)).resolves.toBe(true),
        ));
});

const request = require("supertest");
const app = require("../server");

describe("Entries API", () => {
    test("Bejegyzések bejelentkezés nélkül nem elérhetők", async () => {
        const response = await request(app).get("/api/entries");

        expect(response.statusCode).toBe(401);
    });
});
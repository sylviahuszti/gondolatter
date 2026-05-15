const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
    test("Regisztráció működik", async () => {
        const uniqueEmail = `teszt${Date.now()}@example.com`;

        const response = await request(app)
            .post("/api/register")
            .send({
                name: "Teszt Elek",
                email: uniqueEmail,
                password: "Test123"
            });

        expect(response.statusCode).toBe(201);
    });
});
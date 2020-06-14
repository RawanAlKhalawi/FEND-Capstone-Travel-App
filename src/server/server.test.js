
const app = require('./server')
const supertest = require('supertest')
const request = supertest(app)
// it('Testing', () => {
//     expect(1).toBe(1)
// })
describe("Test", () => {
    test("GET method", () => {
        return request
            .get("/")
            .expect(200);

    });
});
// it('Testing to see if Jest works', () => {
//     expect(1).toBe(0)
// })


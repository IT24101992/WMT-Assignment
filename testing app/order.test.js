// Import required libraries
const request = require('supertest');
const app = require('../server'); // your Express app
const mongoose = require('mongoose');

// Sample test user token (you must replace with valid token)
const token = "YOUR_TEST_TOKEN";

// Test suite for Order APIs
describe("Order API Tests", () => {

    // Test CREATE order
    it("should create a new order", async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`) // auth header
            .send({
                orderItems: [
                    { name: "Shirt", qty: 2, price: 100 }
                ],
                shippingAddress: {
                    fullName: "John Doe",
                    address: "Colombo"
                },
                totalPrice: 200
            });

        expect(res.statusCode).toBe(201); // created
        expect(res.body).toHaveProperty('_id'); // order id exists
    });

    // Test READ user orders
    it("should get user orders", async () => {
        const res = await request(app)
            .get('/api/orders/myorders')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test VALIDATION (empty order)
    it("should fail when no order items", async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                orderItems: [],
                totalPrice: 0
            });

        expect(res.statusCode).toBe(400);
    });

});
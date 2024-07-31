// import request from 'supertest';
// import app from '../app'; // Adjust the path as needed

// let authToken: string;

// beforeAll(async () => {
//     // Login to obtain the token
//     const loginResponse = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//             username: 'user1',
//             password: 'helloword'
//         });

//     console.log('Login Response:', loginResponse.status, loginResponse.body);

//     expect(loginResponse.status).toBe(200);
//     authToken = loginResponse.body.token;
// });

// describe('Products API with Authentication', () => {
//     let productId: number;

//     it('should create a new product', async () => {
//         console.log("authToken is ", authToken);

//         const response = await request(app)
//             .post('/api/v1/products')
//             .set('Authorization', `Bearer ${authToken}`)
//             .send({
//                 name: 'Sample Product',
//                 description: 'This is a sample product',
//                 price: 19.99,
//                 categoryId: 1,
//                 inventoryCount: 100,
//             });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('id');
//         expect(response.body.name).toBe('Sample Product');
//         productId = response.body.id;
//     });

//     // it('should get a product by ID', async () => {
//     //     const response = await request(app)
//     //         .get(`/api/v1/products/${productId}`)
//     //         .set('Authorization', `Bearer ${authToken}`);

//     //     expect(response.status).toBe(200);
//     //     expect(response.body).toHaveProperty('name', 'Sample Product');
//     // });

//     // it('should update a product', async () => {
//     //     const response = await request(app)
//     //         .put(`/api/v1/products/${productId}`)
//     //         .set('Authorization', `Bearer ${authToken}`)
//     //         .send({
//     //             name: 'Updated Product',
//     //             description: 'This is an updated product',
//     //             price: 29.99,
//     //             categoryId: 1,
//     //             inventoryCount: 150,
//     //         });

//     //     expect(response.status).toBe(200);
//     //     expect(response.body).toHaveProperty('name', 'Updated Product');
//     // });

//     // it('should delete a product', async () => {
//     //     const response = await request(app)
//     //         .delete(`/api/v1/products/${productId}`)
//     //         .set('Authorization', `Bearer ${authToken}`);

//     //     expect(response.status).toBe(204); // No Content
//     // });

//     // it('should get all products', async () => {
//     //     const response = await request(app)
//     //         .get('/api/v1/products')
//     //         .set('Authorization', `Bearer ${authToken}`);

//     //     expect(response.status).toBe(200);
//     //     expect(response.body).toBeInstanceOf(Array);
//     // });
// });

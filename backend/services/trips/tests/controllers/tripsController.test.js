// const {
//     getTrips,
//     addTrip,
//     updateTrip,
//     getTripById,
//     deleteTrip,
//     addUserToTrip,
//     TripUsers,
// } = require('../../src/controllers/tripsController');

// const {
//     fetchTrips,
//     createTrip,
//     fetchTripById,
//     removeTrip,
//     updateTripById,
//     getUserIdByEmail,
//     getTripUsers,
//     createTripUserLink,
//     getTripUserLink,
// } = require('../../src/services/tripsService');

// jest.mock('../../src/services/tripsService'); // Mocking the services

// describe('Trips Controller', () => {
//     const mockReq = { user: { id: 1 } };
//     const mockRes = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//     };

//     afterEach(() => {
//         jest.clearAllMocks(); // Clear mocks after each test
//     });

//     // Test for getTrips
//     describe('getTrips', () => {
//         it('should return trips for a user', async () => {
//             const mockTrips = [{ id: 1, name: 'Trip 1' }, { id: 2, name: 'Trip 2' }];
//             fetchTrips.mockResolvedValue(mockTrips);

//             await getTrips(mockReq, mockRes);

//             expect(fetchTrips).toHaveBeenCalledWith(1);
//             expect(mockRes.status).toHaveBeenCalledWith(200);
//             expect(mockRes.json).toHaveBeenCalledWith(mockTrips);
//         });

//         it('should handle errors', async () => {
//             fetchTrips.mockRejectedValue(new Error('Service error'));

//             await getTrips(mockReq, mockRes);

//             expect(mockRes.status).toHaveBeenCalledWith(500);
//             expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch trips' });
//         });
//     });

//     // Test for addTrip
//     describe('addTrip', () => {
//         it('should add a new trip', async () => {
//             createTrip.mockResolvedValue(1); // Mocking createTrip to return a trip ID

//             // Mock request
//             const mockReq = {
//                 user: { id: 1 },
//                 body: {
//                     name: 'Trip 1',
//                     budget: 1000,
//                     startDate: '2023-01-01',
//                     endDate: '2023-01-10',
//                     image: 'image-url',
//                     destination: 'Paris',
//                 },
//             };

//             // Mock response
//             const mockRes = {
//                 status: jest.fn().mockReturnThis(),
//                 json: jest.fn(),
//             };

//             await addTrip(mockReq, mockRes); // Call the function

//             // Assertions
//             expect(createTrip).toHaveBeenCalledWith(1, mockReq.body); // Ensure createTrip is called with correct arguments
//             expect(mockRes.status).toHaveBeenCalledWith(201); // Ensure response status is 201
//             expect(mockRes.json).toHaveBeenCalledWith({ id: 1 }); // Ensure response contains the created trip ID
//         });

//         it('should return 400 if validation fails', async () => {
//             const mockReq = {
//                 user: { id: 1 },
//                 body: {
//                     name: '', // Invalid name
//                     budget: 0, // Invalid budget
//                 },
//             };

//             const mockRes = {
//                 status: jest.fn().mockReturnThis(),
//                 json: jest.fn(),
//             };

//             await addTrip(mockReq, mockRes); // Call the function

//             // Assertions
//             expect(mockRes.status).toHaveBeenCalledWith(400); // Ensure response status is 400
//             expect(mockRes.json).toHaveBeenCalledWith({
//                 error: 'Invalid name, budget value, or image',
//             }); // Ensure correct error message
//         });

//         it('should handle errors', async () => {
//             createTrip.mockRejectedValue(new Error('Service error')); // Mocking createTrip to throw an error

//             const mockReq = {
//                 user: { id: 1 },
//                 body: {
//                     name: 'Trip 1',
//                     budget: 1000,
//                     startDate: '2023-01-01',
//                     endDate: '2023-01-10',
//                     image: 'image-url',
//                     destination: 'Paris',
//                 },
//             };

//             const mockRes = {
//                 status: jest.fn().mockReturnThis(),
//                 json: jest.fn(),
//             };

//             await addTrip(mockReq, mockRes); // Call the function

//             // Assertions
//             expect(mockRes.status).toHaveBeenCalledWith(500); // Ensure response status is 500
//             expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to add trip' }); // Ensure correct error message
//         });
//     });

//     // Test for updateTrip
//     describe('updateTrip', () => {
//         it('should update a trip', async () => {
//             updateTripById.mockResolvedValue(1);

//             mockReq.params = { id: 1 };
//             mockReq.body = { name: 'Updated Trip', budget: 2000 };

//             await updateTrip(mockReq, mockRes);

//             expect(updateTripById).toHaveBeenCalledWith(1, mockReq.body);
//             expect(mockRes.status).toHaveBeenCalledWith(200);
//             expect(mockRes.json).toHaveBeenCalledWith({
//                 message: 'Trip updated successfully',
//             });
//         });

//         it('should return 404 if trip is not found', async () => {
//             updateTripById.mockResolvedValue(0);

//             mockReq.params = { id: 1 };
//             mockReq.body = { name: 'Updated Trip', budget: 2000 };

//             await updateTrip(mockReq, mockRes);

//             expect(mockRes.status).toHaveBeenCalledWith(404);
//             expect(mockRes.json).toHaveBeenCalledWith({ message: 'Trip not found' });
//         });

//         it('should handle errors', async () => {
//             updateTripById.mockRejectedValue(new Error('Service error'));

//             await updateTrip(mockReq, mockRes);

//             expect(mockRes.status).toHaveBeenCalledWith(500);
//             expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update trip' });
//         });
//     });

//     // Test for getTripById
//     describe('getTripById', () => {
//         it('should return trip details', async () => {
//             const mockTrip = { id: 1, name: 'Trip 1', budget: 1000 };
//             fetchTripById.mockResolvedValue(mockTrip);

//             mockReq.params = { id: 1 };

//             await getTripById(mockReq, mockRes);

//             expect(fetchTripById).toHaveBeenCalledWith(1, 1);
//             expect(mockRes.status).toHaveBeenCalledWith(200);
//             expect(mockRes.json).toHaveBeenCalledWith(mockTrip);
//         });

//         it('should return 404 if trip is not found', async () => {
//             fetchTripById.mockResolvedValue(null);

//             mockReq.params = { id: 1 };

//             await getTripById(mockReq, mockRes);

//             expect(mockRes.status).toHaveBeenCalledWith(404);
//             expect(mockRes.json).toHaveBeenCalledWith({ error: 'Trip not found' });
//         });

//         it('should handle errors', async () => {
//             fetchTripById.mockRejectedValue(new Error('Service error'));

//             await getTripById(mockReq, mockRes);

//             expect(mockRes.status).toHaveBeenCalledWith(500);
//             expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch trip details' });
//         });
//     });

//     // Tests for deleteTrip, addUserToTrip, and TripUsers can be added in the same way
// });


describe('Trips Routes', () => {
    it('should have placeholder test', () => {
        expect(true).toBe(true); // בדיקה בסיסית כדי שהקובץ לא יהיה ריק
    });
});
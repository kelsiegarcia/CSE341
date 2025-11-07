// swagger/swagger.js
const swaggerAutogen = require('swagger-autogen')();

const isProd = process.env.NODE_ENV === 'production';

const doc = {
  swagger: '2.0',
  info: {
    title: 'Event Scheduler API',
    description: 'A simple Express API for creating and managing events',
    version: '1.0.0',
  },
  host: isProd ? 'cse341-webservices-zcob.onrender.com' : 'localhost:8080',
  basePath: '/events',
  schemes: isProd ? ['https'] : ['http'],
  paths: {
    '/': {
      get: {
        description: 'Get all events',
        responses: {
          200: { description: 'OK' },
          500: { description: 'Internal Server Error' },
        },
      },
      post: {
        description: 'Create a new event',
        consumes: ['application/json'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['title', 'date', 'location'],
              properties: {
                title: { type: 'string', example: 'Community Cleanup' },
                description: { type: 'string', example: 'Join us for a Saturday morning cleanup!' },
                date: { type: 'string', example: '2025-11-05T09:00:00Z' },
                location: { type: 'string', example: 'Ala Moana Beach Park' },
              },
            },
          },
        ],
        responses: {
          201: { description: 'Created' },
          400: { description: 'Bad Request' },
        },
      },
    },
    '/{id}': {
      get: {
        description: 'Get an event by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
        ],
        responses: {
          200: { description: 'OK' },
          404: { description: 'Not Found' },
        },
      },
      put: {
        description: 'Update an event by ID',
        consumes: ['application/json'],
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['title', 'date', 'location'],
              properties: {
                title: { type: 'string', example: 'Updated Car Wash Day' },
                description: { type: 'string', example: 'Now includes refreshments and music' },
                date: { type: 'string', example: '2025-11-20T10:00:00.000Z' },
                location: { type: 'string', example: 'Kahala Mall Parking Lot' },
              },
            },
          },
        ],
        responses: {
          204: { description: 'Event updated successfully' },
          400: { description: 'Invalid input or validation error' },
          404: { description: 'Event not found' },
        },
      },
      delete: {
        description: 'Delete an event by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
        ],
        responses: {
          200: { description: 'Event deleted successfully' },
          404: { description: 'Not Found' },
        },
      },
    },
  },
};

const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['./routes/events.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully.');
});



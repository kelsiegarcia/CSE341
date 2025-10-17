// swagger

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Event Scheduler API',
    description: 'API for managing events',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['./server.js'];

// Generate swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated');
});     

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../server'); // Your server file
});
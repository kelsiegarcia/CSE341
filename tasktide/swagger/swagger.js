// swagger

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Event Scheduler API',
    description: 'API for managing events',
  },
  host: 'localhost:8080',
  schemes: ['http'],

  definitions: {
    Event: {
      title: 'Community Beach Cleanup',
      description: 'Join us for a Saturday morning to keep the beach clean!',
      date: '2025-11-05T09:00:00Z',
      location: 'Ala Moana Beach Park',
      category: 'Volunteer',
      capacity: 50,
      organizerId: '652fe97ac51f5b9a278f003c'
    }
  }
};

const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['./routes/events.js'];

// Generate swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated');
});     

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../server'); // Your server file
});
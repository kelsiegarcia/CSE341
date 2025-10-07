const swaggerAutogen = require('swagger-autogen')();

// Documentation configuration
const doc = {
  info: {
    title: 'Contacts API',
    description: 'A simple Express Contacts API',
  },
  host:
    process.env.NODE_ENV === 'production'
      ? 'your-app-name.onrender.com'
      : 'localhost:8080',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  basePath: '/contacts',
};

// Output file and endpoint files
const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/contacts.js'];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});


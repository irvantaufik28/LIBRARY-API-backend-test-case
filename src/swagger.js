/* eslint-disable no-console */
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const borrowSchemaReq = require('./docs/schema/borrow');

const doc = {
  info: {
    title: 'PERPUSTAKAAN',
    description:
      'API ecommerce App for project platinum for customer, create by Maju Jaya',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'irvantaufik28@gmail.com',
    },
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  definitions: {
    bodyAddBorrow: borrowSchemaReq.addBorrow,
  },
};

const outputFile = './docs/docs.json';
const endpointsFiles = [
  './routes/auth.js',
  './routes/books.js',
  './routes/borrow.js',
  './routes/member.js',
];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc).then((r) => {
  console.log(r);
});

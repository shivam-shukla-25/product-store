const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Store API',
      version: '1.0.0',
      description: 'RESTful API for managing products in an online store',
      contact: { name: 'API Support', email: 'support@productstore.com' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Wireless Headphones' },
            description: { type: 'string', example: 'High-quality noise-cancelling headphones' },
            price: { type: 'number', example: 99.99 },
            category: { type: 'string', example: 'electronics' },
            stock: { type: 'integer', example: 50 },
            sku: { type: 'string', example: 'WH-001' },
            imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
            isActive: { type: 'boolean', example: true },
            createdBy: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                pages: { type: 'integer' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);


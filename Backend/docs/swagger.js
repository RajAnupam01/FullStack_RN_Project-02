import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StackIt API",
      version: "1.0.0",
      description: `
      
      ## Demo Credentials

      You can use the following ready to use account to login:

     - Email: sonali@gmail.com     - Password: Password@123
     - Email: ravindra@gmail.com   - Password: Password@123
     - Email: manav@gmail.com      - Password: Password@123
     - Email: sonu@gmail.com       - Password: Password@123
      

      `,
    },

    servers: [
      {
        url: "http://localhost:1111",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./docs/*.js"],
};

export default swaggerJSDoc(options);
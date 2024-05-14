import fastify from "fastify"
import { FilesRoute } from "./routes/files";
import fastifyMultipart from "@fastify/multipart";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export const app = fastify({
  logger: false,
  ajv: {
    plugins: [require('@fastify/multipart').ajvFilePlugin]
  }
});



app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyMultipart, {
  attachFieldsToBody: true,
  sharedSchemaId: "#fastify-multipart",
})

app.register(swagger, {
  openapi: {
    info: {
      title: "AWS back-end",
      version: "1.0.0",
      description: "This is one back-end create for help me and dudu going to send images to CloudFlare or AWS",
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})
app.register(swaggerUI, {
  routePrefix: "/aws-docs",
})


app.register(FilesRoute)

app.listen({ port: Number(process.env.PORT || 3333) }).then(() => {
  console.log(`HTTP server running on port ${process.env.PORT}`)
});

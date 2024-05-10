import fastify from "fastify"
import { FilesRoute } from "./routes/files";
import fastifyMultipart from "@fastify/multipart";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyMultipart)
app.register(FilesRoute)

app.listen({ port: Number(process.env.PORT || 3333) }).then(() => {
  console.log(`HTTP server running on port ${process.env.PORT}`)
});

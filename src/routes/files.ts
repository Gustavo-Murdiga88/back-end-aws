import { FastifyInstance } from "fastify"
import { client } from "../lib/aws"
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod"


export async function FilesRoute(app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/files/:filename",
    schema: {
      params: z.object({
        filename: z.string()
      })
    },
    handler: async (request, reply) => {
      console.log(request.params)
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({
          message: "Please send a file"
        })
      }


      const buffer = await data.toBuffer();
      await client.putObject({
        Bucket: "images",
        Key: request.params.filename,
        Body: buffer,
      }).promise();

      return reply.status(201).send({ message: "File uploaded" })
    }
  })

} 
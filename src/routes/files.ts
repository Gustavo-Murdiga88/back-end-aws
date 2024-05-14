import { FastifyInstance } from "fastify";
import { client } from "../lib/aws";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function FilesRoute(app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/files/:filename",
    schema: {
      tags: ["Upload"],
      summary: 'Delete a file from CloudFlare R2 or AWS',
      params: z.object({
        filename: z.string(),
      }),
      consumes: ["multipart/form-data"],
      body: z.object({
        file: z.instanceof(Buffer)
      })
    },
    handler: async (request, reply) => {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({
          message: "Please send a file"
        })
      }


      const buffer = await data.toBuffer();
      await client.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: request.params.filename,
        Body: buffer,
      }).promise();

      return reply.status(201).send({ message: "File uploaded" })
    }
  });


  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/file/:filename/delete",
    schema: {
      tags: ["Upload"],
      summary: 'Delete a file from CloudFlare R2 or AWS',
      params: z.object({
        filename: z.string()
      })
    },
    handler: async (request, reply) => {
      const filename = request.params.filename;
      const response = await client.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
      }).promise();

      if (response.$response.error) {
        return reply.status(400).send({ message: response.$response.data })
      }

      return reply.status(200).send({
        message: `File ${filename} was deleted`,
      })
    }
  })

} 
import { FastifyInstance } from "fastify";
import { client } from "../lib/aws";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { MultipartFile } from "@fastify/multipart";

export async function FilesRoute(app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/files/:bucket/:filename",
    schema: {
      tags: ["Upload"],
      summary: 'Insert a file from CloudFlare R2 or AWS',
      params: z.object({
        filename: z.string(),
        bucket: z.string(),
      }),
      consumes: ["multipart/form-data"],
      body: z.custom<MultipartFile>(),
    },
    handler: async (request, reply) => {
      const data = request.body;

      if (!data.file) {
        return reply.status(400).send({
          message: "Please send a file"
        })
      }

      const buffer = data.file;
      await client.putObject({
        Bucket: request.params.bucket,
        Key: request.params.filename,
        Body: buffer,
      }).promise();

      return reply.status(201).send({ message: "File uploaded" })
    }
  });


  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/file/:bucket/:filename/delete",
    schema: {
      tags: ["Upload"],
      summary: 'Delete a file from CloudFlare R2 or AWS',
      params: z.object({
        filename: z.string(),
        bucket: z.string(),
      })
    },
    handler: async (request, reply) => {
      const filename = request.params.filename;
      const response = await client.deleteObject({
        Bucket: request.params.bucket,
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
import S3 from "aws-sdk/clients/s3"


export const client = new S3({
  endpoint: process.env.R2_PATH,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY,
  signatureVersion: 'v4',
});
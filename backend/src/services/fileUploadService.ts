import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../utils/logger';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const fileUploadService = {
  async generatePresignedUrl(fileName: string, fileType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `uploads/${Date.now()}-${fileName}`,
        ContentType: fileType
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return {
        signedUrl,
        fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`
      };
    } catch (error) {
      logger.error('Generate presigned URL error:', error);
      throw error;
    }
  }
};
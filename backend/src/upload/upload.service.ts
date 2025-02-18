import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
    private s3: S3;
    private bucketName: string;

    constructor() {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT as string),
            s3ForcePathStyle: true
        });

        this.bucketName = process.env.AWS_S3_BUCKET || '';
    }

    async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;

        const uploadParams: S3.Types.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };


        const result = await this.s3.upload(uploadParams).promise();
        return result.Location;
    }
}

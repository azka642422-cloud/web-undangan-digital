import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function config() {
  const endpoint=process.env.MEDIA_STORAGE_ENDPOINT,bucket=process.env.MEDIA_STORAGE_BUCKET,accessKeyId=process.env.MEDIA_STORAGE_ACCESS_KEY,secretAccessKey=process.env.MEDIA_STORAGE_SECRET_KEY;
  if(!endpoint||!bucket||!accessKeyId||!secretAccessKey) throw new Error('MEDIA_STORAGE_NOT_CONFIGURED');
  const url=new URL(endpoint);
  if(process.env.NODE_ENV==='production'&&url.protocol!=='https:') throw new Error('MEDIA_STORAGE_HTTPS_REQUIRED');
  return {endpoint:url.toString(),bucket,accessKeyId,secretAccessKey,region:process.env.MEDIA_STORAGE_REGION||'auto'};
}
function client(){const c=config();return {bucket:c.bucket,s3:new S3Client({endpoint:c.endpoint,region:c.region,forcePathStyle:process.env.MEDIA_STORAGE_FORCE_PATH_STYLE==='true',credentials:{accessKeyId:c.accessKeyId,secretAccessKey:c.secretAccessKey}})}}
export async function createQuarantineUploadUrl(objectKey:string,contentType:string,byteSize:number){const {s3,bucket}=client();return getSignedUrl(s3,new PutObjectCommand({Bucket:bucket,Key:`quarantine/${objectKey}`,ContentType:contentType,ContentLength:byteSize}),{expiresIn:300})}
export async function readQuarantinedObject(objectKey:string,maxBytes:number){const {s3,bucket}=client();const r=await s3.send(new GetObjectCommand({Bucket:bucket,Key:`quarantine/${objectKey}`}));if(!r.Body)throw new Error('MEDIA_OBJECT_EMPTY');const bytes=await r.Body.transformToByteArray();if(bytes.byteLength>maxBytes)throw new Error('MEDIA_OBJECT_TOO_LARGE');return bytes}
export async function deleteQuarantinedObject(objectKey:string){const {s3,bucket}=client();await s3.send(new DeleteObjectCommand({Bucket:bucket,Key:`quarantine/${objectKey}`}))}

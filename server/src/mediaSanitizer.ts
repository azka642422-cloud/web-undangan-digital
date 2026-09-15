import sharp from 'sharp';

const MAX_IMAGE_PIXELS=40_000_000;
export type SanitizedImage={bytes:Uint8Array;contentType:'image/jpeg'|'image/png'|'image/webp'};

export async function sanitizeImage(bytes:Uint8Array,contentType:string):Promise<SanitizedImage>{
  if(!['image/jpeg','image/png','image/webp'].includes(contentType))throw new Error('UNSUPPORTED_IMAGE_TYPE');
  const input=Buffer.from(bytes);
  const probe=sharp(input,{failOn:'error',limitInputPixels:MAX_IMAGE_PIXELS,animated:false});
  const metadata=await probe.metadata();
  if(!metadata.width||!metadata.height)throw new Error('INVALID_IMAGE_DIMENSIONS');
  if(metadata.pages&&metadata.pages>1)throw new Error('ANIMATED_IMAGE_NOT_ALLOWED');
  if(metadata.width*metadata.height>MAX_IMAGE_PIXELS)throw new Error('IMAGE_PIXEL_LIMIT_EXCEEDED');
  let pipeline=sharp(input,{failOn:'error',limitInputPixels:MAX_IMAGE_PIXELS,animated:false}).rotate();
  let output:Buffer;
  if(contentType==='image/jpeg')output=await pipeline.jpeg({quality:88,mozjpeg:true}).toBuffer();
  else if(contentType==='image/png')output=await pipeline.png({compressionLevel:9}).toBuffer();
  else output=await pipeline.webp({quality:88}).toBuffer();
  if(output.length===0||output.length>8*1024*1024)throw new Error('SANITIZED_IMAGE_SIZE_INVALID');
  return{bytes:new Uint8Array(output),contentType:contentType as SanitizedImage['contentType']};
}

import { parseBuffer } from 'music-metadata';

const allowed = new Map<string,Set<string>>([
  ['audio/mpeg',new Set(['MPEG'])],
  ['audio/mp4',new Set(['M4A','M4B','M4P','M4V','MP4'])],
  ['audio/ogg',new Set(['Ogg'])]
]);

export async function validateAudio(bytes:Uint8Array,declaredType:string){
  const containers=allowed.get(declaredType);
  if(!containers||bytes.byteLength===0||bytes.byteLength>15*1024*1024)return false;
  try{
    const metadata=await parseBuffer(Buffer.from(bytes),{mimeType:declaredType,size:bytes.byteLength},{duration:true,skipCovers:true});
    const container=metadata.format.container;
    if(!container||![...containers].some(x=>container.toUpperCase().includes(x.toUpperCase())))return false;
    if(!metadata.format.codec||metadata.format.duration===undefined||!Number.isFinite(metadata.format.duration)||metadata.format.duration<=0)return false;
    return true;
  }catch{return false}
}

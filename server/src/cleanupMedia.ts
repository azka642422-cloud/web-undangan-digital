import 'dotenv/config';
import { deleteQuarantinedObject } from './mediaStorage.js';
import { getStaleQuarantinedUploads, markStaleUploadDeleted, storageConfigured } from './uploads.js';

async function main(){
  if(!storageConfigured())throw new Error('MEDIA_STORAGE_NOT_CONFIGURED');
  const rows=await getStaleQuarantinedUploads(24,100);
  let deleted=0,failed=0;
  for(const row of rows){
    try{
      await deleteQuarantinedObject(row.objectKey);
      if(await markStaleUploadDeleted(row.id))deleted++;
    }catch{failed++}
  }
  console.log(JSON.stringify({ok:failed===0,scanned:rows.length,deleted,failed}));
  if(failed>0)process.exitCode=1;
}
main().catch(e=>{console.error(e instanceof Error?e.message:'MEDIA_CLEANUP_FAILED');process.exitCode=1});

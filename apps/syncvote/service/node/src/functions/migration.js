// npm install @supabase/supabase-js@1
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const OLD_PROJECT_URL = process.env.SUPABASE_URL;
const OLD_PROJECT_SERVICE_KEY = process.env.SUPABASE_KEY;

const NEW_PROJECT_URL = process.env.SUPABASE_URL_TEST;
const NEW_PROJECT_SERVICE_KEY = process.env.SUPABASE_KEY_TEST;

(async () => {
  const oldSupabaseRestClient = createClient(
    OLD_PROJECT_URL,
    OLD_PROJECT_SERVICE_KEY,
    {
      db: {
        schema: 'public',
      },
    }
  );
  const oldSupabaseClient = createClient(
    OLD_PROJECT_URL,
    OLD_PROJECT_SERVICE_KEY
  );
  const newSupabaseClient = createClient(
    NEW_PROJECT_URL,
    NEW_PROJECT_SERVICE_KEY
  );

  // make sure you update max_rows in postgrest settings if you have a lot of objects
  // or paginate here
  const { data: oldObjects, error } = await oldSupabaseRestClient
    .from('mission')
    .select();
  if (error) {
    console.log('error getting objects from old bucket');
    throw error;
  }

  for (const objectData of oldObjects) {
    console.log(`moving ${objectData.id}`);
    console.log(objectData.bucket_id);
    // try {
    //   const { data, error: downloadObjectError } =
    //     await oldSupabaseClient.storage
    //       .from(objectData.bucket_id)
    //       .download(objectData.name);
    //   if (downloadObjectError) {
    //     throw downloadObjectError;
    //   }
    //   console.log(1);

    //   const { _, error: uploadObjectError } = await newSupabaseClient.storage
    //     .from(objectData.bucket_id)
    //     .upload(objectData.name, data, {
    //       upsert: true,
    //       contentType: objectData.metadata.mimetype,
    //       cacheControl: objectData.metadata.cacheControl,
    //     });
    //   console.log(2);
    //   if (uploadObjectError) {
    //     throw uploadObjectError;
    //   }
    // } catch (err) {
    //   console.log('error moving ', objectData);
    //   console.log(err);
    // }
  }
})();

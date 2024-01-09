const { supabase } = require('../../configs/supabaseClient');

const hello_world = async () => {
  const { data, error } = await supabase.functions.invoke('hello-world', {
    body: {
      mission: {
        id: 9999,
        data: { checkpoints: [{ id: 1 }, { id: 2 }] },
      },
    },
  });

  console.log(data);
};

hello_world();

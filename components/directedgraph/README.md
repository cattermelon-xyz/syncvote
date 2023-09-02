We can test how a component works. Now, I will walk you through the components/DirectedGraph directory.

+ Step 1: Ensure that the directory has all the necessary CSS configurations installed, such as `index.css`, `tailwind.config.cjs`, and `postcss.config`, if the component utilizes tailwind CSS. If you want to use code from another module, add the module name to use in `dependencies`. In this example I need to use the `single-vote` module

+ Step 2: Prepare mock data in `src/mockData`.

+ Step 3: Import the code and run it in `src/App.tsx`.

*Note*: In some cases, you might need to add the .env.local file if you use functions from the utils module. This is especially true when these functions require environment variables. For instance, the `getImageUrl` function necessitates the `VITE_SUPABASE_URL` environment variable

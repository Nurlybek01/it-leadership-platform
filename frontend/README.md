# Leadcraft frontend

## Supabase auth

1. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key. The frontend accepts both `VITE_SUPABASE_*` and `EXPO_PUBLIC_SUPABASE_*` variable names.
2. In Supabase Dashboard > Authentication > Providers, enable **Email** and **GitHub**.
3. Configure GitHub OAuth with the callback URL shown in Supabase Dashboard. Add the deployed frontend URL and `http://localhost:5173` to Supabase Authentication URL Configuration.

The app supports email registration/login and GitHub OAuth. New email users receive the selected role and display name in `user_metadata`; email confirmation follows the Supabase project setting.

After successful authentication, users are redirected to `/dashboard`. The dashboard includes progress, current module, and the next challenge.

To enable student groups, run [`supabase/migrations/20261119110000_student_groups.sql`](./supabase/migrations/20261119110000_student_groups.sql) once in the Supabase SQL Editor. The migration refreshes the PostgREST schema cache. If the migration was already applied but its functions are still not found, run `NOTIFY pgrst, 'reload schema';` in the SQL Editor. Students can create groups and add existing student accounts by email; each group is limited to five people, including its creator.

## Learning modules

Module content lives in `src/entities/module/data/modules/`, with one JSON file per module. Add a unique `id`, a display `order`, and prerequisite module IDs; the catalog loads these files automatically. Keep the content shape in `src/entities/module/model/types.ts`: Markdown theory, videos and references, quiz questions, GitHub practice checks, and achievement IDs. A module with no prerequisites is available first; dependent modules are displayed locked until progress is connected.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

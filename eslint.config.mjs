import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  // 1. Matikan ESLint di folder hasil build & node_modules
  {
    ignores: ['dist', 'node_modules', 'build', 'coverage'],
  },

  // 2. Gunakan aturan bawaan standar Javascript & TypeScript
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Aturan Kustom/Tambahan kita
  {
    rules: {
      // FIX: Menambahkan pola regex agar mengabaikan variabel dengan awalan (_)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Hindari penggunaan tipe 'any'
      'no-console': 'off', // Di backend, kita masih butuh console.log untuk debugging
    },
  },

  // 4. Prettier WAJIB ditaruh di paling bawah agar bisa menimpa aturan yang bentrok
  prettierConfig
)

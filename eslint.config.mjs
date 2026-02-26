import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    // Recommended base rules
    js.configs.recommended,

    // Your JavaScript files
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs', // You're using require/module.exports
            globals: {
                ...globals.node, // ✅ Node.js globals (require, module, __dirname, etc.)
            },
        },
        rules: {
            // Your essentials
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-var': 'error',
            'prefer-const': 'warn',
            eqeqeq: ['error', 'always'],
            'no-console': 'off', // Backend
        },
    },

    // Prettier (disables conflicting ESLint rules)
    eslintConfigPrettier,
];

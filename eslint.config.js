// eslint.config.js
const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
    {
        files: ['lib/**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {},
        },
        plugins: {
            '@typescript-eslint': ts,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...ts.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off",
        },
    }
];

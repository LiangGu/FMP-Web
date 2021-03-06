module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        dict: true,
        AMap: true,
        require: true,
        process: true,
        BMap: true,
        apiConfig: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: [
        'vue'
    ],
    rules: {
        'no-console': 'off',
        'no-unused-vars': 'off'
    }
};

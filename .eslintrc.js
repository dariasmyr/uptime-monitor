module.exports = {
    'env': {
        'browser': false,
        'node': true,
        'commonjs': true,
        'es2021': true
    },
    'root': true,
    'extends': [
        'eslint:recommended',
        'plugin:sonarjs/recommended',
        '@jetbrains',
        '@jetbrains/eslint-config/node'
    ],
    'overrides': [],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'plugins': [
        'sonarjs'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};

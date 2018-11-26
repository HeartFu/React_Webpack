// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: 'airbnb',
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': 0,
    'semi': [2, 'never'],
    'indent': [2, 4],
    "new-cap": [2, { "newIsCap": true, "capIsNew": false }],
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/first': 0,
    'react/jsx-indent': [2, 4],
    'react/jsx-indent-props': [2, 4],
    'react/jsx-filename-extension': ['js', 'jsx'],
    'react/no-danger': 0,
    'linebreak-style': 0,
    'react/prop-types': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'max-len': 0
  }
}

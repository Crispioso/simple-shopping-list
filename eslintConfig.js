module.exports = {
  extends: 'react-app',
  plugins: ['prettier', 'react-hooks'],
  rules: {
    'no-debugger': 1,
    'prettier/prettier': 0, // disabled for now while teams approve changes
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MethodDefinition[kind="get"]',
        message: 'Please don’t use getters and setters',
      },
      {
        selector: 'MethodDefinition[kind="set"]',
        message: 'Please don’t use getters and setters',
      },
    ],
    'react/require-render-return': 0,
    'jsx-a11y/href-no-hash': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/accessible-emoji': 0,
    'react/jsx-no-target-blank': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useMediaConsumer)',
      },
    ],
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
}

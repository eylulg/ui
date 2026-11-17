export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    // semantic-release writes long release notes into its own commit body.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};

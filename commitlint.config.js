export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // semantic-release writes long release notes into its own commit body.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};

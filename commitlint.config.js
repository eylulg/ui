export default {
  extends: ['@commitlint/config-conventional'],
  // Dependabot writes "Bump x from a to b" and cannot be told to lowercase it.
  // Its pull requests are squash-merged under a conventional subject anyway.
  ignores: [(message) => /^Signed-off-by: dependabot\[bot\]/m.test(message)],
  rules: {
    'header-max-length': [2, 'always', 72],
    // semantic-release writes long release notes into its own commit body.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};

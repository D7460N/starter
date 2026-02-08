function logBoundary(status, boundary, scope = 'pipeline') {
  status
    ? console.log(`${scope}: passed ${boundary}`)
    : console.error(`${scope}: stopped ${boundary}`);
}

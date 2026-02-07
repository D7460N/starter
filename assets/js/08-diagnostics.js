function logBoundary(status, boundary) {
  status
    ? console.log(`processPayload: passed ${boundary}`)
    : console.error(`processPayload: stopped at ${boundary}`);
}

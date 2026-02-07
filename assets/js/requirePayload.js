function requirePayload(payload, message = 'Payload missing or invalid') {
  if (payload == null) {
    console.error(message);
    return null;
  }
  return payload;
}

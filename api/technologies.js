function setCors(res) {
  const allowedOrigins = [
    "https://www.znerationtech.com",
    "https://znerationtech.com"
  ];

  const origin = res.req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

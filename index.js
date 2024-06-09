const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/api/session", async (req, res) => {
  const sessionToken = req.headers["session-token"]; // 从请求头中获取 session-token

  const url = "https://chatgpt.com/api/auth/session";
  const headers = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "max-age=0",
    "if-none-match": 'W/"6q5gpgii7k1fd"',
    priority: "u=0, i",
    "sec-ch-ua":
      '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    cookie: `__Secure-next-auth.session-token=${sessionToken}`,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      referrerPolicy: "strict-origin-when-cross-origin",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    const responseSessionToken = response.headers.get(
      "__Secure-next-auth.session-token",
    );

    res.json({ data: data, sessionToken: responseSessionToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("FREE AI!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

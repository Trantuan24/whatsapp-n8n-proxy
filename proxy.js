const express = require('express');
const request = require('request');

const app = express();
const PORT = 3000; // Có thể đổi nếu muốn

// URL path đúng với webhook meta đã cấu hình (KHÔNG sửa)
const WEBHOOK_PATH = '/webhook/webhook/whatsapp-urls';

// Endpoint nhận GET xác thực trên n8n
const N8N_GET = 'https://n8n.phuongndam.site/webhook/whatsapp-verify-abcxy';

// Endpoint nhận POST message trên n8n
const N8N_POST = 'https://n8n.phuongndam.site/webhook/whatsapp-post';

app.use(express.json({ type: '*/*' }));

app.all(WEBHOOK_PATH, (req, res) => {
  if (req.method === 'GET') {
    request(
      { url: N8N_GET, qs: req.query, method: 'GET' },
      (error, response, body) => {
        if (error) return res.status(500).send('Proxy error');
        res.status(response.statusCode).send(body);
      }
    );
  } else if (req.method === 'POST') {
    request(
      {
        url: N8N_POST,
        method: 'POST',
        json: req.body,
        headers: { ...req.headers },
      },
      (error, response, body) => {
        if (error) return res.status(500).send('Proxy error');
        res.status(response.statusCode).send(body);
      }
    );
  } else {
    res.status(405).send('Method Not Allowed');
  }
});

app.listen(PORT, () => {
  console.log('Proxy server listening on port', PORT);
});



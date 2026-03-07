import http from "http";

const PORT = 3000;

// ===== DATA STATIS =====
const users = [
  { id: 1, name: "Khairunnisa" },
  { id: 2, name: "Floome" },
  { id: 3, name: "4shoboiz" },
];

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Keyboard" },
];

// ===== HELPER =====
function sendJSON(res: http.ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendHTML(res: http.ServerResponse, body: string, status = 200) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
  <html>
    <head><meta charset="UTF-8"></head>
    <body>${body}</body>
  </html>`);
}

// ===== SERVER =====
const server = http.createServer(async (req, res) => {
  const url = req.url ?? "/";
  const method = req.method ?? "GET";

  // =========================================================
  // LATIHAN 3: Middleware - hitung waktu eksekusi per request
  // =========================================================
  const startTime = performance.now();

  await handleRequest(url, method, req, res);

  const duration = (performance.now() - startTime).toFixed(2);
  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${url} (${duration}ms)`);
});

server.listen(PORT, () => {
  console.log(`🚀 Server Node.js berjalan di http://localhost:${PORT}`);
});

// ===== HANDLER UTAMA =====
async function handleRequest(
  url: string,
  method: string,
  req: http.IncomingMessage,
  res: http.ServerResponse
) {

  // GET /
  if (url === "/" && method === "GET") {
    return sendHTML(res, "<h1>🏠 Halaman Utama (Node)</h1><p>Selamat datang di server Node.js + TypeScript!</p>");
  }

  // GET /about
  if (url === "/about" && method === "GET") {
    return sendHTML(res, "<h1>📄 Tentang Kami (Node)</h1><p>Routing manual dengan Node sangat mudah!</p>");
  }

  // GET /api/users
  if (url === "/api/users" && method === "GET") {
    return sendJSON(res, users);
  }

  // POST /api/users
  if (url === "/api/users" && method === "POST") {
    try {
      const body = await readBody(req);
      console.log("Body diterima:", body);
      return sendJSON(res, { message: "User berhasil dibuat (Node)" }, 201);
    } catch {
      return sendJSON(res, { error: "Body tidak valid" }, 400);
    }
  }

  // =========================================================
  // LATIHAN 1: Rute baru GET /api/products
  // Mengembalikan daftar produk dalam format JSON
  // =========================================================
  if (url === "/api/products" && method === "GET") {
    return sendJSON(res, products);
  }

  // =========================================================
  // LATIHAN 1: Rute baru POST /api/products
  // Menerima data produk baru dan mengembalikan pesan sukses
  // =========================================================
  if (url === "/api/products" && method === "POST") {
    try {
      const body = await readBody(req);
      console.log("Produk diterima:", body);
      return sendJSON(res, { message: "Produk berhasil ditambahkan!", data: body }, 201);
    } catch {
      return sendJSON(res, { error: "Body tidak valid" }, 400);
    }
  }

  // =========================================================
  // LATIHAN 2: Parameter dinamis GET /api/users/:id
  // Menggunakan regex untuk menangkap angka di akhir path
  // Contoh: /api/users/1, /api/users/2
  // =========================================================
  const userMatch = url.match(/^\/api\/users\/(\d+)$/);
  if (userMatch && method === "GET") {
    const id = parseInt(userMatch[1]);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return sendJSON(res, { error: `User dengan ID ${id} tidak ditemukan` }, 404);
    }

    return sendJSON(res, user);
  }

  // 404 fallback
  return sendHTML(res, "<h1>❌ 404 - Halaman Tidak Ditemukan (Node)</h1>", 404);
}

// ===== HELPER: Baca body dari request =====
function readBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("JSON tidak valid"));
      }
    });
    req.on("error", reject);
  });
}
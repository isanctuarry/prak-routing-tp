import http from 'http';

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Selamat datang di halaman Home" }));
    }
    else if (url === "/about" && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Halaman About" }));
    }
    else if (url === "/user" && method === "GET") {
        const id = 1;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `User ID: ${id}` }));
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Routing tidak ditemukan" }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
// ==========================================================
// Topik 35: Toko Mainan (Resource: /toys)
// Mahasiswa: Mas'ud Suhail
// Status: Final - Siap Deploy ke Vercel
// Tugas 1 RESTful API Express - Mas'ud Suhail (SI5B)
// ==========================================================


const express = require("express");
const app = express();

// Middleware untuk memparsing JSON
app.use(express.json());

// 2. Data Awal di Memori & Variabel nextId
let toys = [
  {
    id: 1,
    nama: "Balok Susun Kayu",
    kategoriUsia: "4-7",
    bahan: "kayu",
    harga: 95000,
    stok: 15,
  },
  {
    id: 2,
    nama: "Boneka Kelinci Lembut",
    kategoriUsia: "0-3",
    bahan: "katun",
    harga: 65000,
    stok: 20,
  },
  {
    id: 3,
    nama: "Robot Rakit Elektronik",
    kategoriUsia: "8+",
    bahan: "plastik & logam",
    harga: 185000,
    stok: 8,
  },
];

let nextId = 4;

// 3. GET / — Info API dalam format JSON
app.get("/", (req, res) => {
  res.json({
    nama: "Mas'ud Suhail",
    npm: "2428240164",
    topik: "Topik 35 - Toko Mainan",
    endpoints: [
      {
        method: "GET",
        path: "/toys",
        deskripsi: "Ambil semua data mainan / filter via query kategoriUsia",
      },
      {
        method: "GET",
        path: "/toys/:id",
        deskripsi: "Ambil satu data mainan berdasarkan ID",
      },
      {
        method: "POST",
        path: "/toys",
        deskripsi: "Tambah data mainan baru",
      },
      {
        method: "PUT",
        path: "/toys/:id",
        deskripsi: "Perbarui seluruh data mainan berdasarkan ID",
      },
      {
        method: "DELETE",
        path: "/toys/:id",
        deskripsi: "Hapus data mainan berdasarkan ID",
      },
    ],
  });
});

// 4. GET /toys & GET /toys?kategoriUsia=nilai — Ambil semua data atau filter via query string
app.get("/toys", (req, res) => {
  const { kategoriUsia } = req.query;

  if (kategoriUsia) {
    const hasilFilter = toys.filter(
      (t) => t.kategoriUsia.toLowerCase() === kategoriUsia.toLowerCase()
    );
    return res.status(200).json(hasilFilter);
  }

  res.status(200).json(toys);
});

// 5. GET /toys/:id — Ambil satu mainan berdasarkan ID
app.get("/toys/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const toy = toys.find((t) => t.id === id);

  if (!toy) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  res.status(200).json(toy);
});

// 6. POST /toys — Tambah mainan baru
app.post("/toys", (req, res) => {
  const { nama, kategoriUsia, bahan, harga, stok } = req.body;
  const kategoriValid = ["0-3", "4-7", "8+"];

  // Validasi field wajib
  if (!nama || !kategoriUsia || harga === undefined || harga === null) {
    return res.status(400).json({
      status: "error",
      message: "Field nama, kategoriUsia, dan harga wajib diisi",
      data: null,
    });
  }

  // Validasi nilai pilihan enum
  if (!kategoriValid.includes(kategoriUsia)) {
    return res.status(400).json({
      status: "error",
      message: 'kategoriUsia harus salah satu dari: "0-3", "4-7", atau "8+"',
      data: null,
    });
  }

  const baru = {
    id: nextId++,
    nama,
    kategoriUsia,
    bahan: bahan !== undefined ? bahan : "",
    harga: Number(harga),
    stok: stok !== undefined ? Number(stok) : 0,
  };

  toys.push(baru);

  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru,
  });
});

// 7. PUT /toys/:id — Perbarui seluruh data mainan (penggantian penuh)
app.put("/toys/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = toys.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  const { nama, kategoriUsia, bahan, harga, stok } = req.body;
  const kategoriValid = ["0-3", "4-7", "8+"];

  if (!nama || !kategoriUsia || harga === undefined || harga === null) {
    return res.status(400).json({
      status: "error",
      message: "Field nama, kategoriUsia, dan harga wajib diisi",
      data: null,
    });
  }

  if (!kategoriValid.includes(kategoriUsia)) {
    return res.status(400).json({
      status: "error",
      message: 'kategoriUsia harus salah satu dari: "0-3", "4-7", atau "8+"',
      data: null,
    });
  }

  toys[index] = {
    id,
    nama,
    kategoriUsia,
    bahan: bahan !== undefined ? bahan : "",
    harga: Number(harga),
    stok: stok !== undefined ? Number(stok) : 0,
  };

  res.status(200).json({
    status: "success",
    message: "Data berhasil diperbarui",
    data: toys[index],
  });
});

// 8. DELETE /toys/:id — Hapus mainan berdasarkan ID
app.delete("/toys/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = toys.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  toys.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: `Data mainan dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// 9. Middleware catch-all 404 untuk endpoint tak dikenal
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

// 10. Konfigurasi Port & Ekspor untuk Deploy Vercel Serverless
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
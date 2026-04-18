const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const app = express();

/* ==================================================
   1. CONFIGURAÇÕES E MIDDLEWARES
================================================== */
app.use(cors());
app.use(express.json());

// 🔥 SERVE TODOS OS ARQUIVOS DA PASTA ATUAL (HTML, CSS, JS)
app.use(express.static(__dirname));

// Servir pasta de uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==================================================
   2. CONEXÃO COM O BANCO DE DADOS
================================================== */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Cadastro",
  password: "89562300",
  port: 5432,
});

/* ==================================================
   3. CONFIGURAÇÃO DO MULTER (UPLOAD)
================================================== */

// Garante que a pasta uploads exista
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ==================================================
   4. ROTAS
================================================== */

// 🔥 Página inicial será login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

/* =========================
   CADASTRO DE USUÁRIO
========================= */
app.post("/usuarios", upload.single("foto"), async (req, res) => {
  try {
    let { nome, senha, funcao_social } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (Array.isArray(nome)) nome = nome[0];
    if (Array.isArray(senha)) senha = senha[0];
    if (Array.isArray(funcao_social)) funcao_social = funcao_social[0];

    if (!nome || !senha || !funcao_social) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const usuarioExistente = await pool.query(
      "SELECT id FROM usuarios WHERE nome = $1",
      [nome]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ erro: "Usuário já existe." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome, senha, funcao_social, foto_perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, funcao_social, foto_perfil`,
      [nome, senhaHash, funcao_social, foto]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("ERRO NO CADASTRO:", err);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/login", async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ erro: "Nome e senha são obrigatórios." });
    }

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nome = $1",
      [nome]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        funcao_social: usuario.funcao_social,
        foto_perfil: usuario.foto_perfil
      }
    });

  } catch (err) {
    console.error("ERRO NO LOGIN:", err);
    res.status(500).json({ erro: "Erro no login." });
  }
});

/* =========================
   LISTAR USUÁRIOS
========================= */
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, funcao_social, foto_perfil FROM usuarios"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("ERRO AO LISTAR:", err);
    res.status(500).json({ erro: "Erro ao buscar usuários." });
  }
});

/* ==================================================
   5. INICIAR SERVIDOR
================================================== */
const PORT = 3000;

app.listen(PORT, () => {
  console.log("✅ Servidor PlayClass Online!");
  console.log(`🚀 Rodando em: http://localhost:${PORT}`);
});
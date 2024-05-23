const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const DB_PATH = './database.sqlite';
const SECRET_KEY = 'your_secret_key';  // Troque por uma chave secreta mais segura

const initializeDatabase = () => {
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, email TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS voluntarios (id INTEGER PRIMARY KEY, nome TEXT, atividade_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS atividades (id INTEGER PRIMARY KEY, nome TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS acolhidos (id INTEGER PRIMARY KEY, nome TEXT, sobrenome TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS acolhido_atividades (id INTEGER PRIMARY KEY, acolhido_id INTEGER, atividade_id INTEGER, data TEXT, hora TEXT, pontuacao INTEGER)");

    // Inserir um admin padrão, caso não exista
    db.get("SELECT * FROM admins WHERE email = ?", ["admin@example.com"], (err, row) => {
      if (!row) {
        const passwordHash = bcrypt.hashSync("admin123", 8);
        db.run("INSERT INTO admins (email, password) VALUES (?, ?)", ["admin@example.com", passwordHash]);
      }
    });
  });

  return db;
};

const db = initializeDatabase();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM admins WHERE email = ?", [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(403).send("Email ou senha incorretos");
    }
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.get('/api/voluntarios', authenticateToken, (req, res) => {
  db.all("SELECT * FROM voluntarios", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/api/voluntarios', authenticateToken, (req, res) => {
  const { nome, atividade_id } = req.body;
  db.run("INSERT INTO voluntarios (nome, atividade_id) VALUES (?, ?)", [nome, atividade_id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ id: this.lastID, nome, atividade_id });
  });
});

app.delete('/api/voluntarios/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM voluntarios WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ message: 'Voluntário deletado' });
  });
});

app.get('/api/atividades', authenticateToken, (req, res) => {
  db.all("SELECT * FROM atividades", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/api/atividades', authenticateToken, (req, res) => {
  const { nome } = req.body;
  db.run("INSERT INTO atividades (nome) VALUES (?)", [nome], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ id: this.lastID, nome });
  });
});

app.get('/api/acolhidos', authenticateToken, (req, res) => {
  db.all("SELECT * FROM acolhidos", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/api/acolhidos', authenticateToken, (req, res) => {
  const { nome, sobrenome } = req.body;
  db.run("INSERT INTO acolhidos (nome, sobrenome) VALUES (?, ?)", [nome, sobrenome], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ id: this.lastID, nome, sobrenome });
  });
});

app.post('/api/acolhidos/:id/atividades', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { atividade_id, data, hora, pontuacao } = req.body;
  db.run("INSERT INTO acolhido_atividades (acolhido_id, atividade_id, data, hora, pontuacao) VALUES (?, ?, ?, ?, ?)",
    [id, atividade_id, data, hora, pontuacao], function(err) {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.json({ id: this.lastID, acolhido_id: id, atividade_id, data, hora, pontuacao });
    });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

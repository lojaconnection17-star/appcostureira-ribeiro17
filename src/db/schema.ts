import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'appcostureira.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medidas (
  id TEXT PRIMARY KEY,
  cliente_id TEXT UNIQUE NOT NULL,
  busto REAL,
  cintura REAL,
  quadril REAL,
  ombro REAL,
  manga REAL,
  comprimento_vestido REAL,
  comprimento_calca REAL,
  entreperna REAL,
  cintura_altura REAL,
  largura_costas REAL,
  profundidade_busto REAL,
  joelho REAL,
  tornozelo REAL,
  barra REAL,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS servicos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_base REAL DEFAULT 0,
  ativo INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encomendas (
  id TEXT PRIMARY KEY,
  numero INTEGER UNIQUE,
  cliente_id TEXT NOT NULL,
  status TEXT DEFAULT 'ORCAMENTO',
  data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_previsao DATETIME,
  data_entrega DATETIME,
  valor_total REAL DEFAULT 0,
  valor_pago REAL DEFAULT 0,
  desconto REAL DEFAULT 0,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS itens_encomenda (
  id TEXT PRIMARY KEY,
  encomenda_id TEXT NOT NULL,
  servico_id TEXT,
  descricao TEXT NOT NULL,
  quantidade INTEGER DEFAULT 1,
  preco_unit REAL DEFAULT 0,
  subtotal REAL DEFAULT 0,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encomenda_id) REFERENCES encomendas(id) ON DELETE CASCADE,
  FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id TEXT PRIMARY KEY,
  encomenda_id TEXT NOT NULL,
  valor REAL NOT NULL,
  forma TEXT NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encomenda_id) REFERENCES encomendas(id) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS update_clientes_updated_at AFTER UPDATE ON clientes
BEGIN
  UPDATE clientes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_encomendas_updated_at AFTER UPDATE ON encomendas
BEGIN
  UPDATE encomendas SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_medidas_updated_at AFTER UPDATE ON medidas
BEGIN
  UPDATE medidas SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
`);

export default db;

import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';
import { generateId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    let query = `
      SELECT e.*, c.nome as cliente_nome, c.telefone as cliente_telefone,
        (SELECT COUNT(*) FROM itens_encomenda WHERE encomenda_id = e.id) as total_itens,
        (SELECT COALESCE(SUM(valor), 0) FROM pagamentos WHERE encomenda_id = e.id) as total_pago
      FROM encomendas e
      JOIN clientes c ON c.id = e.cliente_id
    `;
    if (status) query += ` WHERE e.status = ?`;
    query += ' ORDER BY e.created_at DESC';
    const encomendas = status ? db.prepare(query).all(status) : db.prepare(query).all();
    return NextResponse.json(encomendas);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar encomendas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = generateId();
    
    const last = db.prepare('SELECT MAX(numero) as max_num FROM encomendas').get() as any;
    const numero = (last?.max_num || 0) + 1;
    
    const stmt = db.prepare(
      'INSERT INTO encomendas (id, numero, cliente_id, status, data_previsao, valor_total, desconto, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, numero, body.cliente_id, body.status || 'ORCAMENTO', body.data_previsao || null, body.valor_total || 0, body.desconto || 0, body.observacoes || null);
    
    if (body.itens && Array.isArray(body.itens)) {
      const itemStmt = db.prepare(
        'INSERT INTO itens_encomenda (id, encomenda_id, servico_id, descricao, quantidade, preco_unit, subtotal, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const item of body.itens) {
        const itemId = generateId();
        const subtotal = (item.quantidade || 1) * (item.preco_unit || 0);
        itemStmt.run(itemId, id, item.servico_id || null, item.descricao, item.quantidade || 1, item.preco_unit || 0, subtotal, item.observacoes || null);
      }
      const total = db.prepare('SELECT SUM(subtotal) as total FROM itens_encomenda WHERE encomenda_id = ?').get(id) as any;
      db.prepare('UPDATE encomendas SET valor_total = ? WHERE id = ?').run(total?.total || 0, id);
    }
    
    const encomenda = db.prepare(`
      SELECT e.*, c.nome as cliente_nome 
      FROM encomendas e 
      JOIN clientes c ON c.id = e.cliente_id 
      WHERE e.id = ?
    `).get(id);
    return NextResponse.json(encomenda, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar encomenda' }, { status: 500 });
  }
}

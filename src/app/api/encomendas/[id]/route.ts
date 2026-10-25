import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const encomenda = db.prepare(`
      SELECT e.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email
      FROM encomendas e
      JOIN clientes c ON c.id = e.cliente_id
      WHERE e.id = ?
    `).get(id) as any;
    if (!encomenda) return NextResponse.json({ error: 'Encomenda não encontrada' }, { status: 404 });
    const itens = db.prepare('SELECT * FROM itens_encomenda WHERE encomenda_id = ?').all(id);
    const pagamentos = db.prepare('SELECT * FROM pagamentos WHERE encomenda_id = ? ORDER BY data DESC').all(id) as any[];
    const totalPago = pagamentos.reduce((acc: number, p: any) => acc + (p.valor || 0), 0);
    return NextResponse.json({ ...encomenda, itens, pagamentos, totalPago, saldo: (encomenda.valor_total || 0) - (encomenda.desconto || 0) - totalPago });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar encomenda' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const stmt = db.prepare(`
      UPDATE encomendas SET status = ?, data_previsao = ?, data_entrega = ?, valor_total = ?, desconto = ?, observacoes = ?
      WHERE id = ?
    `);
    stmt.run(body.status, body.data_previsao || null, body.data_entrega || null, body.valor_total || 0, body.desconto || 0, body.observacoes || null, id);
    if (body.status === 'ENTREGUE' && !body.data_entrega) {
      db.prepare('UPDATE encomendas SET data_entrega = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    }
    const encomenda = db.prepare('SELECT * FROM encomendas WHERE id = ?').get(id);
    return NextResponse.json(encomenda);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar encomenda' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
    const medidas = db.prepare('SELECT * FROM medidas WHERE cliente_id = ?').get(id);
    const encomendas = db.prepare(`
      SELECT e.*, 
        (SELECT COUNT(*) FROM itens_encomenda WHERE encomenda_id = e.id) as total_itens
      FROM encomendas e 
      WHERE e.cliente_id = ? 
      ORDER BY e.created_at DESC
    `).all(id);
    if (!cliente) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    return NextResponse.json({ ...cliente, medidas, encomendas });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar cliente' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const stmt = db.prepare(
      'UPDATE clientes SET nome = ?, telefone = ?, email = ?, endereco = ?, observacoes = ? WHERE id = ?'
    );
    stmt.run(body.nome, body.telefone || null, body.email || null, body.endereco || null, body.observacoes || null, id);
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
    return NextResponse.json({ message: 'Cliente removido' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover cliente' }, { status: 500 });
  }
}

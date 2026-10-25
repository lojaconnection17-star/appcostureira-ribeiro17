import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const servicos = db.prepare('SELECT * FROM servicos WHERE ativo = 1 ORDER BY nome ASC').all();
    return NextResponse.json(servicos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = generateId();
    const stmt = db.prepare('INSERT INTO servicos (id, nome, descricao, preco_base) VALUES (?, ?, ?, ?)');
    stmt.run(id, body.nome, body.descricao || null, body.preco_base || 0);
    const servico = db.prepare('SELECT * FROM servicos WHERE id = ?').get(id);
    return NextResponse.json(servico, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
  }
}

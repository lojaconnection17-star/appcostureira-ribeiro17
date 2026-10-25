import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM clientes ORDER BY nome ASC');
    const clientes = stmt.all();
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = generateId();
    const stmt = db.prepare(
      'INSERT INTO clientes (id, nome, telefone, email, endereco, observacoes) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, body.nome, body.telefone || null, body.email || null, body.endereco || null, body.observacoes || null);
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pagId = generateId();
    const stmt = db.prepare('INSERT INTO pagamentos (id, encomenda_id, valor, forma, observacoes) VALUES (?, ?, ?, ?, ?)');
    stmt.run(pagId, id, body.valor, body.forma, body.observacoes || null);
    const pagamentos = db.prepare('SELECT * FROM pagamentos WHERE encomenda_id = ? ORDER BY data DESC').all(id);
    const totalPago = pagamentos.reduce((acc: number, p: any) => acc + (p.valor || 0), 0);
    db.prepare('UPDATE encomendas SET valor_pago = ? WHERE id = ?').run(totalPago, id);
    return NextResponse.json({ pagamentos, totalPago }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 });
  }
}

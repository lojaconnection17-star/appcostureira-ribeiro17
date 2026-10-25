import { NextResponse } from 'next/server';
import db from '@/db/schema';

export async function GET() {
  try {
    const totalClientes = (db.prepare('SELECT COUNT(*) as count FROM clientes').get() as any).count;
    const totalEncomendas = (db.prepare('SELECT COUNT(*) as count FROM encomendas').get() as any).count;
    const orcamentos = (db.prepare("SELECT COUNT(*) as count FROM encomendas WHERE status = 'ORCAMENTO'").get() as any).count;
    const emProducao = (db.prepare("SELECT COUNT(*) as count FROM encomendas WHERE status IN ('APROVADO','EM_PRODUCAO')").get() as any).count;
    const prontos = (db.prepare("SELECT COUNT(*) as count FROM encomendas WHERE status = 'PRONTO'").get() as any).count;
    
    const valorTotal = (db.prepare("SELECT COALESCE(SUM(valor_total - desconto), 0) as total FROM encomendas WHERE status != 'CANCELADO'").get() as any).total;
    const valorRecebido = (db.prepare("SELECT COALESCE(SUM(valor_pago), 0) as total FROM encomendas").get() as any).total;
    
    const recentEncomendas = db.prepare(`
      SELECT e.*, c.nome as cliente_nome
      FROM encomendas e
      JOIN clientes c ON c.id = e.cliente_id
      ORDER BY e.created_at DESC
      LIMIT 5
    `).all();
    
    return NextResponse.json({
      totalClientes,
      totalEncomendas,
      orcamentos,
      emProducao,
      prontos,
      valorTotal,
      valorRecebido,
      aReceber: valorTotal - valorRecebido,
      recentEncomendas,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao carregar dashboard' }, { status: 500 });
  }
}

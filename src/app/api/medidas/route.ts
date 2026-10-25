import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/schema';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cliente_id, ...medidas } = body;
    const existente = db.prepare('SELECT id FROM medidas WHERE cliente_id = ?').get(cliente_id);
    if (existente) {
      const stmt = db.prepare(`
        UPDATE medidas SET 
          busto=?, cintura=?, quadril=?, ombro=?, manga=?,
          comprimento_vestido=?, comprimento_calca=?, entreperna=?,
          cintura_altura=?, largura_costas=?, profundidade_busto=?,
          joelho=?, tornozelo=?, barra=?, observacoes=?
        WHERE cliente_id = ?
      `);
      stmt.run(
        medidas.busto || null, medidas.cintura || null, medidas.quadril || null,
        medidas.ombro || null, medidas.manga || null, medidas.comprimento_vestido || null,
        medidas.comprimento_calca || null, medidas.entreperna || null, medidas.cintura_altura || null,
        medidas.largura_costas || null, medidas.profundidade_busto || null, medidas.joelho || null,
        medidas.tornozelo || null, medidas.barra || null, medidas.observacoes || null, cliente_id
      );
    } else {
      const id = generateId();
      const stmt = db.prepare(`
        INSERT INTO medidas (id, cliente_id, busto, cintura, quadril, ombro, manga,
          comprimento_vestido, comprimento_calca, entreperna, cintura_altura,
          largura_costas, profundidade_busto, joelho, tornozelo, barra, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, cliente_id,
        medidas.busto || null, medidas.cintura || null, medidas.quadril || null,
        medidas.ombro || null, medidas.manga || null, medidas.comprimento_vestido || null,
        medidas.comprimento_calca || null, medidas.entreperna || null, medidas.cintura_altura || null,
        medidas.largura_costas || null, medidas.profundidade_busto || null, medidas.joelho || null,
        medidas.tornozelo || null, medidas.barra || null, medidas.observacoes || null
      );
    }
    const medida = db.prepare('SELECT * FROM medidas WHERE cliente_id = ?').get(cliente_id);
    return NextResponse.json(medida);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar medidas' }, { status: 500 });
  }
}

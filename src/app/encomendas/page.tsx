'use client';

import { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, statusLabels, statusColors } from '@/lib/utils';

export default function Encomendas() {
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  const fetchEncomendas = () => {
    const url = filtro ? `/api/encomendas?status=${filtro}` : '/api/encomendas';
    fetch(url)
      .then(res => res.json())
      .then(setEncomendas)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEncomendas();
  }, [filtro]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Encomendas</h1>
        <Link
          href="/novo"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Encomenda
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Todos os status</option>
          <option value="ORCAMENTO">Orçamento</option>
          <option value="APROVADO">Aprovado</option>
          <option value="EM_PRODUCAO">Em Produção</option>
          <option value="PRONTO">Pronto</option>
          <option value="ENTREGUE">Entregue</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Nº</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Cliente</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Data Entrada</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Previsão</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Valor</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">Carregando...</td></tr>
            ) : encomendas.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">Nenhuma encomenda encontrada</td></tr>
            ) : (
              encomendas.map((enc) => (
                <tr key={enc.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-pink-600">#{enc.numero}</td>
                  <td className="py-4 px-6 text-gray-800">{enc.cliente_nome}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[enc.status]}`}>
                      {statusLabels[enc.status]}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{formatDate(enc.data_entrada)}</td>
                  <td className="py-4 px-6 text-gray-600">{enc.data_previsao ? formatDate(enc.data_previsao) : '-'}</td>
                  <td className="py-4 px-6 text-right font-medium">{formatCurrency(enc.valor_total - enc.desconto)}</td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/encomendas/${enc.id}`} className="text-pink-600 hover:underline text-sm font-medium">
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

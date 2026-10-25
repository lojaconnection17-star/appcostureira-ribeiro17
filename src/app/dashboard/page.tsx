'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, Clock, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate, statusLabels, statusColors } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  const cards = [
    { label: 'Clientes', value: data.totalClientes, icon: Users, color: 'bg-blue-500' },
    { label: 'Orçamentos', value: data.orcamentos, icon: FileText, color: 'bg-gray-500' },
    { label: 'Em Produção', value: data.emProducao, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Prontos', value: data.prontos, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-800">Financeiro Resumido</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Valor Total</span>
              <span className="font-semibold">{formatCurrency(data.valorTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recebido</span>
              <span className="font-semibold text-green-600">{formatCurrency(data.valorRecebido)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-800 font-medium">A Receber</span>
              <span className="font-bold text-orange-600">{formatCurrency(data.aReceber)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Encomendas Recentes</h2>
            <Link href="/encomendas" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
              Ver todas
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nº</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEncomendas?.map((enc: any) => (
                  <tr key={enc.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/encomendas/${enc.id}`} className="text-pink-600 hover:underline">
                        #{enc.numero}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{enc.cliente_nome}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[enc.status]}`}>
                        {statusLabels[enc.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(enc.data_entrada)}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(enc.valor_total - enc.desconto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

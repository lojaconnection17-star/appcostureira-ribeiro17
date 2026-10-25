'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function Financeiro() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total a Receber</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(data.valorTotal)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Recebido</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(data.valorRecebido)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pendente</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(data.aReceber)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo Geral</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Valor Total das Encomendas</span>
            <span className="font-semibold text-gray-800">{formatCurrency(data.valorTotal)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-gray-700">Total Recebido</span>
            <span className="font-semibold text-green-600">{formatCurrency(data.valorRecebido)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <span className="text-gray-700">Saldo a Receber</span>
            <span className="font-semibold text-orange-600">{formatCurrency(data.aReceber)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

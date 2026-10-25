'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function Servicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', preco_base: '' });

  const fetchServicos = () => {
    fetch('/api/servicos')
      .then(res => res.json())
      .then(setServicos)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/servicos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, preco_base: parseFloat(form.preco_base) || 0 }),
    });
    setShowModal(false);
    setForm({ nome: '', descricao: '', preco_base: '' });
    fetchServicos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Nome</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Descrição</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Preço Base</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-500">Carregando...</td></tr>
            ) : servicos.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-500">Nenhum serviço cadastrado</td></tr>
            ) : (
              servicos.map((servico) => (
                <tr key={servico.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-800 font-medium">{servico.nome}</td>
                  <td className="py-4 px-6 text-gray-600">{servico.descricao || '-'}</td>
                  <td className="py-4 px-6 text-right font-medium">{formatCurrency(servico.preco_base)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Novo Serviço</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.preco_base}
                  onChange={(e) => setForm({ ...form, preco_base: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

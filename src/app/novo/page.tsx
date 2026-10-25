'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

export default function NovaEncomenda() {
  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [form, setForm] = useState({
    cliente_id: '',
    status: 'ORCAMENTO',
    data_previsao: '',
    desconto: 0,
    observacoes: '',
  });
  const [itens, setItens] = useState([{ descricao: '', quantidade: 1, preco_unit: 0 }]);

  useEffect(() => {
    fetch('/api/clientes').then(res => res.json()).then(setClientes);
    fetch('/api/servicos').then(res => res.json()).then(setServicos);
  }, []);

  const addItem = () => {
    setItens([...itens, { descricao: '', quantidade: 1, preco_unit: 0 }]);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItens = [...itens];
    (newItens[index] as any)[field] = value;
    setItens(newItens);
  };

  const subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.preco_unit), 0);
  const total = subtotal - (Number(form.desconto) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/encomendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        desconto: Number(form.desconto) || 0,
        valor_total: subtotal,
        itens: itens.filter(i => i.descricao),
      }),
    });
    const data = await res.json();
    router.push(`/encomendas/${data.id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nova Encomenda</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados da Encomenda</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select
                    required
                    value={form.cliente_id}
                    onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="ORCAMENTO">Orçamento</option>
                    <option value="APROVADO">Aprovado</option>
                    <option value="EM_PRODUCAO">Em Produção</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Entrega</label>
                  <input
                    type="date"
                    value={form.data_previsao}
                    onChange={(e) => setForm({ ...form, data_previsao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Itens</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Item
                </button>
              </div>
              <div className="space-y-3">
                {itens.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Descrição do serviço"
                        value={item.descricao}
                        onChange={(e) => updateItem(index, 'descricao', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qtd"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Preço Unit."
                        value={item.preco_unit}
                        onChange={(e) => updateItem(index, 'preco_unit', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Observações</h2>
              <textarea
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={4}
                placeholder="Observações sobre a encomenda..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Desconto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.desconto}
                    onChange={(e) => setForm({ ...form, desconto: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium"
              >
                Salvar Encomenda
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

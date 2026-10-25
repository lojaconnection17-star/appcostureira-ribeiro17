'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Calendar, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, statusLabels, statusColors, formasPagamento } from '@/lib/utils';

function EncomendaDetalheContent() {
  const params = useParams();
  const [encomenda, setEncomenda] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPagamento, setShowPagamento] = useState(false);
  const [pagamento, setPagamento] = useState({ valor: '', forma: 'DINHEIRO', observacoes: '' });

  const fetchEncomenda = () => {
    if (!params.id) return;
    fetch(`/api/encomendas/${params.id}`)
      .then(res => res.json())
      .then(setEncomenda)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEncomenda();
  }, [params.id]);

  const atualizarStatus = async (status: string) => {
    await fetch(`/api/encomendas/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...encomenda, status }),
    });
    fetchEncomenda();
  };

  const registrarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/encomendas/${params.id}/pagamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pagamento, valor: parseFloat(pagamento.valor) }),
    });
    setShowPagamento(false);
    setPagamento({ valor: '', forma: 'DINHEIRO', observacoes: '' });
    fetchEncomenda();
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (!encomenda) return <div className="text-center py-10">Encomenda não encontrada</div>;

  const valorLiquido = (encomenda.valor_total || 0) - (encomenda.desconto || 0);
  const saldo = valorLiquido - (encomenda.totalPago || 0);

  return (
    <div>
      <Link href="/encomendas" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para encomendas
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Encomenda #{encomenda.numero}</h1>
          <p className="text-gray-600 mt-1">Criada em {formatDate(encomenda.data_entrada)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[encomenda.status]}`}>
          {statusLabels[encomenda.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-pink-600" />
              Cliente
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{encomenda.cliente_nome}</p>
                {encomenda.cliente_telefone && <p className="text-gray-600 text-sm flex items-center gap-2 mt-1"><Phone className="w-3 h-3" />{encomenda.cliente_telefone}</p>}
              </div>
              <Link href={`/clientes/${encomenda.cliente_id}`} className="text-pink-600 hover:underline text-sm">
                Ver perfil
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Itens da Encomenda</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Descrição</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-600">Qtd</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Preço Unit.</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {encomenda.itens?.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 text-gray-800">{item.descricao}</td>
                      <td className="py-3 text-center text-gray-600">{item.quantidade}</td>
                      <td className="py-3 text-right text-gray-600">{formatCurrency(item.preco_unit)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(encomenda.valor_total)}</span>
              </div>
              {encomenda.desconto > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Desconto</span>
                  <span className="text-red-600">- {formatCurrency(encomenda.desconto)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(valorLiquido)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-pink-600" />
                Pagamentos
              </h2>
              <button
                onClick={() => setShowPagamento(true)}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Registrar Pagamento
              </button>
            </div>
            {encomenda.pagamentos?.length > 0 ? (
              <div className="space-y-2">
                {encomenda.pagamentos.map((pag: any) => (
                  <div key={pag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-600">{formatCurrency(pag.valor)}</p>
                      <p className="text-sm text-gray-600">{formasPagamento[pag.forma]} • {formatDate(pag.data)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum pagamento registrado</p>
            )}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Total Pago</span>
                <span className="text-green-600">{formatCurrency(encomenda.totalPago || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800">
                <span>Saldo a Receber</span>
                <span className={saldo > 0 ? 'text-orange-600' : 'text-green-600'}>{formatCurrency(Math.max(0, saldo))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Alterar Status</h2>
            <div className="space-y-2">
              {['ORCAMENTO', 'APROVADO', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE', 'CANCELADO'].map((st) => (
                <button
                  key={st}
                  onClick={() => atualizarStatus(st)}
                  disabled={encomenda.status === st}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    encomenda.status === st
                      ? 'bg-pink-100 text-pink-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {statusLabels[st]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Datas
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Entrada</p>
                <p className="text-gray-800">{formatDate(encomenda.data_entrada)}</p>
              </div>
              {encomenda.data_previsao && (
                <div>
                  <p className="text-gray-500">Previsão de Entrega</p>
                  <p className="text-gray-800">{formatDate(encomenda.data_previsao)}</p>
                </div>
              )}
              {encomenda.data_entrega && (
                <div>
                  <p className="text-gray-500">Data de Entrega</p>
                  <p className="text-gray-800">{formatDate(encomenda.data_entrega)}</p>
                </div>
              )}
            </div>
          </div>

          {encomenda.observacoes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Observações</h2>
              <p className="text-gray-600 text-sm">{encomenda.observacoes}</p>
            </div>
          )}
        </div>
      </div>

      {showPagamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Pagamento</h2>
            <form onSubmit={registrarPagamento} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={pagamento.valor}
                  onChange={(e) => setPagamento({ ...pagamento, valor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento *</label>
                <select
                  value={pagamento.forma}
                  onChange={(e) => setPagamento({ ...pagamento, forma: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="CARTAO">Cartão</option>
                  <option value="TRANSFERENCIA">Transferência</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={pagamento.observacoes}
                  onChange={(e) => setPagamento({ ...pagamento, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPagamento(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EncomendaDetalhe() {
  return (
    <Suspense fallback={<div className="text-center py-10">Carregando...</div>}>
      <EncomendaDetalheContent />
    </Suspense>
  );
}

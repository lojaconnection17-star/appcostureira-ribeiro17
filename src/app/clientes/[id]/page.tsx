'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Phone, Mail, MapPin, Ruler, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, statusLabels, statusColors } from '@/lib/utils';

function ClienteDetalheContent() {
  const params = useParams();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMedidas, setShowMedidas] = useState(false);
  const [medidas, setMedidas] = useState({
    busto: '', cintura: '', quadril: '', ombro: '', manga: '',
    comprimento_vestido: '', comprimento_calca: '', entreperna: '',
    cintura_altura: '', largura_costas: '', profundidade_busto: '',
    joelho: '', tornozelo: '', barra: '', observacoes: ''
  });

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/clientes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCliente(data);
        if (data.medidas) {
          const m = data.medidas;
          setMedidas({
            busto: m.busto || '', cintura: m.cintura || '', quadril: m.quadril || '',
            ombro: m.ombro || '', manga: m.manga || '', comprimento_vestido: m.comprimento_vestido || '',
            comprimento_calca: m.comprimento_calca || '', entreperna: m.entreperna || '',
            cintura_altura: m.cintura_altura || '', largura_costas: m.largura_costas || '',
            profundidade_busto: m.profundidade_busto || '', joelho: m.joelho || '',
            tornozelo: m.tornozelo || '', barra: m.barra || '', observacoes: m.observacoes || ''
          });
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const salvarMedidas = async () => {
    await fetch('/api/medidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: params.id, ...medidas }),
    });
    setShowMedidas(false);
    alert('Medidas salvas com sucesso!');
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (!cliente) return <div className="text-center py-10">Cliente não encontrado</div>;

  return (
    <div>
      <Link href="/clientes" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para clientes
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{cliente.nome}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
          {cliente.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {cliente.telefone}
            </div>
          )}
          {cliente.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {cliente.email}
            </div>
          )}
          {cliente.endereco && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {cliente.endereco}
            </div>
          )}
        </div>
        {cliente.observacoes && (
          <p className="mt-4 text-gray-600 bg-gray-50 p-3 rounded-lg">{cliente.observacoes}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-semibold text-gray-800">Medidas</h2>
            </div>
            <button
              onClick={() => setShowMedidas(true)}
              className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              {cliente.medidas ? 'Editar' : 'Cadastrar'}
            </button>
          </div>
          {cliente.medidas ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {cliente.medidas.busto && <div><span className="text-gray-500">Busto:</span> <span className="font-medium">{cliente.medidas.busto} cm</span></div>}
              {cliente.medidas.cintura && <div><span className="text-gray-500">Cintura:</span> <span className="font-medium">{cliente.medidas.cintura} cm</span></div>}
              {cliente.medidas.quadril && <div><span className="text-gray-500">Quadril:</span> <span className="font-medium">{cliente.medidas.quadril} cm</span></div>}
              {cliente.medidas.ombro && <div><span className="text-gray-500">Ombro:</span> <span className="font-medium">{cliente.medidas.ombro} cm</span></div>}
              {cliente.medidas.manga && <div><span className="text-gray-500">Manga:</span> <span className="font-medium">{cliente.medidas.manga} cm</span></div>}
              {cliente.medidas.comprimento_vestido && <div><span className="text-gray-500">Comp. Vestido:</span> <span className="font-medium">{cliente.medidas.comprimento_vestido} cm</span></div>}
              {cliente.medidas.comprimento_calca && <div><span className="text-gray-500">Comp. Calça:</span> <span className="font-medium">{cliente.medidas.comprimento_calca} cm</span></div>}
              {cliente.medidas.entreperna && <div><span className="text-gray-500">Entreperna:</span> <span className="font-medium">{cliente.medidas.entreperna} cm</span></div>}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma medida cadastrada</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-semibold text-gray-800">Encomendas</h2>
            </div>
            <Link href="/novo" className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Nova
            </Link>
          </div>
          {cliente.encomendas?.length > 0 ? (
            <div className="space-y-3">
              {cliente.encomendas.map((enc: any) => (
                <Link key={enc.id} href={`/encomendas/${enc.id}`} className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-pink-600">#{enc.numero}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[enc.status]}`}>
                      {statusLabels[enc.status]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatDate(enc.data_entrada)}</span>
                    <span className="font-medium">{formatCurrency(enc.valor_total - (enc.desconto || 0))}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma encomenda</p>
          )}
        </div>
      </div>

      {showMedidas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl m-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Medidas do Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Busto (cm)', key: 'busto' },
                { label: 'Cintura (cm)', key: 'cintura' },
                { label: 'Quadril (cm)', key: 'quadril' },
                { label: 'Ombro (cm)', key: 'ombro' },
                { label: 'Manga (cm)', key: 'manga' },
                { label: 'Comprimento Vestido (cm)', key: 'comprimento_vestido' },
                { label: 'Comprimento Calça (cm)', key: 'comprimento_calca' },
                { label: 'Entreperna (cm)', key: 'entreperna' },
                { label: 'Altura da Cintura (cm)', key: 'cintura_altura' },
                { label: 'Largura das Costas (cm)', key: 'largura_costas' },
                { label: 'Profundidade do Busto (cm)', key: 'profundidade_busto' },
                { label: 'Joelho (cm)', key: 'joelho' },
                { label: 'Tornozelo (cm)', key: 'tornozelo' },
                { label: 'Barra (cm)', key: 'barra' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={(medidas as any)[item.key]}
                    onChange={(e) => setMedidas({ ...medidas, [item.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={medidas.observacoes}
                onChange={(e) => setMedidas({ ...medidas, observacoes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowMedidas(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarMedidas}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Salvar Medidas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClienteDetalhe() {
  return (
    <Suspense fallback={<div className="text-center py-10">Carregando...</div>}>
      <ClienteDetalheContent />
    </Suspense>
  );
}

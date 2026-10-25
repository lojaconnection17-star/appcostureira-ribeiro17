export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatDate(date: string | Date): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export const statusLabels: Record<string, string> = {
  ORCAMENTO: 'Orçamento',
  APROVADO: 'Aprovado',
  EM_PRODUCAO: 'Em Produção',
  PRONTO: 'Pronto para Retirada',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export const statusColors: Record<string, string> = {
  ORCAMENTO: 'bg-gray-100 text-gray-800',
  APROVADO: 'bg-blue-100 text-blue-800',
  EM_PRODUCAO: 'bg-yellow-100 text-yellow-800',
  PRONTO: 'bg-green-100 text-green-800',
  ENTREGUE: 'bg-emerald-100 text-emerald-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

export const formasPagamento: Record<string, string> = {
  DINHEIRO: 'Dinheiro',
  PIX: 'PIX',
  CARTAO: 'Cartão',
  TRANSFERENCIA: 'Transferência',
};

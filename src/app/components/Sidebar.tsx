'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Scissors, PlusCircle, DollarSign } from 'lucide-react';
import { Suspense } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/encomendas', label: 'Encomendas', icon: FileText },
  { href: '/novo', label: 'Nova Encomenda', icon: PlusCircle },
  { href: '/servicos', label: 'Serviços', icon: Scissors },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-pink-700 text-white">
      <div className="p-6 border-b border-pink-600">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Scissors className="w-6 h-6" />
          Ateliê Costureira
        </h1>
        <p className="text-pink-200 text-sm mt-1">Gestão Completa</p>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-white text-pink-700'
                  : 'hover:bg-pink-600 text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={
      <aside className="fixed left-0 top-0 h-full w-64 bg-pink-700 text-white">
        <div className="p-6 border-b border-pink-600">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Scissors className="w-6 h-6" />
            Ateliê Costureira
          </h1>
          <p className="text-pink-200 text-sm mt-1">Gestão Completa</p>
        </div>
      </aside>
    }>
      <SidebarContent />
    </Suspense>
  );
}

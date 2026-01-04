import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative flex">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />
      
      {/* Scan Line Effect */}
      <div className="fixed inset-0 scan-line pointer-events-none opacity-50" />

      <Sidebar />
      
      <main className="flex-1 ml-20 lg:ml-[260px] min-h-screen transition-all duration-300">
        <Header title={title} subtitle={subtitle} />
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

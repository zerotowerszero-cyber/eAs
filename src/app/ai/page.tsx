import ChatUI from '@/components/ChatUI';
import Header from '@/components/Header';

export const metadata = {
  title: 'EAS AI',
  description: 'Chat with EAS AI',
};

export default function AIPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "64px", backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Header />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ChatUI />
      </div>
    </main>
  );
}

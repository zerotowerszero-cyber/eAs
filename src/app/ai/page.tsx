import ChatUI from '@/components/ChatUI';
import Header from '@/components/Header';

export const metadata = {
  title: 'eAs',
  description: 'Chat with eAs',
};

export default function AIPage() {
  return (
    <main style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", paddingTop: "64px", backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Header />
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ChatUI />
      </div>
    </main>
  );
}

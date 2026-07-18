import ChatUI from '@/components/ChatUI';

export const metadata = {
  title: 'Gemini',
  description: 'Chat with Gemini',
};

export default function AIPage() {
  return (
    <main style={{ width: '100%', height: '100dvh', backgroundColor: '#131314', color: '#e3e3e3', margin: 0, padding: 0, overflow: 'hidden' }}>
      <ChatUI />
    </main>
  );
}

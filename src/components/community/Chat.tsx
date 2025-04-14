import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { initializeApp } from 'firebase/app';
import {firebaseConfig} from '../../lib/firebase'

import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: any;
}

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chat_messages'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
      setMessages(newMessages.reverse());
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'chat_messages'), {
        text: newMessage.trim(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] glass-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[70%] ${message.userId === user?.uid ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-8 h-8 rounded-full bg-sypher-gray flex items-center justify-center flex-shrink-0">
                <User size={16} />
              </div>
              <div
                className={`${message.userId === user?.uid ? 'bg-sypher-gray text-white' : 'bg-sypher-gray'} rounded-lg p-3`}
              >
                <div className={`flex items-center gap-2 mb-1 ${message.userId === user?.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-sm font-medium">{message.userName}</span>
                  <span className="text-xs text-gray-400">
                    {message.createdAt?.toDate().toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm break-words">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-sypher-gray border-none"
          />
          <Button
            type="submit"
            className="bg-sypher-accent hover:bg-sypher-accent/90"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
import { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
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
  const [isInputVisible, setIsInputVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

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
    <div className="glass-card relative h-[calc(100vh-16rem)] flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20 sm:pb-16">
        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
          {messages.reduce((messageGroups: JSX.Element[], message, index) => {
            const messageDate = message.createdAt?.toDate();
            const prevMessageDate = messages[index - 1]?.createdAt?.toDate();

            if (!messageDate) return messageGroups;

            if (index === 0 || !prevMessageDate || messageDate.toDateString() !== prevMessageDate.toDateString()) {
              messageGroups.push(
                <div key={`date-${message.id}`} className="flex justify-center my-4">
                  <div className="bg-sypher-gray/30 px-4 py-1 rounded-full">
                    <span className="text-xs text-gray-400">{formatDate(messageDate)}</span>
                  </div>
                </div>
              );
            }

            messageGroups.push(
              <div
                key={message.id}
                className={`flex ${message.userId === user?.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[70%] ${message.userId === user?.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-sypher-gray flex items-center justify-center flex-shrink-0">
                    <User size={12} className="sm:w-4 sm:h-4" />
                  </div>
                  <div
                    className={`${message.userId === user?.uid ? 'bg-sypher-gray text-white' : 'bg-sypher-gray'} rounded-lg p-2 sm:p-3`}
                  >
                    <div className={`flex items-center gap-1 sm:gap-2 mb-1 ${message.userId === user?.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xs sm:text-sm font-medium">{message.userName}</span>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm break-words">{message.text}</p>
                  </div>
                </div>
              </div>
            );

            return messageGroups;
          }, [])}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center px-2 sm:px-4">
        <Button
          onClick={() => setIsInputVisible(!isInputVisible)}
          className="mb-2 bg-sypher-accent hover:bg-sypher-accent/90 rounded-full p-2 sm:p-3"
          size="icon"
        >
          <MessageSquare size={20} className="sm:w-6 sm:h-6" />
        </Button>

        <form
          onSubmit={handleSendMessage}
          className={`w-full transition-all duration-300 ease-in-out ${
            isInputVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-black/20 backdrop-blur-sm border-t border-gray-800 p-3 sm:p-4">
            <div className="flex gap-2 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] mx-auto">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-sypher-gray border-none text-sm sm:text-base"
              />
              <Button
                type="submit"
                className="bg-sypher-accent hover:bg-sypher-accent/90 px-3 sm:px-4"
                disabled={!newMessage.trim()}
              >
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
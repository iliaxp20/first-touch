import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/tactics.types';
import { Send, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TacticsChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
}

export const TacticsChatDrawer: React.FC<TacticsChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  currentUserId,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-0 right-0 sm:right-4 z-40 w-full sm:w-80 md:w-96 max-h-[75vh] sm:max-h-[500px] h-full flex flex-col bg-card border-t sm:border border-border sm:rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">چت زنده تخته تاکتیک</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
            WebSocket
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <MessageSquare className="h-8 w-8 stroke-1 mb-2 opacity-50" />
            <p className="font-semibold">هنوز پیامی ارسال نشده است</p>
            <p className="text-[11px] mt-0.5">می‌توانید نکات تاکتیکی را اینجا با اعضا مطرح کنید.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 px-1">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {isMe ? 'شما' : msg.senderName}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60">{msg.timestamp}</span>
                </div>
                <div
                  className={`p-2.5 rounded-2xl max-w-[85%] break-words leading-relaxed ${
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm border border-border/60'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2 border-t border-border flex items-center gap-2 bg-background">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="پیام یا دستور تاکتیکی بنویسید..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-input bg-muted/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <Button type="submit" variant="primary" size="sm" className="h-8 w-8 p-0 rounded-xl shrink-0">
          <Send className="h-3.5 w-3.5 rotate-180" />
        </Button>
      </form>
    </div>
  );
};

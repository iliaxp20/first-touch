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
    <div
      dir="rtl"
      className="fixed bottom-0 right-0 sm:right-4 z-40 w-full sm:w-80 md:w-96 max-h-[75vh] sm:max-h-[500px] h-full flex flex-col bg-card border-t sm:border border-border sm:rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-200 text-right select-none"
    >
      {/* Header (RTL) */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40" dir="rtl">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground">چت زنده تخته تاکتیک</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="اتصال آنلاین" />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="بستن چت"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages List (Strict RTL) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs text-right" dir="rtl">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <MessageSquare className="h-8 w-8 stroke-1 mb-2 opacity-50" />
            <p className="font-semibold text-foreground">هنوز پیامی ارسال نشده است</p>
            <p className="text-[11px] mt-0.5">می‌توانید دستورات تاکتیکی و نکات بازی را اینجا ارسال کنید.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                dir="rtl"
                className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
              >
                {/* Sender name & timestamp */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-right" dir="rtl">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {isMe ? 'شما' : msg.senderName}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60">{msg.timestamp}</span>
                </div>

                {/* Bubble */}
                <div
                  dir="rtl"
                  className={`p-2.5 rounded-2xl max-w-[85%] break-words leading-relaxed text-right text-xs font-medium ${
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
                      : 'bg-muted text-foreground rounded-tl-sm border border-border/70'
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

      {/* Input Form (Strict RTL) */}
      <form
        onSubmit={handleSend}
        dir="rtl"
        className="p-2 border-t border-border flex items-center gap-2 bg-background"
      >
        <input
          type="text"
          dir="rtl"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="پیام یا دستور تاکتیکی را بنویسید..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-input bg-muted/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-right placeholder:text-muted-foreground/70"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim()}
          className="h-8 w-8 p-0 rounded-xl shrink-0 flex items-center justify-center"
          title="ارسال پیام"
        >
          <Send className="h-3.5 w-3.5 -scale-x-100" />
        </Button>
      </form>
    </div>
  );
};

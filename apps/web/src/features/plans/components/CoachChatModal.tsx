import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, uploadFile } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  Video,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export interface CoachMessageItem {
  id: string;
  coachId: string;
  traineeId: string;
  sender: 'coach' | 'trainee';
  senderName: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
}

interface CoachChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachId: string;
  coachName: string;
  traineeId?: string;
  traineeName?: string;
  userRole?: 'COACH' | 'STUDENT' | string;
}

export const CoachChatModal: React.FC<CoachChatModalProps> = ({
  isOpen,
  onClose,
  coachId,
  coachName,
  traineeId = 'trainee-current',
  traineeName = 'شاگرد',
  userRole = 'STUDENT',
}) => {
  const [messages, setMessages] = useState<CoachMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCurrentCoach = userRole === 'COACH';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const query = `coachId=${encodeURIComponent(coachId)}${traineeId ? `&traineeId=${encodeURIComponent(traineeId)}` : ''}`;
      const res = await fetch(`${API_BASE_URL}/coaches/messages?${query}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3500);
      return () => clearInterval(interval);
    }
  }, [isOpen, coachId, traineeId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 80 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از ۸۰ مگابایت باشد.');
      return;
    }

    try {
      setIsUploading(true);
      const isVideo = file.type.startsWith('video');
      const uploaded = await uploadFile(file);
      setPendingMedia({
        url: uploaded.url,
        type: isVideo ? 'video' : 'image',
      });
    } catch (err) {
      console.error('File upload error', err);
      alert('خطا در بارگذاری فایل در سرور');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !pendingMedia) return;

    setIsSending(true);
    try {
      const payload = {
        coachId,
        traineeId,
        sender: isCurrentCoach ? 'coach' : 'trainee',
        senderName: isCurrentCoach ? coachName : traineeName,
        text: inputText.trim(),
        mediaUrl: pendingMedia?.url,
        mediaType: pendingMedia?.type,
      };

      const res = await fetch(`${API_BASE_URL}/coaches/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
        setPendingMedia(null);
      }
    } catch {
      alert('خطا در ارسال پیام');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in select-none">
      <Card className="w-full max-w-lg bg-white/95 dark:bg-[#07160e]/95 backdrop-blur-2xl border border-emerald-500/20 dark:border-white/10 shadow-2xl shadow-emerald-950/40 rounded-3xl overflow-hidden flex flex-col h-[82vh] max-h-[700px]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-border/80 flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-foreground truncate">
                  {coachName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  مربی اختصاصی
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                ارتباط مستقیم، ارسال گزارش تمرین، تحلیل ویدیو و عکس
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-muted-foreground">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-foreground">
                گفتگو با مربی آغاز شده است
              </p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                می‌توانید پیام‌ها، ویدیوهای اجرای تمرین و سوالات فنی خود را اینجا ارسال کنید.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = (isCurrentCoach && msg.sender === 'coach') || (!isCurrentCoach && msg.sender === 'trainee');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-black text-muted-foreground">
                      {msg.senderName}
                    </span>
                    {msg.sender === 'coach' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                        مربی
                      </span>
                    )}
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {msg.createdAt}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-xs'
                        : 'bg-muted/80 text-foreground border border-border/80 rounded-bl-xs'
                    }`}
                  >
                    {/* Media Attachment */}
                    {msg.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden bg-black/40 border border-black/20">
                        {msg.mediaType === 'video' ? (
                          <video
                            src={msg.mediaUrl}
                            controls
                            className="w-full max-h-56 object-contain bg-black"
                          />
                        ) : (
                          <img
                            src={msg.mediaUrl}
                            alt="تصویر ارسالی"
                            onClick={() => setPreviewMediaUrl(msg.mediaUrl || null)}
                            className="w-full max-h-56 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          />
                        )}
                      </div>
                    )}

                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pending Media Preview */}
        {pendingMedia && (
          <div className="px-4 py-2 border-t border-border/60 bg-muted/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {pendingMedia.type === 'video' ? (
                <Video className="h-4 w-4 text-primary" />
              ) : (
                <ImageIcon className="h-4 w-4 text-emerald-500" />
              )}
              <span className="text-muted-foreground font-bold">
                {pendingMedia.type === 'video' ? 'ویدیو آماده ارسال' : 'عکس آماده ارسال'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPendingMedia(null)}
              className="text-rose-500 hover:text-rose-600 p-1 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Input Footer */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-border flex items-center gap-2 bg-card"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-10 w-10 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="ارسال عکس یا فیلم تمرین"
          >
            {isUploading ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="پیام خود را به مربی بنویسید..."
            className="flex-1 h-10 px-3.5 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isSending || (!inputText.trim() && !pendingMedia)}
            className="h-10 px-4 rounded-xl text-xs font-black shrink-0 gap-1.5"
          >
            <Send className="h-3.5 w-3.5 rotate-180" />
            <span>ارسال</span>
          </Button>
        </form>
      </Card>

      {/* Image Fullscreen Preview */}
      {previewMediaUrl && (
        <div
          className="fixed inset-0 z-90 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <img
            src={previewMediaUrl}
            alt="پیش‌نمایش"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

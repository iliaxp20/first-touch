import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Share2 } from 'lucide-react';

interface Player {
  id: string;
  number: number;
  name: string;
  team: 'HOME' | 'AWAY';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  position: string;
}

const DEFAULT_PLAYERS: Player[] = [
  // Goalkeeper
  { id: '1', number: 1, name: 'دروازه‌بان', team: 'HOME', x: 8, y: 50, position: 'GK' },
  // Defenders
  { id: '2', number: 2, name: 'دفاع راست', team: 'HOME', x: 25, y: 20, position: 'RB' },
  { id: '3', number: 4, name: 'دفاع وسط', team: 'HOME', x: 22, y: 40, position: 'CB' },
  { id: '4', number: 5, name: 'دفاع وسط', team: 'HOME', x: 22, y: 60, position: 'CB' },
  { id: '5', number: 3, name: 'دفاع چپ', team: 'HOME', x: 25, y: 80, position: 'LB' },
  // Midfielders
  { id: '6', number: 6, name: 'هافبک دفاعی', team: 'HOME', x: 42, y: 50, position: 'DM' },
  { id: '7', number: 8, name: 'هافبک وسط', team: 'HOME', x: 55, y: 32, position: 'CM' },
  { id: '8', number: 10, name: 'هافبک هجومی', team: 'HOME', x: 55, y: 68, position: 'AM' },
  // Forwards
  { id: '9', number: 7, name: 'وینگر راست', team: 'HOME', x: 75, y: 20, position: 'RW' },
  { id: '10', number: 9, name: 'مهاجم نوک', team: 'HOME', x: 82, y: 50, position: 'ST' },
  { id: '11', number: 11, name: 'وینگر چپ', team: 'HOME', x: 75, y: 80, position: 'LW' },
];

export const TacticsBoard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];

  const handlePointerDown = (id: string) => {
    setActivePlayer(id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePlayer || !pitchRef.current) return;

    const rect = pitchRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Calculate percentages
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    // Constrain inside pitch
    x = Math.max(3, Math.min(97, x));
    y = Math.max(5, Math.min(95, y));

    setPlayers((prev) =>
      prev.map((p) => (p.id === activePlayer ? { ...p, x, y } : p))
    );
  };

  const handlePointerUp = () => {
    setActivePlayer(null);
  };

  const resetFormation = () => {
    setPlayers(DEFAULT_PLAYERS);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">تخته تاکتیک مربیگری</h1>
          <p className="text-sm text-muted-foreground mt-1">
            چینش بازیکنان، فلش‌های حرکت و سناریوهای حمله و دفاع را به سادگی جابه‌جا و برای شاگردانتان ارسال کنید.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetFormation} className="gap-1.5">
            <RotateCcw className="h-4 w-4" />
            بازنشانی
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" />
            ارسال به شاگرد
          </Button>
        </div>
      </div>

      {/* Main Pitch Card */}
      <Card className="overflow-hidden border-border/80">
        <CardHeader className="bg-card border-b border-border/60 py-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">آرایش تیمی:</span>
              <div className="flex gap-1.5">
                {formations.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormation(f)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                      selectedFormation === f
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>قابلیت جابجایی لمسی و ماوس (Drag & Drop)</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-6 bg-muted/30">
          {/* Football Pitch Graphic Container */}
          <div
            ref={pitchRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-800/40 select-none cursor-crosshair touch-none"
            style={{
              background: 'radial-gradient(circle at center, #1e7e34 0%, #155724 100%)',
            }}
          >
            {/* Pitch Grass Stripes */}
            <div className="absolute inset-0 flex opacity-15 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}
                />
              ))}
            </div>

            {/* Pitch Lines (SVG overlay) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 65"
              preserveAspectRatio="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.6"
              fill="none"
            >
              {/* Outer boundary */}
              <rect x="2" y="2" width="96" height="61" />
              {/* Center Line */}
              <line x1="50" y1="2" x2="50" y2="63" />
              {/* Center Circle */}
              <circle cx="50" cy="32.5" r="9" />
              <circle cx="50" cy="32.5" r="0.6" fill="rgba(255, 255, 255, 0.75)" />

              {/* Left Penalty Box */}
              <rect x="2" y="14" width="16" height="37" />
              <rect x="2" y="22" width="6" height="21" />
              <path d="M 18,26.5 A 7.5,7.5 0 0 1 18,38.5" />
              <circle cx="12" cy="32.5" r="0.6" fill="rgba(255, 255, 255, 0.75)" />

              {/* Right Penalty Box */}
              <rect x="82" y="14" width="16" height="37" />
              <rect x="92" y="22" width="6" height="21" />
              <path d="M 82,26.5 A 7.5,7.5 0 0 0 82,38.5" />
              <circle cx="88" cy="32.5" r="0.6" fill="rgba(255, 255, 255, 0.75)" />
            </svg>

            {/* Players Markers */}
            {players.map((p) => {
              const isGrabbed = activePlayer === p.id;
              return (
                <div
                  key={p.id}
                  onPointerDown={() => handlePointerDown(p.id)}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-20 flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform ${
                    isGrabbed ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs sm:text-sm shadow-lg ring-2 ring-white/90">
                    {p.number}
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-black/75 text-white whitespace-nowrap shadow pointer-events-none">
                    {p.position}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

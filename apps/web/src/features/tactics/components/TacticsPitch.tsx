import React, { useRef, useState, useEffect } from 'react';
import { TacticalPlayer, TacticalDrawing, TacticalTool } from '../types/tactics.types';
import { Edit2 } from 'lucide-react';

interface TacticsPitchProps {
  players: TacticalPlayer[];
  drawings: TacticalDrawing[];
  activeTool: TacticalTool;
  activeColor: string;
  ball?: { x: number; y: number };
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  onBallMove: (x: number, y: number) => void;
  onAddDrawing: (drawing: TacticalDrawing) => void;
  onRemoveDrawing?: (drawingId: string) => void;
  onEditPlayer: (player: TacticalPlayer) => void;
  isReadOnly?: boolean;
  isRotatedLandscape?: boolean;
}

export const TacticsPitch: React.FC<TacticsPitchProps> = ({
  players,
  drawings,
  activeTool,
  activeColor,
  ball = { x: 50, y: 50 },
  onPlayerMove,
  onBallMove,
  onAddDrawing,
  onRemoveDrawing,
  onEditPlayer,
  isReadOnly = false,
  isRotatedLandscape = false,
}) => {
  const pitchRef = useRef<HTMLDivElement>(null);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [isDraggingBall, setIsDraggingBall] = useState(false);

  // Temporary drawing in progress
  const [currentDrawing, setCurrentDrawing] = useState<TacticalDrawing | null>(null);
  const currentDrawingRef = useRef<TacticalDrawing | null>(null);
  currentDrawingRef.current = currentDrawing;

  // Convert client pointer coordinates to percentage (0 - 100) inside pitch
  const getCoordinates = (e: React.PointerEvent): { x: number; y: number } => {
    if (!pitchRef.current) return { x: 50, y: 50 };
    const rect = pitchRef.current.getBoundingClientRect();

    if (isRotatedLandscape) {
      // 90deg Clockwise Rotation Coordinate Mapping:
      // Screen vertical position (Y) maps to pitch length (X axis)
      // Screen horizontal position (X) maps to pitch width (Y axis)
      let x = ((e.clientY - rect.top) / rect.height) * 100;
      let y = ((rect.right - e.clientX) / rect.width) * 100;
      x = Math.max(1, Math.min(99, x));
      y = Math.max(1, Math.min(99, y));
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }

    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(1, Math.min(99, x));
    y = Math.max(1, Math.min(99, y));
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  // Handle pointer down on pitch background
  const handlePitchPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReadOnly || activeTool === 'select') return;

    if (activeTool === 'eraser') {
      const { x, y } = getCoordinates(e);
      const hit = drawings.find((d) => {
        if (d.tool === 'pen' && d.points) {
          return d.points.some((pt) => Math.hypot(pt.x - x, pt.y - y) < 4);
        }
        const minX = Math.min(d.startX || 0, d.endX || 0) - 3;
        const maxX = Math.max(d.startX || 0, d.endX || 0) + 3;
        const minY = Math.min(d.startY || 0, d.endY || 0) - 3;
        const maxY = Math.max(d.startY || 0, d.endY || 0) + 3;
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      });
      if (hit && onRemoveDrawing) {
        onRemoveDrawing(hit.id);
      }
      return;
    }

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const { x, y } = getCoordinates(e);
    const newId = `drw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    if (activeTool === 'pen') {
      setCurrentDrawing({
        id: newId,
        tool: 'pen',
        color: activeColor,
        strokeWidth: 0.8,
        points: [{ x, y }],
      });
    } else {
      setCurrentDrawing({
        id: newId,
        tool: activeTool,
        color: activeColor,
        strokeWidth: 0.8,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    const { x, y } = getCoordinates(e);

    // Eraser drag support
    if (activeTool === 'eraser' && (e.buttons === 1 || e.pressure > 0)) {
      const hit = drawings.find((d) => {
        if (d.tool === 'pen' && d.points) {
          return d.points.some((pt) => Math.hypot(pt.x - x, pt.y - y) < 4);
        }
        const minX = Math.min(d.startX || 0, d.endX || 0) - 3;
        const maxX = Math.max(d.startX || 0, d.endX || 0) + 3;
        const minY = Math.min(d.startY || 0, d.endY || 0) - 3;
        const maxY = Math.max(d.startY || 0, d.endY || 0) + 3;
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      });
      if (hit && onRemoveDrawing) {
        onRemoveDrawing(hit.id);
      }
      return;
    }

    // 1. If dragging a player
    if (activePlayer && activeTool === 'select') {
      onPlayerMove(activePlayer, x, y);
      return;
    }

    // 2. If dragging the ball
    if (isDraggingBall && activeTool === 'select') {
      onBallMove(x, y);
      return;
    }

    // 3. If actively drawing
    if (currentDrawing) {
      if (currentDrawing.tool === 'pen') {
        setCurrentDrawing((prev) =>
          prev ? { ...prev, points: [...(prev.points || []), { x, y }] } : null,
        );
      } else {
        setCurrentDrawing((prev) =>
          prev ? { ...prev, endX: x, endY: y } : null,
        );
      }
    }
  };

  const handlePointerUp = () => {
    if (activePlayer) {
      setActivePlayer(null);
    }
    if (isDraggingBall) {
      setIsDraggingBall(false);
    }

    const drw = currentDrawingRef.current;
    if (drw) {
      // Commit drawing
      if (
        (drw.tool === 'pen' && (drw.points?.length || 0) > 1) ||
        (drw.tool !== 'pen' &&
          (Math.abs((drw.endX || 0) - (drw.startX || 0)) > 1 ||
            Math.abs((drw.endY || 0) - (drw.startY || 0)) > 1))
      ) {
        onAddDrawing(drw);
      }
      setCurrentDrawing(null);
    }
  };

  // Player pointer down
  const handlePlayerPointerDown = (id: string, e: React.PointerEvent) => {
    if (isReadOnly || activeTool !== 'select') return;
    e.stopPropagation();
    setActivePlayer(id);
  };

  // Ball pointer down
  const handleBallPointerDown = (e: React.PointerEvent) => {
    if (isReadOnly || activeTool !== 'select') return;
    e.stopPropagation();
    setIsDraggingBall(true);
  };

  useEffect(() => {
    const handleGlobalUp = () => {
      handlePointerUp();
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  // Helper to render an SVG drawing element
  const renderDrawingItem = (drw: TacticalDrawing) => {
    switch (drw.tool) {
      case 'pen': {
        if (!drw.points || drw.points.length < 2) return null;
        const pathData = drw.points.reduce(
          (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
          '',
        );
        return (
          <path
            key={drw.id}
            d={pathData}
            fill="none"
            stroke={drw.color}
            strokeWidth={drw.strokeWidth || 0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      }

      case 'arrow': {
        const sx = drw.startX || 0;
        const sy = drw.startY || 0;
        const ex = drw.endX || 0;
        const ey = drw.endY || 0;

        // Calculate arrowhead angle
        const angle = Math.atan2(ey - sy, ex - sx);
        const headLength = 2.5; // percent
        const arrowAngle = Math.PI / 6;

        const x1 = ex - headLength * Math.cos(angle - arrowAngle);
        const y1 = ey - headLength * Math.sin(angle - arrowAngle);
        const x2 = ex - headLength * Math.cos(angle + arrowAngle);
        const y2 = ey - headLength * Math.sin(angle + arrowAngle);

        return (
          <g key={drw.id}>
            <line
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              stroke={drw.color}
              strokeWidth={drw.strokeWidth || 0.9}
              strokeLinecap="round"
            />
            <polygon
              points={`${ex},${ey} ${x1},${y1} ${x2},${y2}`}
              fill={drw.color}
            />
          </g>
        );
      }

      case 'line': {
        return (
          <line
            key={drw.id}
            x1={drw.startX || 0}
            y1={drw.startY || 0}
            x2={drw.endX || 0}
            y2={drw.endY || 0}
            stroke={drw.color}
            strokeWidth={drw.strokeWidth || 0.8}
            strokeDasharray="2,2"
            strokeLinecap="round"
          />
        );
      }

      case 'rect': {
        const x = Math.min(drw.startX || 0, drw.endX || 0);
        const y = Math.min(drw.startY || 0, drw.endY || 0);
        const width = Math.abs((drw.endX || 0) - (drw.startX || 0));
        const height = Math.abs((drw.endY || 0) - (drw.startY || 0));

        return (
          <rect
            key={drw.id}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={`${drw.color}25`}
            stroke={drw.color}
            strokeWidth={drw.strokeWidth || 0.8}
            strokeDasharray="2,2"
            rx="1.5"
          />
        );
      }

      case 'circle': {
        const cx = ((drw.startX || 0) + (drw.endX || 0)) / 2;
        const cy = ((drw.startY || 0) + (drw.endY || 0)) / 2;
        const rx = Math.abs((drw.endX || 0) - (drw.startX || 0)) / 2;
        const ry = Math.abs((drw.endY || 0) - (drw.startY || 0)) / 2;

        return (
          <ellipse
            key={drw.id}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={`${drw.color}20`}
            stroke={drw.color}
            strokeWidth={drw.strokeWidth || 0.8}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      ref={pitchRef}
      onPointerDown={handlePitchPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full ${
        isRotatedLandscape ? 'h-full aspect-[16/9]' : 'aspect-[16/10] sm:aspect-[16/9] max-h-[64vh]'
      } rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-950/70 select-none touch-none mx-auto ${
        activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1b7a33 0%, #0f481e 100%)',
      }}
    >
      {/* Pitch Grass Stripes */}
      <div className="absolute inset-0 flex opacity-15 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 ${i % 2 === 0 ? 'bg-black/25' : 'bg-transparent'}`}
          />
        ))}
      </div>

      {/* Football Pitch Standard Boundary Lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 65"
        preserveAspectRatio="none"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="0.6"
        fill="none"
      >
        {/* Outer boundary */}
        <rect x="2" y="2" width="96" height="61" />
        {/* Center Line */}
        <line x1="50" y1="2" x2="50" y2="63" />
        {/* Center Circle */}
        <circle cx="50" cy="32.5" r="9" />
        <circle cx="50" cy="32.5" r="0.6" fill="rgba(255, 255, 255, 0.85)" />

        {/* Left Penalty Box */}
        <rect x="2" y="14" width="16" height="37" />
        <rect x="2" y="22" width="6" height="21" />
        <path d="M 18,26.5 A 7.5,7.5 0 0 1 18,38.5" />
        <circle cx="12" cy="32.5" r="0.6" fill="rgba(255, 255, 255, 0.85)" />

        {/* Right Penalty Box */}
        <rect x="82" y="14" width="16" height="37" />
        <rect x="92" y="22" width="6" height="21" />
        <path d="M 82,26.5 A 7.5,7.5 0 0 0 82,38.5" />
        <circle cx="88" cy="32.5" r="0.6" fill="rgba(255, 255, 255, 0.85)" />
      </svg>

      {/* TACTICAL DRAWINGS SVG LAYER (Freehand Pen, Arrows, Rectangles, Circles, Eraser) */}
      <svg
        className={`absolute inset-0 w-full h-full ${
          activeTool === 'eraser' ? 'z-20 cursor-pointer pointer-events-auto' : 'pointer-events-none z-10'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {drawings.map((drw) => (
          <g
            key={drw.id}
            onClick={(e) => {
              if (activeTool === 'eraser') {
                e.stopPropagation();
                onRemoveDrawing?.(drw.id);
              }
            }}
            className={activeTool === 'eraser' ? 'cursor-pointer hover:opacity-20 transition-opacity' : ''}
            style={{ pointerEvents: activeTool === 'eraser' ? 'all' : 'none' }}
          >
            {renderDrawingItem(drw)}
          </g>
        ))}
        {currentDrawing && renderDrawingItem(currentDrawing)}
      </svg>

      {/* LIVE FOOTBALL (Ball Marker) */}
      <div
        onPointerDown={handleBallPointerDown}
        style={{
          left: `${ball.x}%`,
          top: `${ball.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        className={`absolute z-30 cursor-grab active:cursor-grabbing transition-transform ${
          isDraggingBall ? 'scale-125' : 'hover:scale-110'
        } ${activeTool !== 'select' ? 'pointer-events-none' : ''}`}
        title="توپ فوتبال (برای حرکت دراگ کنید)"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-slate-900 shadow-xl flex items-center justify-center font-bold text-[10px] select-none ring-2 ring-amber-400">
          ⚽
        </div>
      </div>

      {/* PLAYER MARKERS */}
      {players.map((p) => {
        const isGrabbed = activePlayer === p.id;
        const isGK = p.position === 'GK';

        return (
          <div
            key={p.id}
            onPointerDown={(e) => handlePlayerPointerDown(p.id, e)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEditPlayer(p);
            }}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-20 flex flex-col items-center transition-transform touch-none select-none group ${
              activeTool === 'select' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
            } ${isGrabbed ? 'scale-125 z-40 ring-4 ring-white/90 rounded-full' : 'hover:scale-110'}`}
          >
            {/* Player Jersey Circle */}
            <div
              className={`relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full font-black text-xs sm:text-sm shadow-xl ring-2 ring-white/95 ${
                isGK
                  ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 text-black'
                  : 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 text-white'
              }`}
            >
              {p.number}

              {/* Quick Edit Pencil on Player Hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPlayer(p);
                }}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-black/80 hover:bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto shadow"
                title="ویرایش نام و شماره"
              >
                <Edit2 className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Player Name & Position Label */}
            <div className="mt-0.5 flex flex-col items-center pointer-events-none">
              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[11px] font-black bg-slate-950/90 text-white tracking-wider shadow whitespace-nowrap">
                {p.position}
              </span>
              {p.name && (
                <span className="mt-0.5 px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-bold bg-white/90 text-slate-900 shadow-sm whitespace-nowrap max-w-[65px] truncate">
                  {p.name}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

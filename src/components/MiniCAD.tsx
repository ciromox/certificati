import { useRef, useState, useEffect } from 'react';

export interface CadElement {
  id: string;
  type: 'line' | 'rect' | 'circle' | 'text' | 'symbol';
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  symbolType?: string;
  rotation?: number;
  color: string;
  lineWidth: number;
  locked?: boolean;
}

export const SIMBOLI_ELETTRICI = [
  { id: 'presa', label: 'Presa', icon: '⏚' },
  { id: 'presa_doppia', label: 'Presa Doppia', icon: '⏚⏚' },
  { id: 'interruttore', label: 'Interruttore', icon: '⏻' },
  { id: 'deviatore', label: 'Deviatore', icon: '⎊' },
  { id: 'pulsante', label: 'Pulsante', icon: '◉' },
  { id: 'lampada', label: 'Punto Luce', icon: '💡' },
  { id: 'lampada_parete', label: 'Applique', icon: '🔆' },
  { id: 'quadro', label: 'Quadro Elettrico', icon: '▣' },
  { id: 'differenziale', label: 'Differenziale', icon: '⊿' },
  { id: 'magnetotermico', label: 'Magnetotermico', icon: '⏏' },
  { id: 'scatola_der', label: 'Scatola Derivazione', icon: '⬜' },
  { id: 'termostato', label: 'Termostato', icon: '🌡' },
  { id: 'citofono', label: 'Citofono', icon: '📞' },
  { id: 'antenna', label: 'Presa TV', icon: '📺' },
  { id: 'rilevatore', label: 'Rilevatore', icon: '⚠' },
  { id: 'sirena', label: 'Sirena', icon: '🔔' },
];

export const SIMBOLI_IDRAULICI = [
  { id: 'rubinetto', label: 'Rubinetto', icon: '🚰' },
  { id: 'lavabo', label: 'Lavabo', icon: '🚿' },
  { id: 'wc', label: 'WC', icon: '🚽' },
  { id: 'bidet', label: 'Bidet', icon: '🚿' },
  { id: 'vasca', label: 'Vasca', icon: '🛁' },
  { id: 'piatto_doccia', label: 'Piatto Doccia', icon: '🚿' },
  { id: 'lavello', label: 'Lavello', icon: '🍽' },
  { id: 'lavatrice', label: 'Lavatrice', icon: '🧺' },
  { id: 'lavastoviglie', label: 'Lavastoviglie', icon: '🍴' },
  { id: 'caldaia', label: 'Caldaia', icon: '🔥' },
  { id: 'radiatore', label: 'Radiatore', icon: '🌡' },
  { id: 'valvola', label: 'Valvola', icon: '⊗' },
  { id: 'contatore', label: 'Contatore', icon: '⏱' },
];

interface MiniCADProps {
  elementi: CadElement[];
  onChange: (elementi: CadElement[]) => void;
  onClose: () => void;
}

export default function MiniCAD({ elementi, onChange, onClose }: MiniCADProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'select' | 'line' | 'rect' | 'circle' | 'text' | 'symbol' | 'pan'>('select');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('presa');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [color, setColor] = useState('#1e40af');
  const [lineWidth, setLineWidth] = useState(2);
  const [panOffset, setPanOffset] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [symbolCategory, setSymbolCategory] = useState<'elettrici' | 'idraulici'>('elettrici');
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});

  // Disegna il canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Griglia
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5 / zoom;
      const gridSize = 20;
      for (let x = -panOffset.x / zoom; x < canvas.width / zoom; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -panOffset.y / zoom);
        ctx.lineTo(x, canvas.height / zoom);
        ctx.stroke();
      }
      for (let y = -panOffset.y / zoom; y < canvas.height / zoom; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-panOffset.x / zoom, y);
        ctx.lineTo(canvas.width / zoom, y);
        ctx.stroke();
      }
    }

    // Elementi
    elementi.forEach(el => {
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.lineWidth;

      if (el.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x2!, el.y2!);
        ctx.stroke();
      } else if (el.type === 'rect') {
        ctx.strokeRect(el.x, el.y, el.width!, el.height!);
      } else if (el.type === 'circle') {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius!, 0, Math.PI * 2);
        ctx.stroke();
      } else if (el.type === 'text') {
        ctx.font = `${14 / zoom}px sans-serif`;
        ctx.fillText(el.text || '', el.x, el.y);
      } else if (el.type === 'symbol') {
        const simbolo = [...SIMBOLI_ELETTRICI, ...SIMBOLI_IDRAULICI].find(s => s.id === el.symbolType);
        if (simbolo) {
          ctx.font = `${24 / zoom}px sans-serif`;
          ctx.fillText(simbolo.icon, el.x - 12 / zoom, el.y + 8 / zoom);
          ctx.font = `${10 / zoom}px sans-serif`;
          ctx.fillStyle = '#374151';
          ctx.fillText(simbolo.label, el.x - 20 / zoom, el.y + 24 / zoom);
        }
      }

      // Selezione
      if (el.id === selectedElement) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        if (el.type === 'line') {
          ctx.strokeRect(
            Math.min(el.x, el.x2!) - 5,
            Math.min(el.y, el.y2!) - 5,
            Math.abs(el.x2! - el.x) + 10,
            Math.abs(el.y2! - el.y) + 10
          );
        } else if (el.type === 'rect') {
          ctx.strokeRect(el.x - 5, el.y - 5, el.width! + 10, el.height! + 10);
        } else if (el.type === 'circle') {
          ctx.strokeRect(el.x - el.radius! - 5, el.y - el.radius! - 5, el.radius! * 2 + 10, el.radius! * 2 + 10);
        } else {
          ctx.strokeRect(el.x - 5, el.y - 20, 40, 30);
        }
        ctx.setLineDash([]);
      }
    });

    // Preview disegno
    if (drawing && startPoint) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth / zoom;
      ctx.setLineDash([3 / zoom, 3 / zoom]);
      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPoint.x, startPoint.y, mousePos.x - startPoint.x, mousePos.y - startPoint.y);
      } else if (tool === 'circle') {
        const r = Math.sqrt(Math.pow(mousePos.x - startPoint.x, 2) + Math.pow(mousePos.y - startPoint.y, 2));
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [elementi, selectedElement, drawing, startPoint, mousePos, color, lineWidth, panOffset, zoom, showGrid, tool]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - panOffset.x) / zoom,
      y: (e.clientY - rect.top - panOffset.y) / zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    
    if (tool === 'select') {
      // Trova elemento sotto il cursore
      const clicked = [...elementi].reverse().find(el => {
        if (el.type === 'line') {
          const dist = Math.abs((el.y2! - el.y) * coords.x - (el.x2! - el.x) * coords.y + el.x2! * el.y - el.y2! * el.x) /
            Math.sqrt(Math.pow(el.y2! - el.y, 2) + Math.pow(el.x2! - el.x, 2));
          return dist < 10 && 
            coords.x >= Math.min(el.x, el.x2!) - 10 && 
            coords.x <= Math.max(el.x, el.x2!) + 10 &&
            coords.y >= Math.min(el.y, el.y2!) - 10 && 
            coords.y <= Math.max(el.y, el.y2!) + 10;
        } else if (el.type === 'rect') {
          return coords.x >= el.x && coords.x <= el.x + el.width! &&
                 coords.y >= el.y && coords.y <= el.y + el.height!;
        } else if (el.type === 'circle') {
          return Math.sqrt(Math.pow(coords.x - el.x, 2) + Math.pow(coords.y - el.y, 2)) <= el.radius!;
        } else {
          return Math.abs(coords.x - el.x) < 20 && Math.abs(coords.y - el.y) < 20;
        }
      });
      
      if (clicked) {
        setSelectedElement(clicked.id);
        setDragging(true);
        setDragOffset({ x: coords.x - clicked.x, y: coords.y - clicked.y });
      } else {
        setSelectedElement(null);
      }
    } else if (tool === 'pan') {
      setDragging(true);
      setDragOffset({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else if (tool === 'symbol') {
      const newEl: CadElement = {
        id: Date.now().toString(),
        type: 'symbol',
        x: coords.x,
        y: coords.y,
        symbolType: selectedSymbol,
        color,
        lineWidth,
      };
      onChange([...elementi, newEl]);
    } else if (tool === 'text') {
      const text = prompt('Inserisci il testo:');
      if (text) {
        const newEl: CadElement = {
          id: Date.now().toString(),
          type: 'text',
          x: coords.x,
          y: coords.y,
          text,
          color,
          lineWidth,
        };
        onChange([...elementi, newEl]);
      }
    } else {
      setDrawing(true);
      setStartPoint(coords);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setMousePos(coords);

    if (dragging && tool === 'select' && selectedElement) {
      const el = elementi.find(e => e.id === selectedElement);
      if (el) {
        const dx = coords.x - dragOffset.x - el.x;
        const dy = coords.y - dragOffset.y - el.y;
        const updated = elementi.map(e => {
          if (e.id !== selectedElement) return e;
          if (e.type === 'line') {
            return { ...e, x: e.x + dx, y: e.y + dy, x2: e.x2! + dx, y2: e.y2! + dy };
          }
          return { ...e, x: e.x + dx, y: e.y + dy };
        });
        onChange(updated);
        setDragOffset({ x: coords.x - (el.x + dx), y: coords.y - (el.y + dy) });
      }
    } else if (dragging && tool === 'pan') {
      setPanOffset({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && startPoint) {
      const coords = getCanvasCoords(e);
      let newEl: CadElement | null = null;

      if (tool === 'line') {
        newEl = {
          id: Date.now().toString(),
          type: 'line',
          x: startPoint.x,
          y: startPoint.y,
          x2: coords.x,
          y2: coords.y,
          color,
          lineWidth,
        };
      } else if (tool === 'rect') {
        newEl = {
          id: Date.now().toString(),
          type: 'rect',
          x: Math.min(startPoint.x, coords.x),
          y: Math.min(startPoint.y, coords.y),
          width: Math.abs(coords.x - startPoint.x),
          height: Math.abs(coords.y - startPoint.y),
          color,
          lineWidth,
        };
      } else if (tool === 'circle') {
        const r = Math.sqrt(Math.pow(coords.x - startPoint.x, 2) + Math.pow(coords.y - startPoint.y, 2));
        newEl = {
          id: Date.now().toString(),
          type: 'circle',
          x: startPoint.x,
          y: startPoint.y,
          radius: r,
          color,
          lineWidth,
        };
      }

      if (newEl) {
        onChange([...elementi, newEl]);
      }
    }
    setDrawing(false);
    setStartPoint(null);
    setDragging(false);
  };

  const deleteSelected = () => {
    if (selectedElement) {
      onChange(elementi.filter(e => e.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const clearAll = () => {
    if (confirm('Sei sicuro di voler cancellare tutto lo schema?')) {
      onChange([]);
      setSelectedElement(null);
    }
  };

  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `schema_impianto_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const simboli = symbolCategory === 'elettrici' ? SIMBOLI_ELETTRICI : SIMBOLI_IDRAULICI;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-drafting-compass text-2xl"></i>
            <div>
              <h2 className="font-bold text-lg">Mini CAD - Schema Impianto</h2>
              <p className="text-blue-200 text-xs">Editor grafico per schemi elettrici e idraulici</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-yellow-300 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Toolbar sinistra */}
          <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-3 gap-2">
            <button
              onClick={() => setTool('select')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'select' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Seleziona (V)"
            >
              <i className="fas fa-mouse-pointer"></i>
            </button>
            <button
              onClick={() => setTool('pan')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'pan' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Pan (H)"
            >
              <i className="fas fa-hand-paper"></i>
            </button>
            <div className="w-8 h-px bg-gray-300 my-1"></div>
            <button
              onClick={() => setTool('line')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'line' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Linea (L)"
            >
              <i className="fas fa-minus"></i>
            </button>
            <button
              onClick={() => setTool('rect')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'rect' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Rettangolo (R)"
            >
              <i className="far fa-square"></i>
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'circle' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Cerchio (C)"
            >
              <i className="far fa-circle"></i>
            </button>
            <button
              onClick={() => setTool('text')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'text' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Testo (T)"
            >
              <i className="fas fa-font"></i>
            </button>
            <button
              onClick={() => setTool('symbol')}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'symbol' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              title="Simbolo (S)"
            >
              <i className="fas fa-shapes"></i>
            </button>
            <div className="w-8 h-px bg-gray-300 my-1"></div>
            <button
              onClick={deleteSelected}
              disabled={!selectedElement}
              className="w-11 h-11 rounded-lg flex items-center justify-center bg-white text-red-600 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Elimina (DEL)"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>

          {/* Palette simboli */}
          {tool === 'symbol' && (
            <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto p-3">
              <div className="flex gap-1 mb-3">
                <button
                  onClick={() => setSymbolCategory('elettrici')}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${symbolCategory === 'elettrici' ? 'bg-yellow-400 text-gray-900' : 'bg-white text-gray-600'}`}
                >
                  ⚡ Elettrici
                </button>
                <button
                  onClick={() => setSymbolCategory('idraulici')}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${symbolCategory === 'idraulici' ? 'bg-blue-400 text-white' : 'bg-white text-gray-600'}`}
                >
                  🚿 Idraulici
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {simboli.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSymbol(s.id)}
                    className={`p-2 rounded-lg text-center transition ${selectedSymbol === s.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-xs">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 bg-gray-200 relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              className="bg-white cursor-crosshair"
              style={{ width: '100%', height: '100%' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { setDrawing(false); setDragging(false); }}
            />
            {/* Info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white text-xs p-2 flex items-center justify-between">
              <div className="flex gap-4">
                <span>Strumento: <strong>{tool}</strong></span>
                <span>Pos: ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})</span>
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span>Elementi: {elementi.length}</span>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
                  Griglia
                </label>
              </div>
            </div>
          </div>

          {/* Pannello proprietà */}
          <div className="w-56 bg-gray-50 border-l border-gray-200 overflow-y-auto p-3 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Proprietà</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Colore</label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Spessore: {lineWidth}px</label>
                  <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-full" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Vista</h3>
              <div className="space-y-2">
                <div className="flex gap-1">
                  <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="flex-1 px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">-</button>
                  <button onClick={() => setZoom(1)}
                    className="flex-1 px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">100%</button>
                  <button onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    className="flex-1 px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">+</button>
                </div>
                <button onClick={() => { setPanOffset({x: 0, y: 0}); setZoom(1); }}
                  className="w-full px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">
                  <i className="fas fa-home mr-1"></i> Reset Vista
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Azioni</h3>
              <div className="space-y-2">
                <button onClick={exportPNG}
                  className="w-full px-2 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                  <i className="fas fa-download mr-1"></i> Esporta PNG
                </button>
                <button onClick={clearAll}
                  className="w-full px-2 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                  <i className="fas fa-trash mr-1"></i> Cancella Tutto
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Tasti Rapidi</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><kbd className="bg-gray-200 px-1 rounded">V</kbd> Seleziona</p>
                <p><kbd className="bg-gray-200 px-1 rounded">L</kbd> Linea</p>
                <p><kbd className="bg-gray-200 px-1 rounded">R</kbd> Rettangolo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">C</kbd> Cerchio</p>
                <p><kbd className="bg-gray-200 px-1 rounded">T</kbd> Testo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">S</kbd> Simbolo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">DEL</kbd> Elimina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 p-3 flex justify-end gap-2">
          <button onClick={clearAll} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm">
            <i className="fas fa-trash mr-1"></i> Cancella
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <i className="fas fa-check mr-1"></i> Conferma e Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

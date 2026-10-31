import { useRef, useState, useEffect, useCallback } from 'react';

export interface CadElement {
  id: string;
  type: 'line' | 'rect' | 'circle' | 'text' | 'symbol' | 'wall' | 'connector' | 'dimension' | 'block';
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
  layer?: string;
  // Per connettori
  fromId?: string;
  toId?: string;
  // Per blocchi
  blockType?: string;
  elements?: CadElement[];
  // Per resize
  scale?: number;
}

export interface MiniCADProps {
  elementi: CadElement[];
  onChange: (elementi: CadElement[]) => void;
  onClose: () => void;
  impiantoId?: string;
}

export const SIMBOLI_ELETTRICI = [
  { id: 'presa', label: 'Presa', icon: '⏚', connectors: ['top', 'bottom'] },
  { id: 'presa_doppia', label: 'Presa Doppia', icon: '⏚⏚', connectors: ['top', 'bottom'] },
  { id: 'interruttore', label: 'Interruttore', icon: '⏻', connectors: ['left', 'right'] },
  { id: 'deviatore', label: 'Deviatore', icon: '⎊', connectors: ['left', 'right', 'top'] },
  { id: 'pulsante', label: 'Pulsante', icon: '◉', connectors: ['left', 'right'] },
  { id: 'lampada', label: 'Punto Luce', icon: '💡', connectors: ['top'] },
  { id: 'lampada_parete', label: 'Applique', icon: '🔆', connectors: ['bottom'] },
  { id: 'quadro', label: 'Quadro Elettrico', icon: '▣', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'differenziale', label: 'Differenziale', icon: '⊿', connectors: ['left', 'right'] },
  { id: 'magnetotermico', label: 'Magnetotermico', icon: '⏏', connectors: ['left', 'right'] },
  { id: 'scatola_der', label: 'Scatola Derivazione', icon: '⬜', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'termostato', label: 'Termostato', icon: '🌡', connectors: ['bottom'] },
  { id: 'citofono', label: 'Citofono', icon: '📞', connectors: ['bottom'] },
  { id: 'antenna', label: 'Presa TV', icon: '📺', connectors: ['bottom'] },
  { id: 'rilevatore', label: 'Rilevatore', icon: '⚠', connectors: ['bottom'] },
  { id: 'sirena', label: 'Sirena', icon: '🔔', connectors: ['bottom'] },
];

export const SIMBOLI_IDRAULICI = [
  { id: 'rubinetto', label: 'Rubinetto', icon: '🚰', connectors: ['bottom'] },
  { id: 'lavabo', label: 'Lavabo', icon: '🚿', connectors: ['bottom', 'left', 'right'] },
  { id: 'wc', label: 'WC', icon: '🚽', connectors: ['bottom'] },
  { id: 'bidet', label: 'Bidet', icon: '🚿', connectors: ['bottom'] },
  { id: 'vasca', label: 'Vasca', icon: '🛁', connectors: ['left', 'right'] },
  { id: 'piatto_doccia', label: 'Piatto Doccia', icon: '🚿', connectors: ['bottom'] },
  { id: 'lavello', label: 'Lavello', icon: '🍽', connectors: ['bottom', 'left', 'right'] },
  { id: 'lavatrice', label: 'Lavatrice', icon: '🧺', connectors: ['top'] },
  { id: 'lavastoviglie', label: 'Lavastoviglie', icon: '🍴', connectors: ['top'] },
  { id: 'caldaia', label: 'Caldaia', icon: '🔥', connectors: ['left', 'right', 'bottom'] },
  { id: 'radiatore', label: 'Radiatore', icon: '🌡', connectors: ['left', 'right'] },
  { id: 'valvola', label: 'Valvola', icon: '⊗', connectors: ['left', 'right'] },
  { id: 'contatore', label: 'Contatore', icon: '⏱', connectors: ['left', 'right'] },
];

export const SIMBOLI_ARCHITETTONICI = [
  { id: 'porta', label: 'Porta', icon: '🚪', connectors: ['left', 'right'] },
  { id: 'finestra', label: 'Finestra', icon: '🪟', connectors: ['left', 'right'] },
  { id: 'scala', label: 'Scala', icon: '🪜', connectors: ['top', 'bottom'] },
  { id: 'ascensore', label: 'Ascensore', icon: '🛗', connectors: ['left', 'right', 'top', 'bottom'] },
];

export const SIMBOLI_FGAS = [
  { id: 'unita_esterna', label: 'Unità Esterna', icon: '🌡️', connectors: ['left', 'right', 'bottom'] },
  { id: 'unita_interna', label: 'Unità Interna', icon: '❄️', connectors: ['left', 'right', 'bottom'] },
  { id: 'split', label: 'Split', icon: '🌀', connectors: ['bottom'] },
  { id: 'multisplit', label: 'Multi-Split', icon: '🔀', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'chiller', label: 'Chiller', icon: '🧊', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'vrv_vrf', label: 'VRV/VRF', icon: '⚡', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'tubo_frigorifero', label: 'Tubo Frigorifero', icon: '🔵', connectors: ['left', 'right'] },
  { id: 'valvola_espansione', label: 'Valvola Espansione', icon: '⭕', connectors: ['left', 'right'] },
  { id: 'compressore', label: 'Compressore', icon: '⚙️', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'condensatore', label: 'Condensatore', icon: '🔥', connectors: ['left', 'right'] },
  { id: 'evaporatore', label: 'Evaporatore', icon: '💨', connectors: ['left', 'right'] },
  { id: 'serbatoio', label: 'Serbatoio', icon: '🛢️', connectors: ['top', 'bottom'] },
  { id: 'filtro_disidratatore', label: 'Filtro Disidratatore', icon: '🔘', connectors: ['left', 'right'] },
  { id: 'scambiatore', label: 'Scambiatore', icon: '🔄', connectors: ['left', 'right', 'top', 'bottom'] },
  { id: 'ventilatore', label: 'Ventilatore', icon: '🌬️', connectors: ['bottom'] },
  { id: 'termostato_ambiente', label: 'Termostato Ambiente', icon: '🌡', connectors: ['bottom'] },
];

type Tool = 'select' | 'line' | 'rect' | 'circle' | 'text' | 'symbol' | 'wall' | 'door' | 'window' | 'pan' | 'measure' | 'connector' | 'dimension' | 'align' | 'rotate' | 'mirror';

export default function MiniCAD({ elementi, onChange, onClose, impiantoId }: MiniCADProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [tool, setTool] = useState<Tool>('select');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('presa');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [color, setColor] = useState('#1e40af');
  const [lineWidth, setLineWidth] = useState(2);
  const [panOffset, setPanOffset] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [symbolCategory, setSymbolCategory] = useState<'elettrici' | 'idraulici' | 'architettonici' | 'fgas'>('elettrici');
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeLayer, setActiveLayer] = useState('default');
  const [showLayers, setShowLayers] = useState(false);
  const [layers, setLayers] = useState([
    { id: 'default', name: 'Default', visible: true, color: '#1e40af' },
    { id: 'walls', name: 'Muri', visible: true, color: '#000000' },
    { id: 'electric', name: 'Elettrico', visible: true, color: '#dc2626' },
    { id: 'plumbing', name: 'Idraulico', visible: true, color: '#2563eb' },
  ]);
  const [undoStack, setUndoStack] = useState<CadElement[][]>([]);
  const [redoStack, setRedoStack] = useState<CadElement[][]>([]);
  const [measuring, setMeasuring] = useState<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);
  const [clipboard, setClipboard] = useState<CadElement[]>([]);
  const [autoConnect, setAutoConnect] = useState(true);
  const [selectionBox, setSelectionBox] = useState<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);
  const [resizing, setResizing] = useState<{elementId: string, handle: string, startX: number, startY: number, originalElement: CadElement} | null>(null);
  const [rotating, setRotating] = useState<{elementId: string, centerX: number, centerY: number, startAngle: number} | null>(null);

  // Salva stato per undo
  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-20), [...elementi]]);
    setRedoStack([]);
  }, [elementi]);

  // Undo
  const undo = () => {
    if (undoStack.length === 0) return;
    const prevState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, [...elementi]]);
    setUndoStack(prev => prev.slice(0, -1));
    onChange(prevState);
  };

  // Redo
  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, [...elementi]]);
    setRedoStack(prev => prev.slice(0, -1));
    onChange(nextState);
  };

  // Copia elementi selezionati
  const copySelected = () => {
    const selected = elementi.filter(e => selectedElements.includes(e.id));
    setClipboard(selected);
  };

  // Incolla elementi
  const pasteElements = () => {
    if (clipboard.length === 0) return;
    saveState();
    const newElements = clipboard.map(e => ({
      ...e,
      id: Date.now().toString() + Math.random(),
      x: e.x + 50,
      y: e.y + 50,
      x2: e.x2 ? e.x2 + 50 : undefined,
      y2: e.y2 ? e.y2 + 50 : undefined,
    }));
    onChange([...elementi, ...newElements]);
    setSelectedElements(newElements.map(e => e.id));
  };

  // Elimina elementi selezionati
  const deleteSelected = () => {
    if (selectedElements.length === 0) return;
    saveState();
    onChange(elementi.filter(e => !selectedElements.includes(e.id)));
    setSelectedElements([]);
  };

  // Ruota elementi selezionati
  const rotateSelected = (degrees: number) => {
    if (selectedElements.length === 0) return;
    saveState();
    const updated = elementi.map(e => {
      if (!selectedElements.includes(e.id)) return e;
      return { ...e, rotation: ((e.rotation || 0) + degrees) % 360 };
    });
    onChange(updated);
  };

  // Specchia elementi selezionati
  const mirrorSelected = (direction: 'horizontal' | 'vertical') => {
    if (selectedElements.length === 0) return;
    saveState();
    const updated = elementi.map(e => {
      if (!selectedElements.includes(e.id)) return e;
      if (direction === 'horizontal') {
        return { ...e, x: -e.x, rotation: e.rotation ? 180 - e.rotation : 180 };
      } else {
        return { ...e, y: -e.y, rotation: e.rotation ? -e.rotation : 0 };
      }
    });
    onChange(updated);
  };

  // Allinea elementi selezionati
  const alignSelected = (alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v') => {
    if (selectedElements.length < 2) return;
    saveState();
    const selected = elementi.filter(e => selectedElements.includes(e.id));
    
    let targetValue = 0;
    switch (alignment) {
      case 'left':
        targetValue = Math.min(...selected.map(e => e.x));
        break;
      case 'right':
        targetValue = Math.max(...selected.map(e => e.x + (e.width || 40)));
        break;
      case 'top':
        targetValue = Math.min(...selected.map(e => e.y));
        break;
      case 'bottom':
        targetValue = Math.max(...selected.map(e => e.y + (e.height || 40)));
        break;
      case 'center-h':
        const minX = Math.min(...selected.map(e => e.x));
        const maxX = Math.max(...selected.map(e => e.x + (e.width || 40)));
        targetValue = (minX + maxX) / 2;
        break;
      case 'center-v':
        const minY = Math.min(...selected.map(e => e.y));
        const maxY = Math.max(...selected.map(e => e.y + (e.height || 40)));
        targetValue = (minY + maxY) / 2;
        break;
    }

    const updated = elementi.map(e => {
      if (!selectedElements.includes(e.id)) return e;
      switch (alignment) {
        case 'left':
        case 'right':
        case 'center-h':
          return { ...e, x: targetValue };
        case 'top':
        case 'bottom':
        case 'center-v':
          return { ...e, y: targetValue };
        default:
          return e;
      }
    });
    onChange(updated);
  };

  // Crea connettore automatico tra due elementi
  const createAutoConnector = (fromId: string, toId: string) => {
    const fromEl = elementi.find(e => e.id === fromId);
    const toEl = elementi.find(e => e.id === toId);
    if (!fromEl || !toEl) return;

    saveState();
    const connector: CadElement = {
      id: Date.now().toString(),
      type: 'connector',
      x: fromEl.x,
      y: fromEl.y,
      x2: toEl.x,
      y2: toEl.y,
      color: '#1e40af',
      lineWidth: 2,
      layer: activeLayer,
      fromId,
      toId,
    };
    onChange([...elementi, connector]);
  };

  // Trova punto di connessione più vicino
  const findNearestConnector = (x: number, y: number, excludeId?: string) => {
    let nearest: { id: string; x: number; y: number; distance: number } | null = null;
    
    elementi.forEach(el => {
      if (el.id === excludeId) return;
      if (el.type !== 'symbol') return;
      
      const simbolo = [...SIMBOLI_ELETTRICI, ...SIMBOLI_IDRAULICI, ...SIMBOLI_ARCHITETTONICI, ...SIMBOLI_FGAS].find(s => s.id === el.symbolType);
      if (!simbolo) return;

      // Calcola punti di connessione basati sui connettori del simbolo
      simbolo.connectors.forEach(conn => {
        let connX = el.x;
        let connY = el.y;
        
        switch (conn) {
          case 'top': connY -= 20; break;
          case 'bottom': connY += 20; break;
          case 'left': connX -= 20; break;
          case 'right': connX += 20; break;
        }

        const distance = Math.sqrt(Math.pow(x - connX, 2) + Math.pow(y - connY, 2));
        if (!nearest || distance < nearest.distance) {
          nearest = { id: el.id, x: connX, y: connY, distance };
        }
      });
    });

    return nearest;
  };

  // Snap to grid
  const snap = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === 'c') { e.preventDefault(); copySelected(); }
        if (e.key === 'v') { e.preventDefault(); pasteElements(); }
      }
      if (e.key === 'Delete' && selectedElements.length > 0) {
        deleteSelected();
      }
      if (e.key === 'Escape') {
        setSelectedElements([]);
        setDrawing(false);
      }
      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') setTool('select');
      if (e.key === 'l' || e.key === 'L') setTool('line');
      if (e.key === 'r' || e.key === 'R') setTool('rect');
      if (e.key === 'c' || e.key === 'C') setTool('circle');
      if (e.key === 't' || e.key === 'T') setTool('text');
      if (e.key === 's' || e.key === 'S') setTool('symbol');
      if (e.key === 'w' || e.key === 'W') setTool('wall');
      if (e.key === 'm' || e.key === 'M') setTool('measure');
      if (e.key === 'n' || e.key === 'N') setTool('connector');
      if (e.key === 'd' || e.key === 'D') setTool('dimension');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, undoStack, redoStack, elementi, clipboard]);

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
      const layer = layers.find(l => l.id === el.layer);
      if (layer && !layer.visible) return;

      ctx.save();
      ctx.translate(el.x, el.y);
      if (el.rotation) {
        ctx.rotate((el.rotation * Math.PI) / 180);
      }
      ctx.translate(-el.x, -el.y);

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
        const simbolo = [...SIMBOLI_ELETTRICI, ...SIMBOLI_IDRAULICI, ...SIMBOLI_ARCHITETTONICI, ...SIMBOLI_FGAS].find(s => s.id === el.symbolType);
        if (simbolo) {
          ctx.font = `${24 / zoom}px sans-serif`;
          ctx.fillText(simbolo.icon, el.x - 12 / zoom, el.y + 8 / zoom);
          ctx.font = `${10 / zoom}px sans-serif`;
          ctx.fillStyle = '#374151';
          ctx.fillText(simbolo.label, el.x - 20 / zoom, el.y + 24 / zoom);

          // Disegna punti di connessione se autoConnect è attivo
          if (autoConnect) {
            ctx.fillStyle = '#10b981';
            simbolo.connectors.forEach(conn => {
              let connX = el.x;
              let connY = el.y;
              switch (conn) {
                case 'top': connY -= 20; break;
                case 'bottom': connY += 20; break;
                case 'left': connX -= 20; break;
                case 'right': connX += 20; break;
              }
              ctx.beginPath();
              ctx.arc(connX, connY, 3 / zoom, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }
      } else if (el.type === 'wall') {
        ctx.lineWidth = el.lineWidth * 2;
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x2!, el.y2!);
        ctx.stroke();
      } else if (el.type === 'connector') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x2!, el.y2!);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (el.type === 'dimension') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x2!, el.y2!);
        ctx.stroke();
        
        // Etichetta dimensione
        const dist = Math.sqrt(Math.pow(el.x2! - el.x, 2) + Math.pow(el.y2! - el.y, 2));
        const midX = (el.x + el.x2!) / 2;
        const midY = (el.y + el.y2!) / 2;
        ctx.fillStyle = '#f59e0b';
        ctx.font = `${12 / zoom}px sans-serif`;
        ctx.fillText(`${dist.toFixed(0)}`, midX + 10, midY - 10);
      }

      // Selezione e resize handles
      if (selectedElements.includes(el.id)) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        
        let bounds = { x: 0, y: 0, w: 0, h: 0 };
        
        if (el.type === 'line' || el.type === 'wall' || el.type === 'connector' || el.type === 'dimension') {
          bounds = {
            x: Math.min(el.x, el.x2!) - 5,
            y: Math.min(el.y, el.y2!) - 5,
            w: Math.abs(el.x2! - el.x) + 10,
            h: Math.abs(el.y2! - el.y) + 10
          };
        } else if (el.type === 'rect') {
          bounds = { x: el.x - 5, y: el.y - 5, w: el.width! + 10, h: el.height! + 10 };
        } else if (el.type === 'circle') {
          bounds = { x: el.x - el.radius! - 5, y: el.y - el.radius! - 5, w: el.radius! * 2 + 10, h: el.radius! * 2 + 10 };
        } else {
          bounds = { x: el.x - 25, y: el.y - 25, w: 50, h: 50 };
        }
        
        ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.setLineDash([]);
        
        // Disegna resize handles
        const handleSize = 6 / zoom;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5 / zoom;
        
        // Angoli
        const corners = [
          { x: bounds.x, y: bounds.y }, // top-left
          { x: bounds.x + bounds.w, y: bounds.y }, // top-right
          { x: bounds.x, y: bounds.y + bounds.h }, // bottom-left
          { x: bounds.x + bounds.w, y: bounds.y + bounds.h }, // bottom-right
        ];
        
        corners.forEach(corner => {
          ctx.fillRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
          ctx.strokeRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
        });
        
        // Handle di rotazione (sopra il centro)
        const rotationHandleY = bounds.y - 20 / zoom;
        const rotationHandleX = bounds.x + bounds.w / 2;
        ctx.beginPath();
        ctx.arc(rotationHandleX, rotationHandleY, handleSize/2 + 2/zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Linea che collega al centro
        ctx.beginPath();
        ctx.moveTo(bounds.x + bounds.w / 2, bounds.y);
        ctx.lineTo(rotationHandleX, rotationHandleY);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Selection box
    if (selectionBox) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      ctx.strokeRect(
        selectionBox.start.x,
        selectionBox.start.y,
        selectionBox.end.x - selectionBox.start.x,
        selectionBox.end.y - selectionBox.start.y
      );
      ctx.setLineDash([]);
    }

    // Misurazione
    if (measuring) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([5 / zoom, 5 / zoom]);
      ctx.beginPath();
      ctx.moveTo(measuring.start.x, measuring.start.y);
      ctx.lineTo(measuring.end.x, measuring.end.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      const dist = Math.sqrt(Math.pow(measuring.end.x - measuring.start.x, 2) + Math.pow(measuring.end.y - measuring.start.y, 2));
      const midX = (measuring.start.x + measuring.end.x) / 2;
      const midY = (measuring.start.y + measuring.end.y) / 2;
      
      ctx.fillStyle = '#f59e0b';
      ctx.font = `${12 / zoom}px sans-serif`;
      ctx.fillText(`${dist.toFixed(0)} px`, midX + 10, midY - 10);
    }

    // Preview disegno
    if (drawing && startPoint) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth / zoom;
      ctx.setLineDash([3 / zoom, 3 / zoom]);
      if (tool === 'line' || tool === 'wall' || tool === 'connector' || tool === 'dimension') {
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
  }, [elementi, selectedElements, drawing, startPoint, mousePos, color, lineWidth, panOffset, zoom, showGrid, gridSize, tool, measuring, layers, autoConnect, selectionBox]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    
    // Calcola il rapporto tra dimensioni reali del canvas e dimensioni visualizzate
    // Questo è fondamentale quando il canvas viene scalato via CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Converti coordinate mouse in coordinate canvas reali
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    // Applica pan e zoom per ottenere coordinate del mondo
    const x = (canvasX - panOffset.x) / zoom;
    const y = (canvasY - panOffset.y) / zoom;
    
    return {
      x: snapToGrid ? snap(x) : x,
      y: snapToGrid ? snap(y) : y,
    };
  };

  // Funzione per rilevare handle di resize/rotazione
  const detectHandle = (coords: {x: number, y: number}, element: CadElement): string | null => {
    if (!selectedElements.includes(element.id)) return null;
    
    const handleSize = 8 / zoom;
    let bounds = { x: 0, y: 0, w: 0, h: 0 };
    
    if (element.type === 'line' || element.type === 'wall' || element.type === 'connector' || element.type === 'dimension') {
      bounds = {
        x: Math.min(element.x, element.x2!) - 5,
        y: Math.min(element.y, element.y2!) - 5,
        w: Math.abs(element.x2! - element.x) + 10,
        h: Math.abs(element.y2! - element.y) + 10
      };
    } else if (element.type === 'rect') {
      bounds = { x: element.x - 5, y: element.y - 5, w: element.width! + 10, h: element.height! + 10 };
    } else if (element.type === 'circle') {
      bounds = { x: element.x - element.radius! - 5, y: element.y - element.radius! - 5, w: element.radius! * 2 + 10, h: element.radius! * 2 + 10 };
    } else {
      bounds = { x: element.x - 25, y: element.y - 25, w: 50, h: 50 };
    }
    
    // Controlla handle di rotazione
    const rotationHandleY = bounds.y - 20 / zoom;
    const rotationHandleX = bounds.x + bounds.w / 2;
    const distToRotation = Math.sqrt(Math.pow(coords.x - rotationHandleX, 2) + Math.pow(coords.y - rotationHandleY, 2));
    if (distToRotation < handleSize) {
      return 'rotate';
    }
    
    // Controlla handle di resize (angoli)
    const corners = [
      { x: bounds.x, y: bounds.y, name: 'tl' },
      { x: bounds.x + bounds.w, y: bounds.y, name: 'tr' },
      { x: bounds.x, y: bounds.y + bounds.h, name: 'bl' },
      { x: bounds.x + bounds.w, y: bounds.y + bounds.h, name: 'br' },
    ];
    
    for (const corner of corners) {
      if (Math.abs(coords.x - corner.x) < handleSize && Math.abs(coords.y - corner.y) < handleSize) {
        return corner.name;
      }
    }
    
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    
    if (tool === 'select') {
      // Controlla prima se c'è un handle sotto il cursore
      if (selectedElements.length === 1) {
        const selectedEl = elementi.find(el => el.id === selectedElements[0]);
        if (selectedEl) {
          const handle = detectHandle(coords, selectedEl);
          if (handle) {
            if (handle === 'rotate') {
              // Inizia rotazione
              const centerX = selectedEl.type === 'rect' ? selectedEl.x + selectedEl.width! / 2 : selectedEl.x;
              const centerY = selectedEl.type === 'rect' ? selectedEl.y + selectedEl.height! / 2 : selectedEl.y;
              const startAngle = Math.atan2(coords.y - centerY, coords.x - centerX);
              setRotating({ elementId: selectedEl.id, centerX, centerY, startAngle });
              saveState();
              return;
            } else {
              // Inizia resize
              setResizing({ elementId: selectedEl.id, handle, startX: coords.x, startY: coords.y, originalElement: { ...selectedEl } });
              saveState();
              return;
            }
          }
        }
      }
      
      const clicked = [...elementi].reverse().find(el => {
        if (el.type === 'line' || el.type === 'wall' || el.type === 'connector' || el.type === 'dimension') {
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
          return Math.abs(coords.x - el.x) < 25 && Math.abs(coords.y - el.y) < 25;
        }
      });
      
      if (clicked) {
        if (e.shiftKey) {
          // Selezione multipla
          setSelectedElements(prev => 
            prev.includes(clicked.id) 
              ? prev.filter(id => id !== clicked.id)
              : [...prev, clicked.id]
          );
        } else {
          setSelectedElements([clicked.id]);
        }
        setDragging(true);
        setDragOffset({ x: coords.x - clicked.x, y: coords.y - clicked.y });
      } else {
        setSelectedElements([]);
        // Inizia selection box
        setSelectionBox({ start: coords, end: coords });
      }
    } else if (tool === 'pan') {
      setDragging(true);
      setDragOffset({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else if (tool === 'measure') {
      setMeasuring({ start: coords, end: coords });
      setDrawing(true);
      setStartPoint(coords);
    } else if (tool === 'symbol') {
      saveState();
      const newEl: CadElement = {
        id: Date.now().toString(),
        type: 'symbol',
        x: coords.x,
        y: coords.y,
        symbolType: selectedSymbol,
        color,
        lineWidth,
        layer: activeLayer,
      };
      onChange([...elementi, newEl]);
    } else if (tool === 'text') {
      const text = prompt('Inserisci il testo:');
      if (text) {
        saveState();
        const newEl: CadElement = {
          id: Date.now().toString(),
          type: 'text',
          x: coords.x,
          y: coords.y,
          text,
          color,
          lineWidth,
          layer: activeLayer,
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

    if (tool === 'measure' && drawing && startPoint) {
      setMeasuring({ start: startPoint, end: coords });
    }

    if (selectionBox && tool === 'select') {
      setSelectionBox({ ...selectionBox, end: coords });
    }

    // Gestione resize
    if (resizing) {
      const dx = coords.x - resizing.startX;
      const dy = coords.y - resizing.startY;
      const orig = resizing.originalElement;
      
      const updated = elementi.map(el => {
        if (el.id !== resizing.elementId) return el;
        
        if (el.type === 'rect') {
          let newX = el.x;
          let newY = el.y;
          let newW = el.width!;
          let newH = el.height!;
          
          switch (resizing.handle) {
            case 'br':
              newW = Math.max(10, orig.width! + dx);
              newH = Math.max(10, orig.height! + dy);
              break;
            case 'bl':
              newX = orig.x + dx;
              newW = Math.max(10, orig.width! - dx);
              newH = Math.max(10, orig.height! + dy);
              break;
            case 'tr':
              newY = orig.y + dy;
              newW = Math.max(10, orig.width! + dx);
              newH = Math.max(10, orig.height! - dy);
              break;
            case 'tl':
              newX = orig.x + dx;
              newY = orig.y + dy;
              newW = Math.max(10, orig.width! - dx);
              newH = Math.max(10, orig.height! - dy);
              break;
          }
          
          return { ...el, x: newX, y: newY, width: newW, height: newH };
        } else if (el.type === 'circle') {
          const newRadius = Math.max(5, orig.radius! + Math.max(dx, dy));
          return { ...el, radius: newRadius };
        }
        
        return el;
      });
      
      onChange(updated);
      return;
    }

    // Gestione rotazione
    if (rotating) {
      const currentAngle = Math.atan2(coords.y - rotating.centerY, coords.x - rotating.centerX);
      const angleDiff = (currentAngle - rotating.startAngle) * (180 / Math.PI);
      
      const updated = elementi.map(el => {
        if (el.id !== rotating.elementId) return el;
        return { ...el, rotation: ((el.rotation || 0) + angleDiff) % 360 };
      });
      
      onChange(updated);
      rotating.startAngle = currentAngle;
      return;
    }

    if (dragging && tool === 'select' && selectedElements.length > 0) {
      const dx = coords.x - dragOffset.x;
      const dy = coords.y - dragOffset.y;
      
      const updated = elementi.map(e => {
        if (!selectedElements.includes(e.id)) return e;
        if (e.type === 'line' || e.type === 'wall' || e.type === 'connector' || e.type === 'dimension') {
          return { ...e, x: e.x + dx, y: e.y + dy, x2: e.x2! + dx, y2: e.y2! + dy };
        }
        return { ...e, x: e.x + dx, y: e.y + dy };
      });
      onChange(updated);
      setDragOffset({ x: coords.x - (elementi.find(e => e.id === selectedElements[0])?.x || 0), y: coords.y - (elementi.find(e => e.id === selectedElements[0])?.y || 0) });
    } else if (dragging && tool === 'pan') {
      setPanOffset({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Termina resize o rotazione
    if (resizing) {
      setResizing(null);
      return;
    }
    if (rotating) {
      setRotating(null);
      return;
    }

    if (tool === 'select' && selectionBox) {
      // Seleziona elementi dentro il box
      const box = selectionBox;
      const minX = Math.min(box.start.x, box.end.x);
      const maxX = Math.max(box.start.x, box.end.x);
      const minY = Math.min(box.start.y, box.end.y);
      const maxY = Math.max(box.start.y, box.end.y);

      const selected = elementi.filter(el => {
        return el.x >= minX && el.x <= maxX && el.y >= minY && el.y <= maxY;
      }).map(el => el.id);

      if (selected.length > 0) {
        setSelectedElements(selected);
      }
      setSelectionBox(null);
    }

    if (tool === 'measure') {
      setMeasuring(null);
      setDrawing(false);
      setStartPoint(null);
      setDragging(false);
      return;
    }

    if (drawing && startPoint) {
      const coords = getCanvasCoords(e);
      let newEl: CadElement | null = null;

      saveState();

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
          layer: activeLayer,
        };
      } else if (tool === 'wall') {
        newEl = {
          id: Date.now().toString(),
          type: 'wall',
          x: startPoint.x,
          y: startPoint.y,
          x2: coords.x,
          y2: coords.y,
          color: '#000000',
          lineWidth: 4,
          layer: 'walls',
        };
      } else if (tool === 'connector') {
        newEl = {
          id: Date.now().toString(),
          type: 'connector',
          x: startPoint.x,
          y: startPoint.y,
          x2: coords.x,
          y2: coords.y,
          color: '#10b981',
          lineWidth: 2,
          layer: activeLayer,
        };
      } else if (tool === 'dimension') {
        newEl = {
          id: Date.now().toString(),
          type: 'dimension',
          x: startPoint.x,
          y: startPoint.y,
          x2: coords.x,
          y2: coords.y,
          color: '#f59e0b',
          lineWidth: 1,
          layer: activeLayer,
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
          layer: activeLayer,
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
          layer: activeLayer,
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

  const clearAll = () => {
    if (confirm('Sei sicuro di voler cancellare tutto lo schema?')) {
      saveState();
      onChange([]);
      setSelectedElements([]);
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const simboli = symbolCategory === 'elettrici' ? SIMBOLI_ELETTRICI : symbolCategory === 'idraulici' ? SIMBOLI_IDRAULICI : symbolCategory === 'fgas' ? SIMBOLI_FGAS : SIMBOLI_ARCHITETTONICI;

  return (
    <div ref={containerRef} className={`fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 ${isFullScreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full ${isFullScreen ? 'h-full' : 'h-[90vh]'} max-w-7xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-drafting-compass text-2xl"></i>
            <div>
              <h2 className="font-bold text-lg">Mini CAD Professionale</h2>
              <p className="text-blue-200 text-xs">Editor grafico con connettori automatici</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleFullScreen} className="text-white hover:text-yellow-300 transition" title="Full Screen">
              <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'} text-xl`}></i>
            </button>
            <button onClick={onClose} className="text-white hover:text-yellow-300 transition">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Toolbar sinistra */}
          <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-3 gap-2 overflow-y-auto">
            <button onClick={() => setTool('select')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'select' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Seleziona (V)">
              <i className="fas fa-mouse-pointer"></i>
            </button>
            <button onClick={() => setTool('pan')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'pan' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Pan (H)">
              <i className="fas fa-hand-paper"></i>
            </button>
            <div className="w-8 h-px bg-gray-300 my-1"></div>
            <button onClick={() => setTool('line')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'line' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Linea (L)">
              <i className="fas fa-minus"></i>
            </button>
            <button onClick={() => setTool('wall')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'wall' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Muro (W)">
              <i className="fas fa-border-all"></i>
            </button>
            <button onClick={() => setTool('connector')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'connector' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Connettore (N)">
              <i className="fas fa-link"></i>
            </button>
            <button onClick={() => setTool('rect')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'rect' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Rettangolo (R)">
              <i className="far fa-square"></i>
            </button>
            <button onClick={() => setTool('circle')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'circle' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Cerchio (C)">
              <i className="far fa-circle"></i>
            </button>
            <button onClick={() => setTool('text')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'text' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Testo (T)">
              <i className="fas fa-font"></i>
            </button>
            <button onClick={() => setTool('symbol')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'symbol' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Simbolo (S)">
              <i className="fas fa-shapes"></i>
            </button>
            <button onClick={() => setTool('measure')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'measure' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Misura (M)">
              <i className="fas fa-ruler"></i>
            </button>
            <button onClick={() => setTool('dimension')} className={`w-11 h-11 rounded-lg flex items-center justify-center transition ${tool === 'dimension' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`} title="Quota (D)">
              <i className="fas fa-arrows-alt-h"></i>
            </button>
            <div className="w-8 h-px bg-gray-300 my-1"></div>
            <button onClick={undo} disabled={undoStack.length === 0} className="w-11 h-11 rounded-lg flex items-center justify-center bg-white text-gray-600 hover:bg-gray-200 transition disabled:opacity-40" title="Undo (Ctrl+Z)">
              <i className="fas fa-undo"></i>
            </button>
            <button onClick={redo} disabled={redoStack.length === 0} className="w-11 h-11 rounded-lg flex items-center justify-center bg-white text-gray-600 hover:bg-gray-200 transition disabled:opacity-40" title="Redo (Ctrl+Y)">
              <i className="fas fa-redo"></i>
            </button>
            <button onClick={deleteSelected} disabled={selectedElements.length === 0} className="w-11 h-11 rounded-lg flex items-center justify-center bg-white text-red-600 hover:bg-red-50 transition disabled:opacity-40" title="Elimina (DEL)">
              <i className="fas fa-trash"></i>
            </button>
          </div>

          {/* Palette simboli */}
          {tool === 'symbol' && (
            <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-1 mb-3">
                <button onClick={() => setSymbolCategory('elettrici')} className={`px-2 py-1.5 rounded text-xs font-medium ${symbolCategory === 'elettrici' ? 'bg-yellow-400 text-gray-900' : 'bg-white text-gray-600'}`}>
                  ⚡ Elettrici
                </button>
                <button onClick={() => setSymbolCategory('idraulici')} className={`px-2 py-1.5 rounded text-xs font-medium ${symbolCategory === 'idraulici' ? 'bg-blue-400 text-white' : 'bg-white text-gray-600'}`}>
                  🚿 Idraulici
                </button>
                <button onClick={() => setSymbolCategory('architettonici')} className={`px-2 py-1.5 rounded text-xs font-medium ${symbolCategory === 'architettonici' ? 'bg-green-400 text-white' : 'bg-white text-gray-600'}`}>
                  🏠 Arch.
                </button>
                <button onClick={() => setSymbolCategory('fgas')} className={`px-2 py-1.5 rounded text-xs font-medium ${symbolCategory === 'fgas' ? 'bg-cyan-400 text-white' : 'bg-white text-gray-600'}`}>
                  ❄️ F-Gas
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {simboli.map(s => (
                  <button key={s.id} onClick={() => setSelectedSymbol(s.id)} className={`p-2 rounded-lg text-center transition ${selectedSymbol === s.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}>
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
              width={1600}
              height={1200}
              className="bg-white cursor-crosshair"
              style={{ width: '100%', height: '100%' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { setDrawing(false); setDragging(false); setSelectionBox(null); }}
            />
            {/* Info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white text-xs p-2 flex items-center justify-between">
              <div className="flex gap-4">
                <span>Strumento: <strong>{tool}</strong></span>
                <span>Pos: ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})</span>
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span>Elementi: {elementi.length}</span>
                <span>Selezionati: {selectedElements.length}</span>
                <span>Layer: <strong>{activeLayer}</strong></span>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
                  Griglia
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} />
                  Snap
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} />
                  Auto-Connect
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
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Spessore: {lineWidth}px</label>
                  <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Griglia: {gridSize}px</label>
                  <input type="range" min="10" max="50" step="5" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            </div>

            {selectedElements.length > 0 && (
              <div>
                <h3 className="font-bold text-sm text-gray-700 mb-2">Allinea</h3>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => alignSelected('left')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Allinea a sinistra">
                    <i className="fas fa-align-left"></i>
                  </button>
                  <button onClick={() => alignSelected('center-h')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Centra orizzontalmente">
                    <i className="fas fa-arrows-alt-h"></i>
                  </button>
                  <button onClick={() => alignSelected('right')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Allinea a destra">
                    <i className="fas fa-align-right"></i>
                  </button>
                  <button onClick={() => alignSelected('top')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Allinea in alto">
                    <i className="fas fa-align-up"></i>
                  </button>
                  <button onClick={() => alignSelected('center-v')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Centra verticalmente">
                    <i className="fas fa-arrows-alt-v"></i>
                  </button>
                  <button onClick={() => alignSelected('bottom')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Allinea in basso">
                    <i className="fas fa-align-down"></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <button onClick={() => rotateSelected(90)} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Ruota 90°">
                    <i className="fas fa-redo"></i> 90°
                  </button>
                  <button onClick={() => rotateSelected(-90)} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Ruota -90°">
                    <i className="fas fa-undo"></i> -90°
                  </button>
                  <button onClick={() => mirrorSelected('horizontal')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Specchia orizzontale">
                    <i className="fas fa-arrows-alt-h"></i>
                  </button>
                  <button onClick={() => mirrorSelected('vertical')} className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100" title="Specchia verticale">
                    <i className="fas fa-arrows-alt-v"></i>
                  </button>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Layer</h3>
              <button onClick={() => setShowLayers(!showLayers)} className="w-full px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 mb-2">
                <i className="fas fa-layer-group mr-1"></i> Gestisci Layer
              </button>
              {showLayers && (
                <div className="space-y-1">
                  {layers.map(layer => (
                    <div key={layer.id} className="flex items-center gap-2 p-1 bg-white rounded text-xs">
                      <input type="checkbox" checked={layer.visible} onChange={() => {
                        setLayers(layers.map(l => l.id === layer.id ? {...l, visible: !l.visible} : l));
                      }} />
                      <div className="w-3 h-3 rounded" style={{backgroundColor: layer.color}}></div>
                      <span className="flex-1">{layer.name}</span>
                      <button onClick={() => setActiveLayer(layer.id)} className={`px-1 rounded ${activeLayer === layer.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        {activeLayer === layer.id ? '✓' : '○'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Vista</h3>
              <div className="space-y-2">
                <div className="flex gap-1">
                  <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="flex-1 px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">-</button>
                  <button onClick={() => setZoom(1)} className="flex-1 px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">100%</button>
                  <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="flex-1 px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">+</button>
                </div>
                <button onClick={() => { setPanOffset({x: 0, y: 0}); setZoom(1); }} className="w-full px-2 py-1 bg-white rounded text-xs hover:bg-gray-100">
                  <i className="fas fa-home mr-1"></i> Reset Vista
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Azioni</h3>
              <div className="space-y-2">
                <button onClick={exportPNG} className="w-full px-2 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                  <i className="fas fa-download mr-1"></i> Esporta PNG
                </button>
                <button onClick={clearAll} className="w-full px-2 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                  <i className="fas fa-trash mr-1"></i> Cancella Tutto
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">Tasti Rapidi</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><kbd className="bg-gray-200 px-1 rounded">V</kbd> Seleziona</p>
                <p><kbd className="bg-gray-200 px-1 rounded">L</kbd> Linea</p>
                <p><kbd className="bg-gray-200 px-1 rounded">W</kbd> Muro</p>
                <p><kbd className="bg-gray-200 px-1 rounded">N</kbd> Connettore</p>
                <p><kbd className="bg-gray-200 px-1 rounded">R</kbd> Rettangolo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">C</kbd> Cerchio</p>
                <p><kbd className="bg-gray-200 px-1 rounded">T</kbd> Testo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">S</kbd> Simbolo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">M</kbd> Misura</p>
                <p><kbd className="bg-gray-200 px-1 rounded">D</kbd> Quota</p>
                <p><kbd className="bg-gray-200 px-1 rounded">Ctrl+Z</kbd> Undo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">Ctrl+Y</kbd> Redo</p>
                <p><kbd className="bg-gray-200 px-1 rounded">Ctrl+C</kbd> Copia</p>
                <p><kbd className="bg-gray-200 px-1 rounded">Ctrl+V</kbd> Incolla</p>
                <p><kbd className="bg-gray-200 px-1 rounded">DEL</kbd> Elimina</p>
                <p><kbd className="bg-gray-200 px-1 rounded">Shift+Click</kbd> Multi-selezione</p>
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

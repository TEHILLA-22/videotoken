'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  createChart,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
  ColorType,
} from 'lightweight-charts';
import { OHLCV } from '@/types/ohlcv';

import {
  Search,
  Eye,
  Grid,
  RotateCcw,
  RotateCw,
  EyeOff,
  Layers,
  Zap,
  MinusSquare,
  Maximize,
  Minimize,
  Settings as LucideSettings,
  Camera,
  Check,
  Percent,
  Clock,
} from 'lucide-react';

import { FiSettings } from 'react-icons/fi';
import { RxEnterFullScreen } from 'react-icons/rx';
import { RxCrosshair1 } from 'react-icons/rx';
import { PiLineSegmentBold } from 'react-icons/pi';
import { MdBrush, MdGridView, MdLayers } from 'react-icons/md';
import { TfiText } from 'react-icons/tfi';
import { BiCandles } from 'react-icons/bi';
import { TbMathFunction } from 'react-icons/tb';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDownload } from 'react-icons/ai';
import { HiOutlineSparkles } from 'react-icons/hi';

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1D'];
const CANDLE_TYPES = ['Candles', 'Bars', 'Line'];

interface Props {
  data: OHLCV[];
}

export default function TokenChart({ data }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const currentDrawRef = useRef<any>(null);

  const [timeframe, setTimeframe] = useState('1m');
  const [candleType, setCandleType] = useState('Candles');
  const [crosshair, setCrosshair] = useState(true);
  const [barSpacing, setBarSpacing] = useState(12);
  const [showSettings, setShowSettings] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolPopup, setToolPopup] = useState<null | string>(null);
  const [popup, setPopup] = useState<null | 'time' | 'candle' | 'math' | 'indicators'>(null);
  const closePopup = () => setPopup(null);

  const [drawings, setDrawings] = useState<any[]>([]);

  const [priceMode, setPriceMode] = useState<'Price' | 'MCap'>('MCap');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [activeLeftTool, setActiveLeftTool] = useState<string | null>(null);

  const [activeDock, setActiveDock] = useState<
    'Trades' | 'Positions' | 'Orders' | 'Holders' | 'Top Traders' | 'Dev Tokens'
  >('Top Traders');

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState<'Market' | 'Limit'>('Market');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: '#0b0d10' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#0b0d10' },
        horzLines: { color: '#0b0d10' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#7619bc', // Change to your desired color (currently purple like your up candles)
          width: 1,
          style: 0,
          visible: true,
        },
        horzLine: {
          color: '#7619bc', // Change to your desired color
          width: 1,
          style: 0,
          visible: true,
        },
      },
      rightPriceScale: {
        borderColor: '#0b0d10',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#0b0d10',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const d = new Date(time * 1000);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
      },
      localization: {
        priceFormatter: (price: number) => {
          if (!price) return '0.0000000000';
          return price.toFixed(10);
        },
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#7619bc',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#7619bc',
      wickDownColor: '#ef5350',
      wickUpColor: '#7619bc',
      borderVisible: true,
      wickVisible: true,
      priceLineVisible: true,
      priceLineColor: '#7619bc',
      priceLineWidth: 1,

      lastValueVisible: true,
    });

    seriesRef.current = candleSeries;

    const formatted: CandlestickData[] = data
      .map((d) => ({
        time: Math.floor(d.timestamp / 1000) as UTCTimestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    const deduped: CandlestickData[] = [];
    for (const c of formatted) {
      if (deduped.length === 0 || deduped[deduped.length - 1].time !== c.time) {
        deduped.push(c);
      }
    }

    candleSeries.setData(deduped);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      crosshair: { vertLine: { visible: crosshair }, horzLine: { visible: crosshair } },
    });
  }, [crosshair]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({ timeScale: { barSpacing } });
  }, [barSpacing]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const start = (e: PointerEvent) => {
      if (!activeLeftTool) return;
      const rect = overlay.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentDrawRef.current = { tool: activeLeftTool, points: [{ x, y }] };
    };
    const move = (e: PointerEvent) => {
      if (!activeLeftTool || !currentDrawRef.current) return;
      const rect = overlay.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentDrawRef.current.points.push({ x, y });
      setDrawings((d) => {
        const filtered = d.filter(Boolean);
        return [...filtered, { ...currentDrawRef.current }];
      });
    };
    const end = () => {
      if (!activeLeftTool || !currentDrawRef.current) return;
      setDrawings((d) => [...d, currentDrawRef.current]);
      currentDrawRef.current = null;
    };

    overlay.addEventListener('pointerdown', start);
    overlay.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);

    return () => {
      overlay.removeEventListener('pointerdown', start);
      overlay.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
  }, [activeLeftTool]);

  const toggleFullscreen = async () => {
    const el = chartContainerRef.current?.closest('.chart-wrapper') as HTMLElement | null;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      return;
    } else {
      await document.exitFullscreen();
      return;
    }
  };

  const zoomIn = () => setBarSpacing((s) => Math.min(40, s + 2));
  const zoomOut = () => setBarSpacing((s) => Math.max(2, s - 2));
  const resetZoom = () => setBarSpacing(12);

  const toggleDock = (tab: typeof activeDock) => {
    setActiveDock(tab);
  };

  const handleInstantTradeSubmit = (side: 'buy' | 'sell') => {
    if (side === 'buy') {
      setBuyAmount('');
    } else {
      setSellAmount('');
    }
    setThemeMenuOpen(true);
    setTimeout(() => setThemeMenuOpen(false), 900);
  };
  const leftTools = [
    { id: 'cursor', icon: <RxCrosshair1 size={16} />, title: 'Cursor' },
    { id: 'trend-line', icon: <PiLineSegmentBold size={16} />, title: 'Trendline' },
    { id: 'brush', icon: <MdBrush size={16} />, title: 'Brush' },
    { id: 'text', icon: <TfiText size={16} />, title: 'Text' },
    { id: 'emoji', icon: <BsEmojiSmile size={16} />, title: 'Emoji' },
    { id: 'measure', icon: <TbMathFunction size={16} />, title: 'Measure' },
    { id: 'fib', icon: <HiOutlineSparkles size={16} />, title: 'Fib' },
    { id: 'magnet', icon: <Zap size={16} />, title: 'Magnet' },
    { id: 'eraser', icon: <AiOutlineMinus size={16} />, title: 'Eraser' },
    { id: 'hide', icon: <EyeOff size={16} />, title: 'Hide' },
  ];

  return (
    <div className="chart-wrapper  bg-[#0b0d10] rounded-lg overflow-hidden shadow-2xl relative border border-[#111214]   h-[400px] xl:h-[550px] max-w-[842px] xl:max-w-full w-full">
      {/* TOP BAR: dense tradingview-like bar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-[#0e1114] border-b border-[#0b0d10] text-gray-300 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPopup('time')}
              className="px-2 py-1 rounded text-sm hover:bg-[#15171a] bg-transparent"
              title="Timeframes"
            >
              {timeframe}
            </button>
            <div className="h-5 w-px bg-[#15171a]" />
            <button
              onClick={() => setShowIndicators(true)}
              className="px-2 py-1 rounded text-sm hover:bg-[#15171a]"
              title="Indicators"
            >
              Indicators
            </button>
          </div>

          <div className="h-5 w-px bg-[#15171a]" />

          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#15171a]">
            <span className="text-xs text-gray-400">Price /</span>
            <button
              onClick={() => setPriceMode((p) => (p === 'MCap' ? 'Price' : 'MCap'))}
              className="text-sm font-medium"
            >
              {priceMode}
            </button>
          </div>

          <button className="p-1 rounded hover:bg-[#15171a]" title="Toggle visibility">
            <Eye size={16} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Center search/title area */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-200 font-semibold">GRIFFIN</div>
          <div className="text-xs text-gray-400">O H L C • snapshot</div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right group - icons like screenshot */}
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-[#15171a]" title="Save layout">
            <Grid size={16} />
          </button>
          <button className="p-1 rounded hover:bg-[#15171a]" title="Undo">
            <RotateCcw size={16} />
          </button>
          <button className="p-1 rounded hover:bg-[#15171a]" title="Redo">
            <RotateCw size={16} />
          </button>

          <div className="h-5 w-px bg-[#15171a]" />

          <button
            onClick={() => setThemeMenuOpen((s) => !s)}
            className="p-1 rounded hover:bg-[#15171a]"
            title="Theme / Settings"
          >
            <LucideSettings size={16} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 rounded hover:bg-[#15171a]"
            title="Fullscreen"
          >
            <RxEnterFullScreen size={16} />
          </button>

          <button
            className="px-3 py-1 bg-[#2b083b] text-sm  rounded hover:bg-[#3a1160] border border-[#4a0f57]"
            title="Instant trade"
          >
            <div className="flex items-center gap-2">
              <Image width={14} height={14} src="/icons/Logo.png" alt="Logo" />
              <span>VTK</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* LEFT TOOLBAR - tall vertical bar like tradingview */}
        <div className="w-12 bg-[#0e1114] border-r border-[#0b0d10] flex flex-col items-center py-3 gap-2 ">
          {leftTools.map((t) => (
            <button
              key={t.id}
              title={t.title}
              onClick={() => setActiveLeftTool((s) => (s === t.id ? null : t.id))}
              className={`w-9 h-9 rounded flex items-center justify-center text-gray-300 hover:bg-[#15171a] ${
                activeLeftTool === t.id ? 'bg-[#15171a]' : ''
              }`}
            >
              {t.icon}
            </button>
          ))}

          <div className="mt-auto w-full flex flex-col items-center gap-2 pb-3">
            <button
              title="Layout"
              onClick={() => setToolPopup((s) => (s === 'layout' ? null : 'layout'))}
              className="w-9 h-9 rounded flex items-center justify-center text-gray-300 hover:bg-[#15171a]"
            >
              <Layers size={16} />
            </button>
            <button
              title="Templates"
              onClick={() => setToolPopup((s) => (s === 'template' ? null : 'template'))}
              className="w-9 h-9 rounded flex items-center justify-center text-gray-300 hover:bg-[#15171a]"
            >
              <AiOutlineDownload size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute left-4 top-4 z-30 text-sm font-semibold text-gray-200">
            Trade · <span className="font-normal">{timeframe}</span>
            <div className="text-xs text-[#7619bc] mt-1">O H L C • snapshot</div>
          </div>

          <div ref={chartContainerRef} className="w-full h-[400px] bg-[#0b0d10]" />

          <div ref={overlayRef} className="absolute inset-0 pointer-events-auto z-20">
            <svg className="w-full h-full">
              {drawings.map((d, i) => (
                <polyline
                  key={i}
                  points={d.points.map((p: any) => `${p.x},${p.y}`).join(' ')}
                  stroke={d.tool === 'brush' ? '#f59e0b' : '#60a5fa'}
                  strokeWidth={d.tool === 'brush' ? 3 : 2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </div>

          <div className="absolute right-3 bottom-3 z-40 flex items-center gap-2 text-xs text-gray-400">
            <Percent size={14} />
            <div>%</div>
            <div className="h-4 w-px bg-[#15171a]" />
            <div>log</div>
            <div className="h-4 w-px bg-[#15171a]" />
            <div>auto</div>
          </div>
        </div>
      </div>

      {/* Settings modal (center) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#071014] w-[460px] rounded shadow-lg p-4 border border-[#0f1416]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white">Chart Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <label className="flex justify-between items-center">
                <span>Crosshair</span>
                <input
                  type="checkbox"
                  checked={crosshair}
                  onChange={(e) => setCrosshair(e.target.checked)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span>
                  Bar Spacing: <strong>{barSpacing}</strong>
                </span>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={barSpacing}
                  onChange={(e) => setBarSpacing(Number(e.target.value))}
                />
              </label>

              <label className="flex justify-between items-center">
                <span>Price mode</span>
                <select
                  value={priceMode}
                  onChange={(e) => setPriceMode(e.target.value as any)}
                  className="bg-[#0b0d10] text-gray-300 rounded px-2 py-1"
                >
                  <option>Price</option>
                  <option>MCap</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2 bg-red-600/40 hover:bg-red-600/60 rounded text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicators modal */}
      {showIndicators && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#071014] w-[520px] rounded shadow-lg p-4 border border-[#0f1416]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Indicators</h3>
              <button onClick={() => setShowIndicators(false)}>✕</button>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between items-center">
                <div>EMA (12)</div>
                <div>
                  <button className="px-2 py-1 rounded bg-[#1a1d20]">Add</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>SMA (50)</div>
                <div>
                  <button className="px-2 py-1 rounded bg-[#1a1d20]">Add</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>RSI</div>
                <div>
                  <button className="px-2 py-1 rounded bg-[#1a1d20]">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toolPopup && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setToolPopup(null)}
        >
          <div
            className="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 w-80 text-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-lg mb-3 capitalize">{toolPopup} Options</h3>

            <div className="grid grid-cols-2 gap-2">
              <button className="w-full text-left px-3 py-2 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a]">
                Option A
              </button>
              <button className="w-full text-left px-3 py-2 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a]">
                Option B
              </button>
            </div>

            <button
              onClick={() => setToolPopup(null)}
              className="mt-4 w-full py-2 bg-red-600/40 hover:bg-red-600/60 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {themeMenuOpen && (
        <div className="fixed left-6 bottom-16 z-40 bg-[#071014] border border-[#0f1416] text-sm rounded px-3 py-2 text-[#7619bc] shadow">
          Saved
        </div>
      )}
    </div>
  );
}

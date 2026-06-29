import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  CloudRain, 
  Wind, 
  Flame, 
  Waves, 
  Bird, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Circle, 
  Info,
  Calendar,
  Sparkles,
  Heart,
  ChevronRight
} from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Scenario, TodoItem } from './types';
import { WeatherParticles } from './components/WeatherParticles';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

// 4个经典沉浸式场景配置（使用 4K 超清摄影大图与对应缩略图，顺序与截图一致）
const SCENARIOS: Scenario[] = [
  {
    id: 'swiss-wilderness',
    name: 'Swiss Wilderness',
    nameZh: '瑞士荒野',
    lightBgUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop',
    darkBgUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2560&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    bgmUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    defaultVolumes: { bgm: 0.7, wind: 0.8, rain: 0, campfire: 0, stream: 0, birds: 0.5 },
    accentColor: '205 90% 70%' // 冰晶蓝
  },
  {
    id: 'secret-cave',
    name: 'Secret Cave',
    nameZh: '神秘溶洞',
    lightBgUrl: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f?q=80&w=2560&auto=format&fit=crop',
    darkBgUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=2560&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f?q=80&w=600&auto=format&fit=crop',
    bgmUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    defaultVolumes: { bgm: 0.75, wind: 0.4, rain: 0, campfire: 0, stream: 0.85, birds: 0 },
    accentColor: '180 85% 45%' // 幽谧青
  },
  {
    id: 'wilderness-villa',
    name: 'Wilderness Villa',
    nameZh: '荒林别墅',
    lightBgUrl: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2560&auto=format&fit=crop',
    darkBgUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=2560&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=600&auto=format&fit=crop',
    bgmUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    defaultVolumes: { bgm: 0.6, wind: 0, rain: 0.75, campfire: 0.9, stream: 0, birds: 0 },
    accentColor: '28 95% 60%' // 温暖橘
  },
  {
    id: 'zen-eastern',
    name: 'Zen Eastern',
    nameZh: '东方禅意',
    lightBgUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2560&auto=format&fit=crop',
    darkBgUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2560&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop',
    bgmUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    defaultVolumes: { bgm: 0.7, wind: 0, rain: 0.6, campfire: 0, stream: 0.3, birds: 0.85 },
    accentColor: '125 60% 65%' // 竹叶绿
  }
];

// 白噪音音轨定义 (使用 raw GitHub 音频链接)
const TRACK_DEFINITIONS = [
  { id: 'bgm', name: '轻音乐', icon: 'Music', url: '' },
  { id: 'rain', name: '细雨', icon: 'CloudRain', url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/rain.mp3' },
  { id: 'wind', name: '林风', icon: 'Wind', url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/wind.mp3' },
  { id: 'campfire', name: '营火', icon: 'Flame', url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/campfire.mp3' },
  { id: 'stream', name: '溪流', icon: 'Waves', url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/river.mp3' },
  { id: 'birds', name: '鸟鸣', icon: 'Bird', url: 'https://raw.githubusercontent.com/karthiknvd/noctune/main/sounds/forest.mp3' }
];

export default function App() {
  // ------------------ 状态定义 ------------------
  // 强制始终使用暗色模式
  const theme = 'dark';

  const [currentScenario, setCurrentScenario] = useState<Scenario>(() => {
    const saved = localStorage.getItem('focus_scenario_id');
    return SCENARIOS.find(s => s.id === saved) || SCENARIOS[0];
  });

  // 极简模式：是否已开始专注
  const [isFocusStarted, setIsFocusStarted] = useState(false);

  const [globalPlay, setGlobalPlay] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);

  // 挂载时同步暗色模式
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  // 随机生成的背景萤火虫粒子
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.5, // 1.5px 至 4.0px
      delay: Math.random() * -30, // 负延迟使动画立即在各阶段启动，避开开屏呆板
      duration: Math.random() * 20 + 20, // 20s 到 40s 极慢律动
    }));
    setParticles(generated);
  }, []);

  // 混音器音量（每个音轨的音量）
  const [mixerVolumes, setMixerVolumes] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('focus_mixer_volumes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // 解构出错时 fallback
      }
    }
    return { ...SCENARIOS[0].defaultVolumes };
  });

  // 音轨静音/播放控制
  const [trackStates, setTrackStates] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('focus_track_states');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // 默认除零音量外均开启
    const initialStates: { [key: string]: boolean } = {};
    TRACK_DEFINITIONS.forEach(t => {
      initialStates[t.id] = true;
    });
    return initialStates;
  });

  // 专注会话状态
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [pomodoroPreset, setPomodoroPreset] = useState<number>(25); // 25m, 50m, etc.
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // 呼引导状态
  // 'idle' | 'inhale' (4s) | 'hold' (4s) | 'exhale' (4s) | 'hold2' (4s)
  const [breathingState, setBreathingState] = useState<'idle' | 'inhale' | 'hold' | 'exhale' | 'hold2'>('idle');
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(4);

  // 待办事项状态
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('focus_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodoText, setNewTodoText] = useState('');

  // 每日名言（专注感言）
  const quotes = [
    "“保持专注，就如同在喧嚣的暴风雨中，守护一盏微弱的烛火。”",
    "“专注是一门在纷扰中归于寂静的艺术。”",
    "“瑞士阿尔卑斯山的风不会停，但你的心可以平静下来。”",
    "“每一次深呼吸，都是一次与自我心灵的归位。”",
    "“不必走得太快，只要方向笃定，每一步都算数。”"
  ];
  const [currentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  // ------------------ Refs ------------------
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const timerIntervalRef = useRef<any>(null);
  const breathingIntervalRef = useRef<any>(null);
  const lastTimeRef = useRef<number | null>(null);

  // ------------------ 音频初始化与同步 ------------------
  // 1. 初始化 HTMLAudioElement
  useEffect(() => {
    TRACK_DEFINITIONS.forEach(t => {
      if (t.id === 'bgm') return; // BGM 随场景动态加载，在下一个 useEffect 中处理
      const audio = new Audio(t.url);
      audio.loop = true;
      audio.crossOrigin = "anonymous";
      audioRefs.current[t.id] = audio;
    });

    return () => {
      // 卸载时停止所有音频并清空
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
    };
  }, []);

  // 2. 场景切换时，更新 BGM 实例
  useEffect(() => {
    // 停止老 BGM
    if (audioRefs.current['bgm']) {
      audioRefs.current['bgm'].pause();
    }

    const newBgm = new Audio(currentScenario.bgmUrl);
    newBgm.loop = true;
    newBgm.crossOrigin = "anonymous";
    audioRefs.current['bgm'] = newBgm;

    // 当切换场景时，应用当前场景的默认音量
    const newVolumes = { ...currentScenario.defaultVolumes };
    setMixerVolumes(newVolumes);
    localStorage.setItem('focus_scenario_id', currentScenario.id);
    localStorage.setItem('focus_mixer_volumes', JSON.stringify(newVolumes));

    // 如果处于全局播放状态，则自动播放新 BGM
    if (globalPlay) {
      const volume = (trackStates['bgm'] ? 1 : 0) * (newVolumes['bgm'] ?? 0);
      newBgm.volume = volume;
      newBgm.play().catch(err => console.log("BGM play prevented:", err));
    }
  }, [currentScenario]);

  // 3. 当全局播放、音量、静音状态变化时同步音频状态
  useEffect(() => {
    TRACK_DEFINITIONS.forEach(t => {
      const audio = audioRefs.current[t.id];
      if (!audio) return;

      const isMuted = !trackStates[t.id];
      const targetVolume = isMuted ? 0 : (mixerVolumes[t.id] ?? 0);

      // 设置音量
      audio.volume = targetVolume;

      if (globalPlay && targetVolume > 0) {
        if (audio.paused) {
          audio.play().catch(err => console.log(`${t.name} play prevented:`, err));
        }
      } else {
        if (!audio.paused) {
          audio.pause();
        }
      }
    });

    localStorage.setItem('focus_mixer_volumes', JSON.stringify(mixerVolumes));
    localStorage.setItem('focus_track_states', JSON.stringify(trackStates));
  }, [globalPlay, mixerVolumes, trackStates]);

  // ------------------ 计时器逻辑 ------------------
  // 精确合成清脆的 DING 结束提示音
  const playDingSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 键，清脆
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log("Web Audio Context prevented/failed:", e);
    }
  };

  // 启动与暂停计时器
  useEffect(() => {
    if (timerRunning) {
      lastTimeRef.current = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = Math.round((now - (lastTimeRef.current || now)) / 1000);
        lastTimeRef.current = now;

        setTimeLeft(prev => {
          if (timerMode === 'pomodoro') {
            if (prev <= delta) {
              setTimerRunning(false);
              playDingSound();
              return 0;
            }
            return prev - delta;
          } else {
            // stopwatch
            return prev + delta;
          }
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning, timerMode]);

  // 预设选择修改
  const handlePresetChange = (mins: number) => {
    setTimerMode('pomodoro');
    setPomodoroPreset(mins);
    setTimeLeft(mins * 60);
    setTimerRunning(false);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    if (timerMode === 'pomodoro') {
      setTimeLeft(pomodoroPreset * 60);
    } else {
      setTimeLeft(0);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ------------------ 呼吸引导逻辑 (4-4-4-4 盒式呼吸) ------------------
  useEffect(() => {
    if (breathingState !== 'idle') {
      breathingIntervalRef.current = setInterval(() => {
        setBreathingTimeLeft(prev => {
          if (prev <= 1) {
            // 切换状态
            setBreathingState(current => {
              switch (current) {
                case 'inhale': return 'hold';
                case 'hold': return 'exhale';
                case 'exhale': return 'hold2';
                case 'hold2': return 'inhale';
                default: return 'idle';
              }
            });
            return 4; // 盒式呼吸每个阶段均是 4 秒
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    }

    return () => {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    };
  }, [breathingState]);

  const toggleBreathing = () => {
    if (breathingState === 'idle') {
      setBreathingState('inhale');
      setBreathingTimeLeft(4);
    } else {
      setBreathingState('idle');
    }
  };

  // ------------------ 待办列表逻辑 ------------------
  useEffect(() => {
    localStorage.setItem('focus_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: Date.now()
    };
    setTodos([newTodo, ...todos]);
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // ------------------ 辅助逻辑 ------------------
  // 获取音轨图标的渲染
  const renderTrackIcon = (iconName: string) => {
    const cls = "w-4 h-4 mr-2";
    switch (iconName) {
      case 'Music': return <Music className={cls} />;
      case 'CloudRain': return <CloudRain className={cls} />;
      case 'Wind': return <Wind className={cls} />;
      case 'Flame': return <Flame className={cls} />;
      case 'Waves': return <Waves className={cls} />;
      case 'Bird': return <Bird className={cls} />;
      default: return <Music className={cls} />;
    }
  };

  // 双击屏幕任意空白处，进入/退出沉浸模式
  const handleScreenDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // 如果双击的是按钮、滑块、开关、输入框、Dialog 弹窗内或 To-Do 卡片等交互式元素，则不予触发
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('a') || 
      target.closest('[role="dialog"]') ||
      target.closest('[role="slider"]') ||
      target.closest('.glass-panel') ||
      target.closest('footer')
    ) {
      return;
    }
    
    setImmersiveMode(prev => !prev);
  };

  // HSL主题色和圆环样式联动
  const accentHsl = currentScenario.accentColor;

  return (
    <div 
      onDoubleClick={handleScreenDoubleClick}
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between"
      style={{
        '--accent-glow': accentHsl,
        '--accent-glow-alpha-20': `hsla(${accentHsl}, 0.25)`,
        '--accent-glow-alpha-60': `hsla(${accentHsl}, 0.7)`
      } as React.CSSProperties}
    >
      {/* ------------------ 背景超清大图 (带 Ken Burns 电影拉伸微动画) ------------------ */}
      <div className="absolute inset-0 z-0 bg-neutral-50 dark:bg-neutral-950 overflow-hidden transition-colors duration-500">
        <img
          key={currentScenario.id + '-' + theme}
          src={currentScenario.darkBgUrl}
          alt={currentScenario.nameZh}
          className="w-full h-full object-cover opacity-45 dark:opacity-65 transition-opacity duration-1000 select-none pointer-events-none animate-kenburns"
        />
        {/* 精致的暗色渐变发光网格 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-black/40 dark:via-transparent dark:to-black/80 pointer-events-none transition-all" />
        {/* 背景漂移浮光光斑 (三维极光融合) */}
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full filter blur-[150px] opacity-10 dark:opacity-20 bg-[hsla(var(--accent-glow),0.12)] dark:bg-[hsla(var(--accent-glow),0.3)] animate-float-1 pointer-events-none transition-all" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full filter blur-[120px] opacity-15 dark:opacity-25 bg-[hsla(var(--accent-glow),0.1)] dark:bg-[hsla(var(--accent-glow),0.25)] animate-float-2 pointer-events-none transition-all" />
        <div className="absolute top-1/3 left-1/3 w-[60vw] h-[60vw] rounded-full filter blur-[180px] opacity-5 dark:opacity-10 bg-[hsla(var(--accent-glow),0.08)] dark:bg-[hsla(var(--accent-glow),0.2)] animate-float-3 pointer-events-none transition-all" />
        
        {/* 场景专属 Canvas 天气粒子系统 */}
        <WeatherParticles scenarioId={currentScenario.id} theme={theme} />

        {/* 浮动萤火虫/星光粒子背景层 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-[hsla(var(--accent-glow),0.85)] shadow-[0_0_10px_hsla(var(--accent-glow),0.6)] animate-firefly"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ------------------ 顶栏 Header ------------------ */}
      <header className={`relative z-10 w-full px-8 py-6 flex justify-between items-center transition-all duration-700 ${immersiveMode ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-[hsla(var(--accent-glow),1)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-800 dark:text-white/90">DeepFocus Space</h1>
            <p className="text-xs text-neutral-400 dark:text-white/40 tracking-wider">瑞士荒野 · 沉浸专注</p>
          </div>
        </div>

        {/* 顶部中央名言 */}
        <div className="hidden lg:block max-w-md text-center">
          <p className="text-sm font-medium italic text-neutral-600 dark:text-white/60 tracking-wide drop-shadow-sm select-text">
            {currentQuote}
          </p>
        </div>

        {/* 顶部控制组 */}
        <div className="flex items-center space-x-3">
          {/* 混音器控制 Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 bg-white/2 backdrop-blur-md" title="环境声混音器">
                <Volume2 className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-neutral-200 dark:border-white/10 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex justify-between items-center pr-4">
                  <span>环境多轨混音器</span>
                  <span className="text-[10px] text-neutral-400 dark:text-white/30 font-mono tracking-normal">MIXER UNIT</span>
                </DialogTitle>
                <div className="space-y-4 pt-4">
                  {TRACK_DEFINITIONS.map(track => {
                    const vol = mixerVolumes[track.id] ?? 0;
                    const isChecked = trackStates[track.id] ?? false;

                    return (
                      <div key={track.id} className="flex items-center justify-between gap-4">
                        <button 
                          onClick={() => {
                            setTrackStates(prev => ({ ...prev, [track.id]: !prev[track.id] }));
                          }}
                          className={`flex items-center text-xs font-medium w-20 text-left transition-colors duration-200
                            ${isChecked && vol > 0 ? 'text-neutral-800 dark:text-white' : 'text-neutral-400 dark:text-white/40'}`}
                        >
                          {renderTrackIcon(track.icon)}
                          <span>{track.name}</span>
                        </button>
                        <div className="flex-grow flex items-center gap-3">
                          <Slider
                            disabled={!isChecked}
                            value={[isChecked ? vol : 0]}
                            max={1}
                            step={0.01}
                            onValueChange={(val) => {
                              if (!isChecked) return;
                              setMixerVolumes(prev => ({ ...prev, [track.id]: val[0] }));
                            }}
                            className={`w-full ${isChecked ? '[--slider-accent:hsla(var(--accent-glow),1)]' : 'opacity-20'}`}
                          />
                          <span className="text-[10px] font-mono w-7 text-right text-neutral-400 dark:text-white/30">
                            {Math.round((isChecked ? vol : 0) * 100)}%
                          </span>
                        </div>
                        <Switch
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            setTrackStates(prev => ({ ...prev, [track.id]: checked }));
                          }}
                          className="scale-90"
                        />
                      </div>
                    );
                  })}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* 专注待办 Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 bg-white/2 backdrop-blur-md" title="待办列表">
                <Calendar className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-neutral-200 dark:border-white/10 max-w-md flex flex-col h-96">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center justify-between pr-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-[hsla(var(--accent-glow),1)]" />
                    当前专注待办
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-white/30 font-mono">
                    {todos.filter(t => t.completed).length}/{todos.length}
                  </span>
                </DialogTitle>
              </DialogHeader>
              {/* To-Do 列表容器 */}
              <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 my-3 pr-1 text-sm">
                {todos.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 dark:text-white/20 py-8">
                    <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">暂无待办，加一项开启专注吧</p>
                  </div>
                ) : (
                  todos.map(todo => (
                    <div 
                      key={todo.id} 
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200
                        ${todo.completed 
                          ? 'bg-black/[0.015] border-neutral-200/50 dark:bg-white/2 dark:border-white/5 opacity-50' 
                          : 'bg-black/[0.04] border-neutral-200 dark:bg-white/5 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'}`}
                    >
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className="flex items-center gap-2.5 text-left flex-grow mr-2 text-neutral-700 dark:text-white/80"
                      >
                        {todo.completed ? (
                          <CheckCircle className="w-4 h-4 text-[hsla(var(--accent-glow),1)] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-400 dark:text-white/30 shrink-0" />
                        )}
                        <span className={`line-clamp-2 leading-snug ${todo.completed ? 'line-through text-neutral-400/80 dark:text-white/45' : ''}`}>
                          {todo.text}
                        </span>
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="text-neutral-400/60 dark:text-white/20 hover:text-red-500 p-0.5 rounded transition-colors"
                        title="删除任务"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {/* 输入框表单 */}
              <form onSubmit={addTodo} className="flex gap-2 mt-auto">
                <input
                  type="text"
                  placeholder="写下你要专注的事..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="flex-grow h-9 bg-black/[0.04] dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg px-3 text-xs text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-white/20 focus:outline-none focus:border-[hsla(var(--accent-glow),0.5)] focus:bg-black/[0.08] dark:focus:bg-white/10 transition-all"
                />
                <button 
                  type="submit" 
                  className="h-9 w-9 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 active:scale-95 flex items-center justify-center transition-all shrink-0"
                >
                  <Plus className="w-4 h-4 text-white dark:text-black" />
                </button>
              </form>
            </DialogContent>
          </Dialog>

          {/* 项目介绍信息 Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 bg-white/2 backdrop-blur-md">
                <Info className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-neutral-200 dark:border-white/10 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[hsla(var(--accent-glow),1)]" />
                  关于 DeepFocus 专注空间
                </DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-white/60 leading-relaxed pt-3 space-y-4">
                  <p>这是一个高级的纯前端沉浸式专注工具，旨在为您创造无干扰的深度工作环境。</p>
                  <div className="space-y-2 text-sm text-neutral-700 dark:text-white/80">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[hsla(var(--accent-glow),1)]" />
                      <span><strong>4个绝美场景</strong>：自适应变色 HSL 主题。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[hsla(var(--accent-glow),1)]" />
                      <span><strong>多轨混音器</strong>：自由调节自然与钢琴混音。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[hsla(var(--accent-glow),1)]" />
                      <span><strong>盒式呼吸机制</strong>：引导您吸气-憋气-呼气。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[hsla(var(--accent-glow),1)]" />
                      <span><strong>极简待办事项</strong>：聚焦当前目标。</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-white/40 pt-2 border-t border-neutral-200 dark:border-white/5">
                    使用提示：双击屏幕任意空白处，即可直接进入/退出【全屏沉浸模式】。
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* 沉浸模式 Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setImmersiveMode(true)}
            className="w-10 h-10 rounded-full text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 bg-white/2 backdrop-blur-md"
            title="开启沉浸模式（隐藏面板）"
          >
            <EyeOff className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* ------------------ 主体核心区 (正中计时器与呼吸环) ------------------ */}
      <main className="relative z-10 w-full flex-grow flex flex-col items-center justify-center">
        
        {/* 1. 沉浸模式下的显形按钮 */}
        {immersiveMode && (
          <button
            onClick={() => {
              setImmersiveMode(false);
              if (isFocusStarted) {
                setIsFocusStarted(false);
                setTimerRunning(false);
              }
            }}
            className="absolute top-8 right-8 px-4 py-2 rounded-full glass-panel text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5 flex items-center gap-2 text-sm tracking-wider opacity-30 hover:opacity-100 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            <span>退出沉浸</span>
          </button>
        )}

        {!isFocusStarted ? (
          /* 极简主页：“Start Focus” 药丸按钮 */
          <button
            onClick={() => {
              setIsFocusStarted(true);
              setTimerRunning(true);
            }}
            className="px-8 py-3.5 rounded-full glass-panel text-lg font-semibold tracking-wider border border-neutral-200/60 dark:border-white/15 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-lg animate-pulse-glow"
          >
            <span>Start Focus</span>
            <ChevronRight className="w-5 h-5 text-[hsla(var(--accent-glow),1)]" />
          </button>
        ) : (
          /* 专注中：优雅浮入倒计时盘 */
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-80 h-80 flex flex-col items-center justify-center">
              
              {/* 外圈呼吸引导动效环 */}
              <div 
                className={`absolute inset-0 rounded-full border-2 border-[hsla(var(--accent-glow),0.3)] transition-all duration-500 flex items-center justify-center
                  ${breathingState === 'inhale' ? 'breath-circle-inhale' : ''}
                  ${breathingState === 'hold' || breathingState === 'hold2' ? 'breath-circle-hold' : ''}
                  ${breathingState === 'exhale' ? 'breath-circle-exhale' : ''}
                  ${breathingState === 'idle' ? 'scale-100 opacity-20 border-[hsla(var(--accent-glow),0.1)]' : ''}
                `}
                style={{
                  transition: breathingState === 'hold' || breathingState === 'hold2' ? 'all 0.5s ease' : 'none'
                }}
              >
                {/* 呼吸状态文字提示 */}
                {breathingState !== 'idle' && (
                  <div className="absolute top-10 flex flex-col items-center">
                    <span className="text-xs uppercase tracking-[0.25em] text-[hsla(var(--accent-glow),0.9)] drop-shadow">
                      {breathingState === 'inhale' && '吸气 Inhale'}
                      {breathingState === 'hold' && '憋气 Hold'}
                      {breathingState === 'exhale' && '呼气 Exhale'}
                      {breathingState === 'hold2' && '静息 Rest'}
                    </span>
                    <span className="text-xl font-bold text-neutral-800 dark:text-white mt-1">{breathingTimeLeft}s</span>
                  </div>
                )}
              </div>

              {/* 内圈专注计时器面板 */}
              <div className="z-10 w-64 h-64 rounded-full glass-panel flex flex-col items-center justify-center text-center p-6 select-none relative group border border-neutral-200 dark:border-white/10">
                {/* 全局播放控制开关大按钮 */}
                <button 
                  onClick={() => setGlobalPlay(!globalPlay)}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-lg text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {globalPlay ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-white dark:text-black" />
                      <span>暂停音频</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-white dark:text-black animate-pulse" />
                      <span>播放环境声</span>
                    </>
                  )}
                </button>

                {/* 倒计时 / 正向计时时间 */}
                <span className="text-5xl font-light tracking-tight text-neutral-800 dark:text-white font-mono drop-shadow-md">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-neutral-400 dark:text-white/30 font-medium tracking-widest mt-1 uppercase">
                  {timerMode === 'pomodoro' ? '番茄倒数' : '累积计时'}
                </span>

                {/* 控制器 */}
                <div className="flex items-center space-x-4 mt-6">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-[hsla(var(--accent-glow),1)] text-black hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    {timerRunning ? <Pause className="w-5 h-5 text-neutral-950" /> : <Play className="w-5 h-5 fill-current text-neutral-950 ml-0.5" />}
                  </button>
                  <button
                    onClick={handleResetTimer}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-200"
                    title="重置计时"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* 底部呼吸训练触发器 */}
                <button
                  onClick={toggleBreathing}
                  className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full border text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all duration-300
                    ${breathingState !== 'idle' 
                      ? 'bg-[hsla(var(--accent-glow),0.15)] text-[hsla(var(--accent-glow),1)] border-[hsla(var(--accent-glow),0.4)]' 
                      : 'bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-white/50 border-neutral-200 dark:border-white/10 hover:text-neutral-800 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
                    }
                  `}
                >
                  <Heart className={`w-3.5 h-3.5 ${breathingState !== 'idle' ? 'animate-pulse text-[hsla(var(--accent-glow),1)]' : ''}`} />
                  <span>{breathingState !== 'idle' ? '停止呼吸' : '呼吸练习'}</span>
                </button>
              </div>
            </div>

            {/* 计时器预设选择面板 */}
            <div className="mt-8 flex items-center space-x-3">
              <button 
                onClick={() => handlePresetChange(25)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border
                  ${timerMode === 'pomodoro' && pomodoroPreset === 25 
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white' 
                    : 'bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-white/60 border-neutral-200/50 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:text-neutral-800 dark:hover:text-white'}`}
              >
                25 MIN
              </button>
              <button 
                onClick={() => handlePresetChange(50)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border
                  ${timerMode === 'pomodoro' && pomodoroPreset === 50 
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white' 
                    : 'bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-white/60 border-neutral-200/50 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:text-neutral-800 dark:hover:text-white'}`}
              >
                50 MIN
              </button>
              <button 
                onClick={() => {
                  setTimerMode(timerMode === 'stopwatch' ? 'pomodoro' : 'stopwatch');
                  setTimeLeft(0);
                  setTimerRunning(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border
                  ${timerMode === 'stopwatch' 
                    ? 'bg-[hsla(var(--accent-glow),0.15)] text-[hsla(var(--accent-glow),1)] border-[hsla(var(--accent-glow),0.3)]' 
                    : 'bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-white/60 border-neutral-200/50 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:text-neutral-800 dark:hover:text-white'}`}
              >
                正向秒表
              </button>
            </div>

            {/* 返回极简主页 */}
            <button
              onClick={() => {
                setIsFocusStarted(false);
                setTimerRunning(false);
              }}
              className="mt-6 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-white/60 hover:text-neutral-800 dark:hover:text-white border border-neutral-200/60 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs tracking-wider transition-all duration-300"
            >
              返回主页
            </button>
          </div>
        )}

      </main>

      {/* ------------------ 底栏 / 浮动场景选择缩略图卡片栏 ------------------ */}
      <footer className={`relative z-10 w-full px-8 pb-10 flex justify-center transition-all duration-700 
        ${immersiveMode || isFocusStarted ? 'opacity-0 translate-y-[40px] pointer-events-none' : 'opacity-100 translate-y-0'}`}
      >
        <div className="flex items-center space-x-4 max-w-5xl overflow-x-auto no-scrollbar py-2">
          {SCENARIOS.map(scenario => {
            const isActive = currentScenario.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setCurrentScenario(scenario)}
                className={`relative w-48 h-28 rounded-xl overflow-hidden text-left border transition-all duration-300 group shrink-0 shadow-md hover:scale-[1.02] active:scale-98
                  ${isActive 
                    ? 'border-[hsla(var(--accent-glow),0.8)] ring-2 ring-[hsla(var(--accent-glow),0.25)] shadow-[0_8px_24px_rgba(var(--accent-glow),0.2)]' 
                    : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                  }
                `}
              >
                {/* 缩略图背景 */}
                <img
                  src={theme === 'dark' ? scenario.darkBgUrl.replace('w=2560', 'w=600') : scenario.lightBgUrl.replace('w=2560', 'w=600')}
                  alt={scenario.nameZh}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                />
                {/* 阴影渐变遮罩层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-300" />
                
                {/* 文字定位 */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <span className="block text-xs font-bold text-white tracking-wide drop-shadow-sm">
                    {scenario.nameZh}
                  </span>
                  <span className="block text-[9px] text-white/50 font-semibold tracking-wider mt-0.5">
                    {scenario.name}
                  </span>
                </div>
                
                {/* 激活状态发光小圆点 */}
                {isActive && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[hsla(var(--accent-glow),1)] shadow-[0_0_8px_hsla(var(--accent-glow),1)]" />
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}

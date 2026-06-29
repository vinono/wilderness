import React, { useEffect, useRef } from 'react';

interface WeatherParticlesProps {
  scenarioId: string;
  theme: 'light' | 'dark';
}

// 物理粒子属性定义
interface SnowParticle {
  type: 'snow';
  x: number;
  y: number;
  r: number;
  speedY: number;
  swingRange: number;
  swingSpeed: number;
  swingAngle: number;
  opacity: number;
}

interface DandelionParticle {
  type: 'dandelion';
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  swingRange: number;
  swingSpeed: number;
  swingAngle: number;
  opacity: number;
}

interface PetalParticle {
  type: 'petal';
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  speedX: number;
  angle: number;
  spinSpeed: number;
  color: string;
  opacity: number;
}

interface RainParticle {
  type: 'rain';
  x: number;
  y: number;
  length: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

interface EmberParticle {
  type: 'ember';
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  alpha: number;
  decay: number;
  hue: number;
}

interface DustParticle {
  type: 'dust';
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  alpha: number;
  angle: number;
  step: number;
}

interface BubbleParticle {
  type: 'bubble';
  x: number;
  y: number;
  r: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleAngle: number;
  opacity: number;
}

interface BeamLightParticle {
  type: 'beam-light';
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
}

interface LeafParticle {
  type: 'leaf';
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  speedX: number;
  angle: number;
  spinSpeed: number;
  color: string;
  opacity: number;
}

type Particle =
  | SnowParticle
  | DandelionParticle
  | PetalParticle
  | RainParticle
  | EmberParticle
  | DustParticle
  | BubbleParticle
  | BeamLightParticle
  | LeafParticle;

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ scenarioId, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // 初始化粒子
    const initParticles = () => {
      particles = [];
      const particleCount = getParticleCount();
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true));
      }
    };

    const getParticleCount = () => {
      switch (scenarioId) {
        case 'swiss-wilderness':
          return theme === 'dark' ? 80 : 50; // 夜晚下雪 80，白天蒲公英+花瓣 50
        case 'wilderness-villa':
          return theme === 'dark' ? 120 : 60; // 夜晚下雨+火星 120，白天微尘+枫叶 60
        case 'secret-cave':
          return theme === 'dark' ? 45 : 30; // 夜晚气泡 45，白天阳光微粒 30
        case 'zen-eastern':
          return theme === 'dark' ? 30 : 25; // 绿叶与樱花瓣
        default:
          return 0;
      }
    };

    // 随机生成粒子。isInit 控制 y 的起始范围
    const createParticle = (isInit = false): Particle => {
      const startY = isInit ? Math.random() * height : -30;

      switch (scenarioId) {
        case 'swiss-wilderness':
          if (theme === 'dark') {
            // 暗色：经典雪花
            return {
              type: 'snow',
              x: Math.random() * width,
              y: startY,
              r: Math.random() * 2.5 + 1.2,
              speedY: Math.random() * 0.8 + 0.4,
              swingRange: Math.random() * 1.5 + 0.5,
              swingSpeed: Math.random() * 0.02 + 0.01,
              swingAngle: Math.random() * Math.PI * 2,
              opacity: Math.random() * 0.5 + 0.3,
            };
          } else {
            // 亮色：蒲公英漫天与小花瓣 (占比：60% 蒲公英，40% 粉蓝小瓣)
            if (Math.random() < 0.6) {
              return {
                type: 'dandelion',
                x: Math.random() * width,
                y: startY,
                r: Math.random() * 1.5 + 0.8,
                speedY: Math.random() * 0.5 + 0.3,
                speedX: Math.random() * 0.4 + 0.2,
                swingRange: Math.random() * 0.8 + 0.2,
                swingSpeed: Math.random() * 0.015 + 0.005,
                swingAngle: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.6 + 0.4,
              };
            } else {
              const petalColors = [
                'rgba(254, 244, 244, 0.75)',
                'rgba(240, 246, 255, 0.7)',
                'rgba(254, 243, 199, 0.65)',
              ];
              return {
                type: 'petal',
                x: Math.random() * width,
                y: startY,
                width: Math.random() * 4 + 5,
                height: Math.random() * 2.5 + 2,
                speedY: Math.random() * 0.6 + 0.4,
                speedX: Math.random() * 0.5 + 0.3,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.02,
                color: petalColors[Math.floor(Math.random() * petalColors.length)],
                opacity: Math.random() * 0.6 + 0.3,
              };
            }
          }

        case 'wilderness-villa':
          if (theme === 'dark') {
            // 暗色：细雨 + 营火火星 (7:3)
            if (Math.random() < 0.7) {
              return {
                type: 'rain',
                x: Math.random() * (width + 100) - 50,
                y: startY,
                length: Math.random() * 8 + 8,
                speedY: Math.random() * 6 + 6,
                speedX: -1.5 - Math.random() * 1.5,
                opacity: Math.random() * 0.2 + 0.1,
              };
            } else {
              return {
                type: 'ember',
                x: Math.random() * width,
                y: isInit ? Math.random() * height : height + 10,
                r: Math.random() * 2 + 1,
                speedY: -1.2 - Math.random() * 1.5,
                speedX: (Math.random() - 0.5) * 1.2,
                alpha: Math.random() * 0.8 + 0.2,
                decay: Math.random() * 0.01 + 0.005,
                hue: Math.random() * 20 + 15,
              };
            }
          } else {
            // 亮色：暖阳微尘 +飞舞枫红秋叶
            if (Math.random() < 0.8) {
              return {
                type: 'dust',
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 2 + 0.8,
                speedY: (Math.random() - 0.5) * 0.2,
                speedX: (Math.random() - 0.5) * 0.2,
                alpha: Math.random() * 0.3 + 0.1,
                angle: Math.random() * Math.PI * 2,
                step: Math.random() * 0.01 + 0.005,
              };
            } else {
              const leafColors = [
                'rgba(249, 115, 22, 0.6)',
                'rgba(239, 68, 68, 0.55)',
                'rgba(234, 179, 8, 0.5)',
              ];
              return {
                type: 'petal',
                x: Math.random() * width,
                y: startY,
                width: Math.random() * 5 + 6,
                height: Math.random() * 3 + 3,
                speedY: Math.random() * 0.8 + 0.5,
                speedX: Math.random() * 0.4 + 0.2,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.03,
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                opacity: Math.random() * 0.5 + 0.3,
              };
            }
          }

        case 'secret-cave':
          if (theme === 'dark') {
            // 暗色：幽暗上升气泡
            return {
              type: 'bubble',
              x: Math.random() * width,
              y: isInit ? Math.random() * height : height + 20,
              r: Math.random() * 4 + 1.5,
              speedY: -0.6 - Math.random() * 0.8,
              wobbleSpeed: Math.random() * 0.03 + 0.01,
              wobbleRange: Math.random() * 1.2 + 0.3,
              wobbleAngle: Math.random() * Math.PI * 2,
              opacity: Math.random() * 0.3 + 0.15,
            };
          } else {
            // 亮色：丁达尔光线漫浮尘埃 (斜射飘散)
            const maxOpacity = Math.random() * 0.25 + 0.05;
            return {
              type: 'beam-light',
              x: Math.random() * (width - 100),
              y: startY,
              r: Math.random() * 3 + 2,
              speedY: Math.random() * 0.4 + 0.2,
              speedX: Math.random() * 0.6 + 0.3,
              opacity: 0,
              maxOpacity: maxOpacity,
              fadeSpeed: Math.random() * 0.005 + 0.002,
            };
          }

        case 'zen-eastern':
          if (theme === 'dark') {
            // 暗色：墨绿幽静竹叶
            return {
              type: 'leaf',
              x: Math.random() * width,
              y: startY,
              width: Math.random() * 6 + 8,
              height: Math.random() * 3 + 3,
              speedY: Math.random() * 0.6 + 0.4,
              speedX: Math.random() * 0.5 + 0.2,
              angle: Math.random() * Math.PI * 2,
              spinSpeed: (Math.random() - 0.5) * 0.02,
              color: 'rgba(21, 128, 61, 0.45)',
              opacity: Math.random() * 0.4 + 0.2,
            };
          } else {
            // 亮色：粉色樱花瓣 + 翠竹嫩叶
            if (Math.random() < 0.55) {
              return {
                type: 'petal',
                x: Math.random() * width,
                y: startY,
                width: Math.random() * 5 + 6,
                height: Math.random() * 3 + 3,
                speedY: Math.random() * 0.7 + 0.5,
                speedX: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.04,
                color: 'rgba(251, 180, 198, 0.75)',
                opacity: Math.random() * 0.6 + 0.3,
              };
            } else {
              return {
                type: 'leaf',
                x: Math.random() * width,
                y: startY,
                width: Math.random() * 5 + 8,
                height: Math.random() * 2.5 + 3,
                speedY: Math.random() * 0.8 + 0.5,
                speedX: Math.random() * 0.6 + 0.3,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.03,
                color: 'rgba(132, 204, 22, 0.55)',
                opacity: Math.random() * 0.5 + 0.3,
              };
            }
          }

        default:
          return {
            type: 'snow',
            x: 0,
            y: -100,
            r: 1,
            speedY: 0,
            swingRange: 0,
            swingSpeed: 0,
            swingAngle: 0,
            opacity: 0,
          };
      }
    };

    // 粒子主渲染循环
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        switch (p.type) {
          case 'snow':
            p.y += p.speedY;
            p.swingAngle += p.swingSpeed;
            p.x += Math.sin(p.swingAngle) * p.swingRange;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();

            if (p.y > height + 10 || p.x < -10 || p.x > width + 10) {
              particles[i] = createParticle(false);
            }
            break;

          case 'dandelion':
            // 蒲公英：右移 + 缓慢下降 + 正弦微晃
            p.y += p.speedY;
            p.x += p.speedX;
            p.swingAngle += p.swingSpeed;
            p.x += Math.sin(p.swingAngle) * p.swingRange;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            // 蒲公英花头白色实心
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();

            // 画微弱外线框
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            if (p.y > height + 10 || p.x > width + 10) {
              particles[i] = createParticle(false);
            }
            break;

          case 'petal':
            p.y += p.speedY;
            p.x += p.speedX;
            p.angle += p.spinSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.beginPath();
            // 用椭圆画花瓣/秋叶
            ctx.ellipse(0, 0, p.width, p.height, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.restore();
            ctx.globalAlpha = 1; // 重置

            if (p.y > height + 20 || p.x > width + 20) {
              particles[i] = createParticle(false);
            }
            break;

          case 'rain':
            p.y += p.speedY;
            p.x += p.speedX;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.speedY * 1.5);
            ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
              particles[i] = createParticle(false);
            }
            break;

          case 'ember':
            p.y += p.speedY;
            p.x += p.speedX;
            p.alpha -= p.decay;

            if (p.alpha > 0) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${p.alpha})`;
              ctx.shadowColor = `hsla(${p.hue}, 95%, 50%, 0.6)`;
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            }

            if (p.alpha <= 0 || p.y < -10) {
              particles[i] = createParticle(false);
            }
            break;

          case 'dust':
            // 亮色空气微尘：缓慢且随机飘动（使用正弦变角模拟）
            p.angle += p.step;
            p.y += p.speedY + Math.sin(p.angle) * 0.15;
            p.x += p.speedX + Math.cos(p.angle) * 0.15;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            // 金黄色半透明漂浮微粒，具有微发光感
            ctx.fillStyle = `rgba(253, 224, 71, ${p.alpha * (Math.abs(Math.sin(p.angle)) * 0.5 + 0.5)})`;
            ctx.shadowColor = 'rgba(253, 224, 71, 0.4)';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;

            // 超出边界，由于微尘全屏分布，若超出则在对侧拉回
            if (p.y < -10) p.y = height + 5;
            if (p.y > height + 10) p.y = -5;
            if (p.x < -10) p.x = width + 5;
            if (p.x > width + 10) p.x = -5;
            break;

          case 'bubble':
            p.y += p.speedY;
            p.wobbleAngle += p.wobbleSpeed;
            p.x += Math.sin(p.wobbleAngle) * p.wobbleRange;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity * 0.25})`;
            ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity})`;
            ctx.lineWidth = 1.0;
            ctx.fill();
            ctx.stroke();

            if (p.y < -20 || p.x < -10 || p.x > width + 10) {
              particles[i] = createParticle(false);
            }
            break;

          case 'beam-light':
            // 溶洞天光：金黄色尘埃向右下方斜落
            p.y += p.speedY;
            p.x += p.speedX;
            // 呼吸式淡入淡出
            if (p.opacity < p.maxOpacity) {
              p.opacity += p.fadeSpeed;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 204, 21, ${p.opacity})`;
            ctx.shadowColor = 'rgba(250, 204, 21, 0.35)';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (p.y > height + 20 || p.x > width + 20) {
              particles[i] = createParticle(false);
            }
            break;

          case 'leaf':
            p.y += p.speedY;
            p.x += p.speedX;
            p.angle += p.spinSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.width, p.height, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.restore();
            ctx.globalAlpha = 1;

            if (p.y > height + 30 || p.x > width + 30) {
              particles[i] = createParticle(false);
            }
            break;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    initParticles();
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scenarioId, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-1 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

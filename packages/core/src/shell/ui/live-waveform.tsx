import {
  createEffect,
  type JSX,
  on,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from "solid-js";
import { cn } from "../lib/shadcn/utils";

export type LiveWaveformProps = JSX.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  processing?: boolean;
  deviceId?: string;
  barWidth?: number;
  barHeight?: number;
  barGap?: number;
  barRadius?: number;
  barColor?: string;
  fadeEdges?: boolean;
  fadeWidth?: number;
  height?: string | number;
  sensitivity?: number;
  smoothingTimeConstant?: number;
  fftSize?: number;
  historySize?: number;
  updateRate?: number;
  mode?: "scrolling" | "static";
  onError?: (error: Error) => void;
  onStreamReady?: (stream: MediaStream) => void;
  onStreamEnd?: () => void;
};

export const LiveWaveform = (props: LiveWaveformProps) => {
  const [local, others] = splitProps(props, [
    "active",
    "processing",
    "deviceId",
    "barWidth",
    "barHeight",
    "barGap",
    "barRadius",
    "barColor",
    "fadeEdges",
    "fadeWidth",
    "height",
    "sensitivity",
    "smoothingTimeConstant",
    "fftSize",
    "historySize",
    "updateRate",
    "mode",
    "onError",
    "onStreamReady",
    "onStreamEnd",
    "class",
  ]);

  const active = () => local.active ?? false;
  const processing = () => local.processing ?? false;
  const barWidth = () => local.barWidth ?? 3;
  const barGap = () => local.barGap ?? 1;
  const barRadius = () => local.barRadius ?? 1.5;
  const barColor = () => local.barColor;
  const fadeEdges = () => local.fadeEdges ?? true;
  const fadeWidth = () => local.fadeWidth ?? 24;
  const baseBarHeight = () => local.barHeight ?? 4;
  const height = () => local.height ?? 64;
  const sensitivity = () => local.sensitivity ?? 1;
  const smoothingTimeConstant = () => local.smoothingTimeConstant ?? 0.8;
  const fftSize = () => local.fftSize ?? 256;
  const historySize = () => local.historySize ?? 60;
  const updateRate = () => local.updateRate ?? 30;
  const mode = () => local.mode ?? "static";

  // eslint-disable-next-line no-unassigned-vars -- assigned via JSX ref
  let canvasRef: HTMLCanvasElement | undefined;
  // eslint-disable-next-line no-unassigned-vars -- assigned via JSX ref
  let containerRef: HTMLDivElement | undefined;
  let history: number[] = [];
  let analyser: AnalyserNode | null = null;
  let audioContext: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let animationId = 0;
  let lastUpdate = 0;
  let processingAnimationId: number | null = null;
  let lastActiveData: number[] = [];
  let transitionProgress = 0;
  let staticBars: number[] = [];
  let needsRedraw = true;
  let gradientCache: CanvasGradient | null = null;
  let lastWidth = 0;

  const heightStyle = () =>
    typeof height() === "number" ? `${height()}px` : height();

  // Handle canvas resizing
  onMount(() => {
    const canvas = canvasRef;
    const container = containerRef;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      gradientCache = null;
      lastWidth = rect.width;
      needsRedraw = true;
    });

    resizeObserver.observe(container);
    onCleanup(() => resizeObserver.disconnect());
  });

  // Handle processing animation
  createEffect(
    on([processing, active], () => {
      if (processing() && !active()) {
        let time = 0;
        transitionProgress = 0;

        const animateProcessing = () => {
          time += 0.03;
          transitionProgress = Math.min(1, transitionProgress + 0.02);

          const processingData: number[] = [];
          const barCount = Math.floor(
            (containerRef?.getBoundingClientRect().width || 200) /
              (barWidth() + barGap()),
          );

          if (mode() === "static") {
            const halfCount = Math.floor(barCount / 2);

            for (let i = 0; i < barCount; i++) {
              const normalizedPosition = (i - halfCount) / halfCount;
              const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;

              const wave1 =
                Math.sin(time * 1.5 + normalizedPosition * 3) * 0.25;
              const wave2 = Math.sin(time * 0.8 - normalizedPosition * 2) * 0.2;
              const wave3 = Math.cos(time * 2 + normalizedPosition) * 0.15;
              const combinedWave = wave1 + wave2 + wave3;
              const processingValue = (0.2 + combinedWave) * centerWeight;

              let finalValue = processingValue;
              if (lastActiveData.length > 0 && transitionProgress < 1) {
                const lastDataIndex = Math.min(i, lastActiveData.length - 1);
                const lastValue = lastActiveData[lastDataIndex] || 0;
                finalValue =
                  lastValue * (1 - transitionProgress) +
                  processingValue * transitionProgress;
              }

              processingData.push(Math.max(0.05, Math.min(1, finalValue)));
            }
          } else {
            for (let i = 0; i < barCount; i++) {
              const normalizedPosition = (i - barCount / 2) / (barCount / 2);
              const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;

              const wave1 = Math.sin(time * 1.5 + i * 0.15) * 0.25;
              const wave2 = Math.sin(time * 0.8 - i * 0.1) * 0.2;
              const wave3 = Math.cos(time * 2 + i * 0.05) * 0.15;
              const combinedWave = wave1 + wave2 + wave3;
              const processingValue = (0.2 + combinedWave) * centerWeight;

              let finalValue = processingValue;
              if (lastActiveData.length > 0 && transitionProgress < 1) {
                const lastDataIndex = Math.floor(
                  (i / barCount) * lastActiveData.length,
                );
                const lastValue = lastActiveData[lastDataIndex] || 0;
                finalValue =
                  lastValue * (1 - transitionProgress) +
                  processingValue * transitionProgress;
              }

              processingData.push(Math.max(0.05, Math.min(1, finalValue)));
            }
          }

          if (mode() === "static") {
            staticBars = processingData;
          } else {
            history = processingData;
          }

          needsRedraw = true;
          processingAnimationId = requestAnimationFrame(animateProcessing);
        };

        animateProcessing();

        onCleanup(() => {
          if (processingAnimationId) {
            cancelAnimationFrame(processingAnimationId);
          }
        });
      } else if (!active() && !processing()) {
        const hasData =
          mode() === "static" ? staticBars.length > 0 : history.length > 0;

        if (hasData) {
          let fadeProgress = 0;
          const fadeToIdle = () => {
            fadeProgress += 0.03;
            if (fadeProgress < 1) {
              if (mode() === "static") {
                staticBars = staticBars.map(
                  (value) => value * (1 - fadeProgress),
                );
              } else {
                history = history.map((value) => value * (1 - fadeProgress));
              }
              needsRedraw = true;
              requestAnimationFrame(fadeToIdle);
            } else {
              if (mode() === "static") {
                staticBars = [];
              } else {
                history = [];
              }
            }
          };
          fadeToIdle();
        }
      }
    }),
  );

  // Handle microphone setup and teardown
  createEffect(
    on(
      [active, () => local.deviceId, fftSize, smoothingTimeConstant],
      async () => {
        if (!active()) {
          if (stream) {
            for (const track of stream.getTracks()) {
              track.stop();
            }
            stream = null;
            local.onStreamEnd?.();
          }
          if (audioContext && audioContext.state !== "closed") {
            audioContext.close();
            audioContext = null;
          }
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
          }
          return;
        }

        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            audio: local.deviceId
              ? {
                  deviceId: { exact: local.deviceId },
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                }
              : {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                },
          });
          stream = newStream;
          local.onStreamReady?.(newStream);

          const AudioContextConstructor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          const newAudioContext = new AudioContextConstructor();
          const newAnalyser = newAudioContext.createAnalyser();
          newAnalyser.fftSize = fftSize();
          newAnalyser.smoothingTimeConstant = smoothingTimeConstant();

          const source = newAudioContext.createMediaStreamSource(newStream);
          source.connect(newAnalyser);

          audioContext = newAudioContext;
          analyser = newAnalyser;

          history = [];
        } catch (error) {
          local.onError?.(error as Error);
        }
      },
    ),
  );

  // Cleanup on unmount
  onCleanup(() => {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      stream = null;
      local.onStreamEnd?.();
    }
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close();
      audioContext = null;
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
  });

  // Animation loop
  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const animate = (currentTime: number) => {
      const rect = canvas.getBoundingClientRect();

      if (active() && currentTime - lastUpdate > updateRate()) {
        lastUpdate = currentTime;

        if (analyser) {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);

          if (mode() === "static") {
            const startFreq = Math.floor(dataArray.length * 0.05);
            const endFreq = Math.floor(dataArray.length * 0.4);
            const relevantData = dataArray.slice(startFreq, endFreq);

            const barCount = Math.floor(rect.width / (barWidth() + barGap()));
            const halfCount = Math.floor(barCount / 2);
            const newBars: number[] = [];

            for (let i = halfCount - 1; i >= 0; i--) {
              const dataIndex = Math.floor(
                (i / halfCount) * relevantData.length,
              );
              const value = Math.min(
                1,
                (relevantData[dataIndex] / 255) * sensitivity(),
              );
              newBars.push(Math.max(0.05, value));
            }

            for (let i = 0; i < halfCount; i++) {
              const dataIndex = Math.floor(
                (i / halfCount) * relevantData.length,
              );
              const value = Math.min(
                1,
                (relevantData[dataIndex] / 255) * sensitivity(),
              );
              newBars.push(Math.max(0.05, value));
            }

            staticBars = newBars;
            lastActiveData = newBars;
          } else {
            let sum = 0;
            const startFreq = Math.floor(dataArray.length * 0.05);
            const endFreq = Math.floor(dataArray.length * 0.4);
            const relevantData = dataArray.slice(startFreq, endFreq);

            for (const datum of relevantData) {
              sum += datum;
            }
            const average = (sum / relevantData.length / 255) * sensitivity();

            history.push(Math.min(1, Math.max(0.05, average)));
            lastActiveData = [...history];

            if (history.length > historySize()) {
              history.shift();
            }
          }
          needsRedraw = true;
        }
      }

      if (!needsRedraw && !active()) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      needsRedraw = active();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const computedBarColor =
        barColor() ||
        (() => {
          const style = getComputedStyle(canvas);
          const color = style.color;
          return color || "#000";
        })();

      const step = barWidth() + barGap();
      const barCount = Math.floor(rect.width / step);
      const centerY = rect.height / 2;

      if (mode() === "static") {
        const dataToRender = (() => {
          if (processing()) return staticBars;
          if (active()) return staticBars;
          if (staticBars.length > 0) return staticBars;
          return [];
        })();

        for (let i = 0; i < barCount && i < dataToRender.length; i++) {
          const value = dataToRender[i] || 0.1;
          const x = i * step;
          const currentBarHeight = Math.max(
            baseBarHeight(),
            value * rect.height * 0.8,
          );
          const y = centerY - currentBarHeight / 2;

          ctx.fillStyle = computedBarColor;
          ctx.globalAlpha = 0.4 + value * 0.6;

          if (barRadius() > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth(), currentBarHeight, barRadius());
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth(), currentBarHeight);
          }
        }
      } else {
        for (let i = 0; i < barCount && i < history.length; i++) {
          const dataIndex = history.length - 1 - i;
          const value = history[dataIndex] || 0.1;
          const x = rect.width - (i + 1) * step;
          const currentBarHeight = Math.max(
            baseBarHeight(),
            value * rect.height * 0.8,
          );
          const y = centerY - currentBarHeight / 2;

          ctx.fillStyle = computedBarColor;
          ctx.globalAlpha = 0.4 + value * 0.6;

          if (barRadius() > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth(), currentBarHeight, barRadius());
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth(), currentBarHeight);
          }
        }
      }

      if (fadeEdges() && fadeWidth() > 0 && rect.width > 0) {
        if (!gradientCache || lastWidth !== rect.width) {
          const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
          const fadePercent = Math.min(0.3, fadeWidth() / rect.width);

          gradient.addColorStop(0, "rgba(255,255,255,1)");
          gradient.addColorStop(fadePercent, "rgba(255,255,255,0)");
          gradient.addColorStop(1 - fadePercent, "rgba(255,255,255,0)");
          gradient.addColorStop(1, "rgba(255,255,255,1)");

          gradientCache = gradient;
          lastWidth = rect.width;
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = gradientCache;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    onCleanup(() => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });
  });

  return (
    <div
      class={cn("relative h-full w-full", local.class)}
      ref={containerRef}
      style={{ height: heightStyle() as string }}
      aria-label={(() => {
        if (active()) return "Live audio waveform";
        if (processing()) return "Processing audio";
        return "Audio waveform idle";
      })()}
      role="img"
      {...others}
    >
      <Show when={!active() && !processing()}>
        <div class="border-muted-foreground/20 absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t-2 border-dotted" />
      </Show>
      <canvas class="block h-full w-full" ref={canvasRef} />
    </div>
  );
};

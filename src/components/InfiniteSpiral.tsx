import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

// Adapted from React Bits Infinite Spiral, licensed under MIT.

type InfiniteSpiralProps = {
  items: ReactNode[];
};

const speed = 0.48;
const radius = 190;
const cardWidth = 104;
const cardHeight = 88;
const verticalSpacing = 58;
const perspective = 1000;
const cardsPerTurn = 8;
const centerScale = 1.12;
const edgeFade = 0.4;
const edgeBlur = 8;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

const modulo = (value: number, divisor: number): number =>
  ((value % divisor) + divisor) % divisor;

const smoothstep = (minimum: number, maximum: number, value: number): number => {
  const normalized = clamp(
    (value - minimum) / (maximum - minimum || 1),
    0,
    1,
  );
  return normalized * normalized * (3 - 2 * normalized);
};

export const InfiniteSpiral = ({ items }: InfiniteSpiralProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      throw new Error("Infinite Spiral root was not mounted.");
    }
    if (items.length === 0) {
      throw new Error("Infinite Spiral requires at least one item.");
    }

    let frameId = 0;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    let lastScrollY = window.scrollY;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });

    const handleScroll = (): void => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;

      if (!visibleRef.current || scrollDelta === 0) {
        return;
      }

      targetProgressRef.current += clamp(
        (scrollDelta * 0.35) / verticalSpacing,
        -1.2,
        1.2,
      );
    };

    const render = (time: number): void => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const motionPaused = draggingRef.current || hoveredRef.current;
      const desiredSpeed =
        visibleRef.current && !reducedMotion.matches && !motionPaused ? speed : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current +=
        (targetProgressRef.current - progressRef.current) * followBlend;

      const count = items.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const responsiveScale = width < 520 ? 0.72 : 1;
      const fit = Math.min(
        responsiveScale,
        width / (cardWidth * 2.8),
        height / (cardHeight * 2.35),
      );
      const radiusRatio = width < 520 ? 0.3 : 0.36;
      const responsiveRadius =
        Math.min(radius, Math.max(72, width * radiusRatio)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);

      cardRefs.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        const offset = modulo(index - progressRef.current + half, count) - half;
        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus =
          1 - Math.min(Math.abs(offset) / Math.max(cardsPerTurn * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / cardsPerTurn);
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(
          perspective / Math.max(perspective - z, 1),
          0.72,
          1.45,
        );
        const visualScale = scale * depthScale;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur * smoothstep(0.35, 1, edge);

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) scale(${visualScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(Math.round(depth * 100000) + index);
      });

      frameId = requestAnimationFrame(render);
    };

    resizeObserver.observe(root);
    intersectionObserver.observe(root);
    window.addEventListener("scroll", handleScroll, { passive: true });
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = "grab";
  };

  const rootStyle = {
    perspective: `${perspective}px`,
    cursor: "grab",
    touchAction: "pan-x",
    userSelect: "none",
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      style={rootStyle}
      className="infinite-spiral"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return;
        }
        draggingRef.current = true;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current = progressRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) {
          return;
        }
        const pointerDelta = event.clientY - lastPointerYRef.current;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current -= pointerDelta / verticalSpacing;
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div className="infinite-spiral-stage" role="list" aria-label="Technologies">
        {items.map((item, index) => (
          <div
            key={index}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="infinite-spiral-item"
            role="listitem"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

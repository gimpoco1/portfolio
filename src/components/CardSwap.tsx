import gsap from "gsap";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

// Adapted from React Bits Card Swap by David Haz, licensed under MIT.

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <div ref={ref} {...props} />
));

Card.displayName = "Card";

type CardSwapProps = {
  width: number;
  height: number;
  cardDistance: number;
  verticalDistance: number;
  delay: number;
  skewAmount: number;
  children: ReactNode;
  onActiveCardChange: (index: number) => void;
};

export type CardSwapHandle = {
  showPrevious: () => void;
  showNext: () => void;
};

type CardRef = RefObject<HTMLDivElement | null>;

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

const makeSlot = (
  index: number,
  horizontalDistance: number,
  verticalDistance: number,
  total: number,
): Slot => ({
  x: index * horizontalDistance,
  y: -index * verticalDistance,
  z: -index * horizontalDistance * 1.5,
  zIndex: total - index,
});

const requireCardElement = (
  cardRef: CardRef,
  index: number,
): HTMLDivElement => {
  if (!cardRef.current) {
    throw new Error(`Card Swap could not find card element at index ${index}.`);
  }

  return cardRef.current;
};

const placeCard = (
  element: HTMLDivElement,
  slot: Slot,
  skewAmount: number,
): void => {
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skewAmount,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>((props, ref) => {
  const {
    width,
    height,
    cardDistance,
    verticalDistance,
    delay,
    skewAmount,
    children,
    onActiveCardChange,
  } = props;
  const childElements = useMemo(() => {
    const elements = Children.toArray(children);

    if (!elements.every((child) => isValidElement<CardProps>(child))) {
      throw new TypeError("Card Swap children must all be valid Card elements.");
    }

    return elements as ReactElement<CardProps>[];
  }, [children]);

  const cardRefs = useMemo<CardRef[]>(
    () => childElements.map(() => ({ current: null })),
    [childElements.length],
  );
  const orderRef = useRef<number[]>(
    childElements.map((_child, index) => index),
  );
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activateCardRef = useRef<(index: number) => void>(() => undefined);
  const restartIntervalRef = useRef<() => void>(() => undefined);

  useImperativeHandle(
    ref,
    () => ({
      showPrevious: () => {
        const previousIndex = orderRef.current[orderRef.current.length - 1];
        activateCardRef.current(previousIndex);
      },
      showNext: () => {
        activateCardRef.current(orderRef.current[0]);
      },
    }),
    [],
  );

  useEffect(() => {
    const totalCards = cardRefs.length;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    cardRefs.forEach((cardRef, index) => {
      placeCard(
        requireCardElement(cardRef, index),
        makeSlot(index, cardDistance, verticalDistance, totalCards),
        reduceMotion ? 0 : skewAmount,
      );
    });
    onActiveCardChange(orderRef.current[0]);

    const activateCard = (cardIndex: number): void => {
      const currentOrder = orderRef.current;
      const currentPosition = currentOrder.indexOf(cardIndex);

      if (currentPosition === -1) {
        throw new RangeError(
          `Card Swap cannot activate missing card index ${cardIndex}.`,
        );
      }

      const nextOrder =
        currentPosition === 0
          ? [...currentOrder.slice(1), currentOrder[0]]
          : [cardIndex, ...currentOrder.filter((index) => index !== cardIndex)];

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      timelineRef.current?.kill();
      const timeline = gsap.timeline({
        onComplete: () => {
          orderRef.current = nextOrder;
          onActiveCardChange(nextOrder[0]);
          restartIntervalRef.current();
        },
      });
      timelineRef.current = timeline;

      nextOrder.forEach((index, slotIndex) => {
        const card = requireCardElement(cardRefs[index], index);
        const slot = makeSlot(
          slotIndex,
          cardDistance,
          verticalDistance,
          totalCards,
        );
        timeline.set(card, { zIndex: slot.zIndex }, 0);
        timeline.to(
          card,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: reduceMotion ? 0 : skewAmount,
            duration: reduceMotion ? 0 : 0.55,
            ease: "power2.inOut",
          },
          0,
        );
      });
    };
    activateCardRef.current = activateCard;

    if (reduceMotion || totalCards < 2) {
      return () => {
        activateCardRef.current = () => undefined;
      };
    }

    const swapCards = (): void => {
      const [frontIndex, ...remainingIndices] = orderRef.current;
      const frontCard = requireCardElement(
        cardRefs[frontIndex],
        frontIndex,
      );
      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      timeline.to(frontCard, {
        y: "+=500",
        duration: 0.8,
        ease: "power1.inOut",
      });
      timeline.addLabel("promote", "-=0.36");

      remainingIndices.forEach((cardIndex, slotIndex) => {
        const card = requireCardElement(cardRefs[cardIndex], cardIndex);
        const slot = makeSlot(
          slotIndex,
          cardDistance,
          verticalDistance,
          totalCards,
        );

        timeline.set(card, { zIndex: slot.zIndex }, "promote");
        timeline.to(
          card,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: 0.8,
            ease: "power1.inOut",
          },
          `promote+=${slotIndex * 0.12}`,
        );
      });

      const backSlot = makeSlot(
        totalCards - 1,
        cardDistance,
        verticalDistance,
        totalCards,
      );
      timeline.addLabel("return", "promote+=0.16");
      timeline.set(frontCard, { zIndex: backSlot.zIndex }, "return");
      timeline.to(
        frontCard,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: 0.8,
          ease: "power1.inOut",
        },
        "return",
      );
      timeline.call(() => {
        orderRef.current = [...remainingIndices, frontIndex];
        onActiveCardChange(orderRef.current[0]);
      });
    };

    const startInterval = (): void => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(swapCards, delay);
    };
    const pauseAnimation = (): void => {
      timelineRef.current?.pause();
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
    const resumeAnimation = (): void => {
      timelineRef.current?.play();
      startInterval();
    };
    const container = containerRef.current;

    if (!container) {
      throw new Error("Card Swap container was not mounted.");
    }

    restartIntervalRef.current = () => {
      const hasFocus = container.contains(document.activeElement);
      if (!container.matches(":hover") && !hasFocus) {
        startInterval();
      }
    };

    swapCards();
    startInterval();
    container.addEventListener("mouseenter", pauseAnimation);
    container.addEventListener("mouseleave", resumeAnimation);
    container.addEventListener("focusin", pauseAnimation);
    container.addEventListener("focusout", resumeAnimation);

    return () => {
      activateCardRef.current = () => undefined;
      restartIntervalRef.current = () => undefined;
      container.removeEventListener("mouseenter", pauseAnimation);
      container.removeEventListener("mouseleave", resumeAnimation);
      container.removeEventListener("focusin", pauseAnimation);
      container.removeEventListener("focusout", resumeAnimation);
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      timelineRef.current?.kill();
    };
  }, [
    cardDistance,
    cardRefs,
    delay,
    onActiveCardChange,
    skewAmount,
    verticalDistance,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width, height, perspective: "900px" }}
    >
      {childElements.map((child, index) =>
        cloneElement(child, {
          key: child.key ?? index,
          ref: cardRefs[index],
          style: {
            position: "absolute",
            top: "50%",
            left: "50%",
            width,
            height,
            transformStyle: "preserve-3d",
            willChange: "transform",
            backfaceVisibility: "hidden",
            ...child.props.style,
          },
          onClick: (event: ReactMouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(event);
            const target = event.target;

            if (target instanceof Element && target.closest("a")) {
              return;
            }

            activateCardRef.current(index);
          },
        } as CardProps & { ref: CardRef }),
      )}
    </div>
  );
});

CardSwap.displayName = "CardSwap";

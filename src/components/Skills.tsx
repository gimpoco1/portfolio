import styled from "@emotion/styled";
import { techStack } from "../content";
import { FeatureCard, FeatureHeader, PillLabel } from "./CommonStyles";
import { InfiniteSpiral } from "./InfiniteSpiral";

const iconSlugs: Record<string, string> = {
  HTML: "html5",
  CSS: "csswizardry",
  React: "react",
  JavaScript: "javascript",
  TypeScript: "typescript",
  "Next JS": "nextdotjs",
  "Chakra UI": "chakraui",
  TailwindCSS: "tailwindcss",
  "Node JS": "nodedotjs",
  NestJS: "nestjs",
  PostgreSQL: "postgresql",
  "Express/KOA": "express",
  "Git CD/CI": "git",
  MongoDB: "mongodb",
  Redux: "redux",
  Storybook: "storybook",
  Python: "python",
  Django: "django",
  Docker: "docker",
  Vite: "vite",
  Figma: "figma",
  iOS: "apple",
  Swift: "swift",
  Capacitor: "capacitor",
  "Apple StoreKit": "apple",
  Supabase: "supabase",
  Stripe: "stripe",
  "Google AdSense": "googleadsense",
  "Three.js": "threedotjs",
};

const lightIconSkills = new Set(["iOS", "Apple StoreKit", "Three.js"]);

const iconForSkill = (skill: string): string => {
  const slug = iconSlugs[skill];

  if (!slug) {
    throw new Error(`No icon slug is configured for technology "${skill}".`);
  }

  return `https://cdn.simpleicons.org/${slug}`;
};

const skillItem = (skill: string) => (
  <TechItem aria-label={skill}>
    <TechIcon>
      <img
        src={iconForSkill(skill)}
        alt=""
        className={lightIconSkills.has(skill) ? "light-icon" : undefined}
        draggable={false}
      />
    </TechIcon>
    <TechLabel>{skill}</TechLabel>
  </TechItem>
);

export const Skills = () => (
  <SkillsSection id="experience">
    <SkillsHeader>
      <FeatureHeader>
        <PillLabel>What I build with</PillLabel>
      </FeatureHeader>
    </SkillsHeader>
    <SpiralStage>
      <InfiniteSpiral items={techStack.map(skillItem)} />
    </SpiralStage>
  </SkillsSection>
);

const SkillsSection = styled(FeatureCard)`
  padding: 0;
  overflow: hidden;

  @media (max-width: 620px) {
    border-radius: 22px;
  }
`;

const SkillsHeader = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  padding: clamp(22px, 3vw, 34px);
  padding-bottom: 0;

  @media (max-width: 620px) {
    flex-direction: column;
    gap: 0;
    padding: 18px 16px 0;
  }
`;

const SpiralStage = styled.div`
  position: relative;
  z-index: 1;

  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: transparent;

  &::before,
  &::after {
    content: "";
    position: absolute;
    right: 0;
    left: 0;
    z-index: 200000;
    height: 92px;
    pointer-events: none;
    backdrop-filter: blur(8px);
  }

  @media (max-width: 620px) {
    &::before,
    &::after {
      height: 72px;
    }
  }

  &::before {
    top: 0;
    background: linear-gradient(
      to bottom,
      rgba(6, 5, 12, 0.82),
      rgba(6, 5, 12, 0)
    );
    -webkit-mask-image: linear-gradient(to bottom, black, transparent);
    mask-image: linear-gradient(to bottom, black, transparent);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(
      to top,
      rgba(6, 5, 12, 0.82),
      rgba(6, 5, 12, 0)
    );
    -webkit-mask-image: linear-gradient(to top, black, transparent);
    mask-image: linear-gradient(to top, black, transparent);
  }

  .infinite-spiral {
    position: relative;
    width: 100%;
    height: 480px;
    overflow: hidden;
    isolation: isolate;
  }

  @media (max-width: 620px) {
    .infinite-spiral {
      height: 370px;
    }
  }

  .infinite-spiral-stage {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
  }

  .infinite-spiral-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 104px;
    height: 88px;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity, filter;
  }

`;

const TechItem = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 9px 8px 7px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 17px;
  background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.14),
      rgba(255, 255, 255, 0.05)
    ),
    rgba(18, 16, 28, 0.94);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.13);
  user-select: none;
`;

const TechIcon = styled.div`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .light-icon {
    filter: invert(1) brightness(1.2);
  }
`;

const TechLabel = styled.span`
  display: grid;
  width: 100%;
  min-height: 20px;
  place-items: center;
  color: var(--text);
  font-size: 10px;
  font-weight: 750;
  line-height: 1.05;
  text-align: center;
`;

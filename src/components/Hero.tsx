import styled from "@emotion/styled";
import { useEffect, useState } from "react";

type ContributionDay = {
  date: string;
  count: number;
  level: string;
  weekday: number;
};

type ContributionWeek = {
  firstDay: string;
  days: ContributionDay[];
};

type ContributionData = {
  username: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  generatedAt: string;
};

const GITHUB_PROFILE_URL = "https://github.com/gimpoco1";
const EMPTY_WEEKS = Array.from({ length: 53 }, (_, index) => ({
  firstDay: `loading-${index}`,
  days: [] as ContributionDay[],
}));

const levelColors: Record<string, string> = {
  NONE: "rgba(255, 255, 255, 0.055)",
  FIRST_QUARTILE: "rgba(14, 190, 255, 0.34)",
  SECOND_QUARTILE: "rgba(14, 190, 255, 0.58)",
  THIRD_QUARTILE: "rgba(120, 92, 255, 0.78)",
  FOURTH_QUARTILE: "#e4d1ff",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export const Hero = ({ experienceYears }: { experienceYears: number }) => {
  const [contributions, setContributions] =
    useState<ContributionData | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github-contributions", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub activity request failed");
        return response.json() as Promise<ContributionData>;
      })
      .then((data) => setContributions(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setHasError(true);
      });

    return () => controller.abort();
  }, []);

  const weeks = contributions?.weeks ?? EMPTY_WEEKS;
  const activityLabel = contributions
    ? `${contributions.totalContributions.toLocaleString()} contributions in the last year`
    : hasError
      ? "See my latest work on GitHub"
      : "Loading the latest activity…";

  return (
    <HeroSection id="hero">
      <HeroIntro>
        <HeroHeading>
          I build digital products that feel{" "}
          <HeadingAccent>simple, fast, and genuinely useful.</HeadingAccent>
        </HeroHeading>
        <HeroSummary>
          Full-stack developer creating polished web and mobile experiences. From
          interface to infrastructure.
        </HeroSummary>
        <HeroActions>
          <PrimaryAction href="#projects">
            Explore my work <span aria-hidden="true">↓</span>
          </PrimaryAction>
          <SecondaryAction href="#contact">
            Get in touch <span aria-hidden="true">↘</span>
          </SecondaryAction>
        </HeroActions>
      </HeroIntro>

      <ActivityCard
        href={GITHUB_PROFILE_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={`Giacomo's GitHub profile. ${activityLabel}`}
      >
        <ActivityHeader>
          <ActivityTitle>
            <GitHubIcon viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.09 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.3-5.27-1.29-5.27-5.7 0-1.27.45-2.3 1.19-3.1-.12-.3-.52-1.48.11-3.07 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.78.11 3.08.74.8 1.19 1.83 1.19 3.09 0 4.43-2.71 5.4-5.29 5.69.42.36.79 1.06.79 2.15v3.2c0 .3.2.67.8.55A11.5 11.5 0 0 0 12 .7Z" />
            </GitHubIcon>
            <span>
              <strong>A year on GitHub</strong>
              <small>{activityLabel}</small>
            </span>
          </ActivityTitle>
          <LiveLabel>
            <LiveDot />
            {contributions
              ? "Live from GitHub"
              : hasError
                ? "GitHub profile"
                : "Connecting to GitHub"}
          </LiveLabel>
        </ActivityHeader>

        <ContributionGrid
          role="img"
          aria-label={activityLabel}
          aria-busy={!contributions && !hasError}
        >
          {weeks.map((week) => (
            <ContributionWeekColumn key={week.firstDay}>
              {Array.from({ length: 7 }, (_, weekday) => {
                const day = week.days.find((item) => item.weekday === weekday);
                const title = day
                  ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`
                  : undefined;

                return (
                  <ContributionCell
                    key={`${week.firstDay}-${weekday}`}
                    className={!contributions && !hasError ? "is-loading" : ""}
                    style={{
                      backgroundColor: day
                        ? levelColors[day.level] ?? levelColors.NONE
                        : levelColors.NONE,
                    }}
                    title={title}
                  />
                );
              })}
            </ContributionWeekColumn>
          ))}
        </ContributionGrid>

        <ActivityFooter>
          <span>Less</span>
          {Object.values(levelColors).map((color) => (
            <LegendCell key={color} style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
          <ProfileLink>View GitHub profile ↗</ProfileLink>
        </ActivityFooter>
      </ActivityCard>

      <Eyebrow>Software Development · {experienceYears}+ years</Eyebrow>
    </HeroSection>
  );
};

const HeroSection = styled.section`
  min-height: calc(100svh - 120px);
  text-align: center;
  padding: clamp(32px, 5vh, 58px) 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 880px) {
    min-height: calc(100svh - 108px);
    padding: 36px 0 54px;
  }

  @media (min-width: 881px) and (max-height: 900px) {
    padding: 22px 18px 32px;
  }
`;

const HeroIntro = styled.div`
  width: min(100%, 840px);
  margin: 0 auto clamp(24px, 3.5vh, 38px);
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 881px) and (max-height: 900px) {
    margin-bottom: 26px;
  }
`;

const HeroHeading = styled.h1`
  max-width: 820px;
  margin: 0;
  color: var(--text);
  font-size: clamp(40px, 4.8vw, 58px);
  line-height: 1;
  letter-spacing: -0.055em;
  text-wrap: balance;
  text-shadow: 0 10px 42px rgba(0, 0, 0, 0.38);

  @media (max-width: 560px) {
    font-size: clamp(38px, 12vw, 54px);
    line-height: 1.02;
  }

  @media (min-width: 881px) and (max-height: 900px) {
    max-width: 760px;
    font-size: clamp(38px, 4.4vw, 50px);
    line-height: 0.98;
  }
`;

const HeadingAccent = styled.span`
  color: transparent;
  background: linear-gradient(105deg, #ffffff 8%, #8de9ff 47%, #d8c1ff 92%);
  background-clip: text;
  -webkit-background-clip: text;
`;

const HeroSummary = styled.p`
  max-width: 700px;
  margin: clamp(18px, 2.4vw, 24px) auto 0;
  color: var(--muted);
  font-size: clamp(17px, 1.8vw, 19px);
  line-height: 1.55;
  text-wrap: balance;

  @media (min-width: 881px) and (max-height: 900px) {
    margin-top: 14px;
    font-size: 17px;
    line-height: 1.4;
  }
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;

  @media (min-width: 881px) and (max-height: 900px) {
    margin-top: 16px;
  }
`;

const HeroAction = styled.a`
  min-height: 48px;
  padding: 12px 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 15px;
  font-weight: 750;
  transition: transform 180ms ease, border-color 180ms ease,
    background 180ms ease, box-shadow 180ms ease;

  span {
    font-size: 18px;
    line-height: 1;
    transition: transform 180ms ease;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid #8de9ff;
    outline-offset: 3px;
  }

  @media (min-width: 881px) and (max-height: 900px) {
    min-height: 42px;
    padding: 9px 17px;
  }
`;

const PrimaryAction = styled(HeroAction)`
  color: #071018;
  border-color: rgba(141, 233, 255, 0.7);
  background: linear-gradient(115deg, #8de9ff, #d8c1ff);
  box-shadow: 0 14px 38px rgba(93, 185, 255, 0.25);

  &:hover {
    box-shadow: 0 18px 46px rgba(93, 185, 255, 0.36);

    span {
      transform: translateY(3px);
    }
  }
`;

const SecondaryAction = styled(HeroAction)`
  color: var(--text);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);

  &:hover {
    border-color: rgba(141, 233, 255, 0.5);
    background: rgba(255, 255, 255, 0.11);

    span {
      transform: translate(2px, 2px);
    }
  }
`;

const ActivityCard = styled.a`
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: clamp(15px, 1.8vw, 20px);
  display: block;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.035)
    ),
    rgba(8, 6, 16, 0.76);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px);
  transition: transform 180ms ease, border-color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(113, 216, 255, 0.38);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.48),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  text-align: left;
`;

const ActivityTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  > span {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  strong {
    color: var(--text);
    font-size: clamp(16px, 2vw, 20px);
    letter-spacing: -0.02em;
  }

  small {
    color: var(--muted);
    font-size: 12px;
  }
`;

const GitHubIcon = styled.svg`
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  fill: currentColor;
  color: var(--text);
`;

const LiveLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex: 0 0 auto;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;

  @media (max-width: 560px) {
    font-size: 0;
    gap: 0;
  }
`;

const LiveDot = styled.span`
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #57ebff;
  box-shadow: 0 0 14px rgba(87, 235, 255, 0.9);
  animation: live-dot-pulse 2s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    inset: -5px;
    border: 1px solid rgba(87, 235, 255, 0.72);
    border-radius: inherit;
    animation: live-dot-ring 2s ease-out infinite;
  }

  @keyframes live-dot-pulse {
    0%,
    100% {
      opacity: 0.78;
      transform: scale(0.92);
      box-shadow: 0 0 8px rgba(87, 235, 255, 0.58);
    }
    50% {
      opacity: 1;
      transform: scale(1.08);
      box-shadow: 0 0 18px rgba(87, 235, 255, 1);
    }
  }

  @keyframes live-dot-ring {
    0% {
      opacity: 0.72;
      transform: scale(0.45);
    }
    75%,
    100% {
      opacity: 0;
      transform: scale(1.35);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &::after {
      display: none;
    }
  }
`;

const ContributionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(53, minmax(3px, 1fr));
  gap: clamp(2px, 0.35vw, 4px);
  width: 100%;
`;

const ContributionWeekColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(7, minmax(3px, 1fr));
  gap: clamp(2px, 0.35vw, 4px);
`;

const ContributionCell = styled.span`
  width: 100%;
  aspect-ratio: 1;
  border-radius: clamp(1px, 0.35vw, 3px);
  border: 1px solid rgba(255, 255, 255, 0.035);
  transition: transform 140ms ease, filter 140ms ease;

  &[title]:hover {
    transform: scale(1.45);
    filter: brightness(1.25);
  }

  &.is-loading {
    animation: activity-pulse 1.8s ease-in-out infinite alternate;
  }

  @keyframes activity-pulse {
    from {
      opacity: 0.35;
    }
    to {
      opacity: 0.75;
    }
  }
`;

const ActivityFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 11px;
`;

const LegendCell = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
`;

const ProfileLink = styled.span`
  margin-left: auto;
  color: var(--text);
  font-weight: 700;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: white;
  color: var(--text-dark);
  font-weight: 700;
  font-size: 16px;
  margin: 20px 0 0;

  @media (max-width: 880px) {
    margin-top: 16px;
    padding: 4px 10px;
    font-size: 12px;
  }

  @media (min-width: 881px) and (max-height: 900px) {
    margin-top: 14px;
    padding: 6px 12px;
    font-size: 14px;
  }
`;

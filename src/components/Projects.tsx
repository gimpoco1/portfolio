import styled from "@emotion/styled";
import { useCallback, useRef, useState } from "react";
import { projects } from "../content";
import { Card, CardSwap, type CardSwapHandle } from "./CardSwap";
import { FeatureCard, FeatureHeader, PillLabel } from "./CommonStyles";

export const Projects = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const cardSwapRef = useRef<CardSwapHandle>(null);
  const activeProject = projects[activeProjectIndex];
  const handleActiveProjectChange = useCallback((index: number) => {
    setActiveProjectIndex(index);
  }, []);
  const showPreviousProject = useCallback(() => {
    if (!cardSwapRef.current) {
      throw new Error("Project card navigation is not ready.");
    }
    cardSwapRef.current.showPrevious();
  }, []);
  const showNextProject = useCallback(() => {
    if (!cardSwapRef.current) {
      throw new Error("Project card navigation is not ready.");
    }
    cardSwapRef.current.showNext();
  }, []);

  return (
    <ProjectsSection id="projects">
      <ProjectsCopy>
        <ProjectsFeatureHeader>
          <ProjectsPillLabel>Selected Projects</ProjectsPillLabel>
        </ProjectsFeatureHeader>
        <Eyebrow>
          {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </Eyebrow>
        <h2>{activeProject.title}</h2>
        {activeProject.description && (
          <Description>{activeProject.description}</Description>
        )}
        {activeProject.productFeatures && (
          <FeatureList aria-label={`${activeProject.title} highlights`}>
            {activeProject.productFeatures.slice(0, 5).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </FeatureList>
        )}
        <NavigationRow>
          <Hint>
            Click a card or use the arrows to navigate. Hover over the cards to pause.
          </Hint>
          <NavigationButtons>
            <NavigationButton
              type="button"
              onClick={showPreviousProject}
              aria-label="Show previous project"
            >
              ←
            </NavigationButton>
            <NavigationButton
              type="button"
              onClick={showNextProject}
              aria-label="Show next project"
            >
              →
            </NavigationButton>
          </NavigationButtons>
        </NavigationRow>
      </ProjectsCopy>

      <StackViewport>
        <StackScale>
          <CardSwap
            ref={cardSwapRef}
            width={500}
            height={390}
            cardDistance={28}
            verticalDistance={34}
            delay={4600}
            skewAmount={4}
            onActiveCardChange={handleActiveProjectChange}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.title} aria-label={project.title}>
                <CardHeader>
                  <CardIndex>{String(index + 1).padStart(2, "0")}</CardIndex>
                  <strong>{project.title}</strong>
                  <CardDot />
                </CardHeader>
                <CardImage>
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    style={{ objectPosition: project.imagePosition }}
                  />
                </CardImage>
                <CardFooter>
                  <span>{project.featured ? "Featured product" : "Selected project"}</span>
                  <CardLinks>
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noreferrer">
                        {project.demoLabel ?? "Live demo"} ↗
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer">
                        Code ↗
                      </a>
                    )}
                  </CardLinks>
                </CardFooter>
              </ProjectCard>
            ))}
          </CardSwap>
        </StackScale>
      </StackViewport>
    </ProjectsSection>
  );
};

const ProjectsSection = styled(FeatureCard)`
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(300px, 0.78fr) minmax(560px, 1.22fr);
  height: 650px;
  margin-bottom: 50px;
  padding: clamp(26px, 4vw, 48px);
  overflow: visible;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    grid-template-rows: 540px minmax(0, 1fr);
    height: 1050px;
    margin-bottom: 110px;
    padding: 22px;
    overflow: visible;
  }

  @media (max-width: 560px) {
    display: flex;
    height: auto;
    flex-direction: column;
    margin-bottom: 90px;
    padding: 14px 16px;
  }
`;

const ProjectsCopy = styled.div`
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-rows: auto 18px 160px 130px 115px 38px;
  align-content: center;
  min-width: 0;
  padding-right: clamp(12px, 3vw, 40px);

  h2 {
    align-self: center;
    margin: 0;
    max-width: 430px;
    max-height: 3em;
    overflow: hidden;
    color: var(--text);
    font-size: clamp(34px, 4vw, 54px);
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  @media (max-width: 980px) {
    display: block;
    padding-right: 0;
    padding-bottom: 72px;

    h2 {
      max-width: 680px;
      max-height: none;
      margin: 12px 0 18px;
      font-size: clamp(38px, 7vw, 56px);
    }
  }

  @media (max-width: 560px) {
    padding-bottom: 0;
  }
`;

const ProjectsFeatureHeader = styled(FeatureHeader)`
  margin-bottom: 28px;
`;

const ProjectsPillLabel = styled(PillLabel)`
  margin-bottom: 0;
`;

const Eyebrow = styled.span`
  align-self: end;
  color: #dfff42;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.15em;

  @media (max-width: 980px) {
    display: block;
  }
`;

const Description = styled.p`
  max-width: 470px;
  height: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;

  @media (max-width: 980px) {
    max-width: 680px;
    height: auto;
  }
`;

const FeatureList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-content: flex-start;
  max-width: 460px;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style: none;

  @media (max-width: 980px) {
    max-width: 680px;
    height: auto;
    margin-top: 20px;
    overflow: visible;
  }

  li {
    padding: 7px 10px;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
    font-size: 11px;
    font-weight: 650;
  }
`;

const Hint = styled.span`
  max-width: 245px;
  color: rgba(255, 255, 255, 0.38);
  font-size: 11px;
  line-height: 1.4;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  align-self: end;
  gap: 16px;

  @media (max-width: 980px) {
    position: absolute;
    bottom: 20px;
    left: 0;
  }

  @media (max-width: 560px) {
    position: static;
    margin-top: 28px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
`;

const NavigationButton = styled.button`
  display: grid;
  width: 38px;
  height: 38px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  font: inherit;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease,
    background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.12);
  }

  &:focus-visible {
    outline: 2px solid #8cdcff;
    outline-offset: 2px;
  }
`;

const StackViewport = styled.div`
  position: relative;
  z-index: 2;
  min-width: 0;
  min-height: 550px;
  overflow: visible;

  @media (max-width: 980px) {
    min-height: 520px;
  }

  @media (max-width: 560px) {
    height: 390px;
    min-height: 390px;
  }
`;

const StackScale = styled.div`
  position: absolute;
  right: 62px;
  bottom: 34px;
  width: 500px;
  height: 390px;

  @media (max-width: 980px) {
    right: 50%;
    bottom: 10px;
    transform: translateX(46%) scale(0.92);
    transform-origin: bottom center;
  }

  @media (max-width: 560px) {
    bottom: 20px;
    transform: translateX(46%) scale(0.64);
  }
`;

const ProjectCard = styled(Card)`
  display: grid;
  grid-template-rows: 54px minmax(0, 1fr) 62px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 22px;
  background: #111019;
  color: var(--text);
  cursor: pointer;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.48),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  &:hover img {
    transform: scale(1.035);
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(255, 255, 255, 0.035);

  strong {
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CardIndex = styled.span`
  color: rgba(255, 255, 255, 0.42);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
`;

const CardDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dfff42;
  box-shadow: 0 0 14px rgba(223, 255, 66, 0.7);
`;

const CardImage = styled.div`
  min-height: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 0 17px;
  background: #111019;

  > span {
    color: rgba(255, 255, 255, 0.45);
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
`;

const CardLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  a {
    padding: 7px 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.055);
    font-size: 11px;
    font-weight: 750;
    transition: border-color 180ms ease, background 180ms ease;
  }

  a:hover,
  a:focus-visible {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.11);
  }
`;

import styled from "@emotion/styled";
import { FeatureCard, FeatureHeader, PillLabel } from "./CommonStyles";

const AboutBody = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
`;

const GlowAccent = styled.div`
  width: 6px;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(180deg, #6b21a8, #a855f7, #d8b4fe, #ffffff);
  filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.7));
`;

const AboutCopy = styled.div`
  margin: 0 0 12px;
  color: var(--muted);
  line-height: 1.65;
  font-size: 16px;
`;

export const About = () => (
  <FeatureCard id="about">
    <FeatureHeader>
      <PillLabel>Story so far</PillLabel>
    </FeatureHeader>
    <AboutBody>
      <GlowAccent aria-hidden="true" />
      <AboutCopy>
        I grew up in Italy, left home at 17, and spent nearly seven years in
        London before trading grey skies for Barcelona. Before software, I
        worked everywhere from restaurant kitchens to John Lewis tech support.
        It taught me something I still bring to every product: pay attention,
        stay curious, and solve the problem the person in front of you actually
        has.
        <br />
        <br />
        Today I build full-stack products, moving from interfaces and APIs to
        data, infrastructure, and everything that connects them. I care about
        the details people feel-speed, clarity, motion, and thoughtful
        interactions-but just as much about the reliable engineering behind
        them. I enjoy turning rough ideas into polished software and seeing the
        whole product, not only one layer of it.
        <br />
        <br />
        I’m at my best with an idea, a rough edge, and room to figure things
        out. I enjoy collaborative teams, bring curiosity to unfamiliar
        problems, and care about shipping work that is both useful and
        memorable. Away from the screen, you’ll usually find me walking, cycling
        somewhere new, or playing the piano.
      </AboutCopy>
    </AboutBody>
  </FeatureCard>
);

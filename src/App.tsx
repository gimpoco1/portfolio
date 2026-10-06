import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { experienceStartYear } from "./content";
import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { AIWorkflow } from "./components/AIWorkflow";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Education } from "./components/Education";
import { Footer } from "./components/Footer";
import LiquidEther from "./components/LiquidEther";
import { useState, useEffect } from "react";

const globalStyles = css`
  :root {
    color-scheme: dark;
    --bg: #06030d;
    --card: rgba(14, 10, 26, 0.8);
    --stroke: rgba(255, 255, 255, 0.08);
    --text: #fdfdfd;
    --text-dark: #1d1d1d;
    --muted: #c8c3d8;
    --accent: #e4d1ff;
    --pill: rgba(255, 255, 255, 0.06);
    --shadow: 0 20px 80px rgba(0, 0, 0, 0.45);
    --radius-lg: 28px;
    --radius: 14px;
    --radius-sm: 10px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, "SF Pro Display", "SF Pro Text", "San Francisco",
      system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  html {
    scroll-behavior: smooth;
  }

  main [id],
  footer[id] {
    scroll-margin-top: 112px;
  }

  .liquid-ether-container {
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 0 32px;
  position: relative;
  overflow: visible;
`;

const Frame = styled.div`
  position: relative;
  width: min(1200px, 100%);
  padding: 28px 28px 36px;
  margin: 0 auto;
  overflow: visible;
`;

const TopBar = styled.header`
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
  position: sticky;
  top: 16px;
  z-index: 7;
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const App = () => {
  const experienceYears = new Date().getFullYear() - experienceStartYear;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Page>
      <Global styles={globalStyles} />
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -2,
          pointerEvents: "none",
        }}
      >
        <LiquidEther
          style={{ width: "100%", height: "100%" }}
          colors={["#ff4e92", "#ffb600", "#0ebeff"]}
          mouseForce={40}
          className="color-bends-overlay"
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={500}
          autoRampDuration={0.6}
        />
      </div>
      <Frame>
        <TopBar>
          <NavBar scrolled={scrolled} />
        </TopBar>
        <Content>
          <Hero experienceYears={experienceYears} />
          <About />
          <Projects />
          <AIWorkflow />
          <Skills />
          <Education />
        </Content>
      </Frame>
      <Footer />
    </Page>
  );
};

export default App;

import React from "react";
import { Element } from "react-scroll";
import Navbar from "./components/NavigationBar";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="App">
        <Navbar />
        <Element name="about">
          <About />
        </Element>
        <Element name="skills">
          <Skills />
        </Element>
        <Element name="projects">
          <Projects />
        </Element>
        <Element name="certifications">
          <Certifications />
        </Element>
        <Element name="contact">
          <Contact />
        </Element>
    </div>
  );
}

export default App;

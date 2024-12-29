import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./whatisthis.css";

const WhatIsThis = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedCode, setExpandedCode] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleToggleCode = (type) => {
    if (expandedCode === type) {
      setExpandedCode(null); // Collapse if already expanded
    } else {
      setExpandedCode(type); // Expand the selected type
    }
  };

  return (
    <div className="whatisthis-container">
      <aside className="toc">
        <h2 className="toc-title">What is this?</h2>
        <ul className="nav-links">
          <li>
            <li><a href="#section_about`">About</a></li>
            <li><a href="#section_whatdoesitdo">Functional overview</a></li>
            <li><a href="#section_howdoesthiswork">How doest this work?</a></li>


            <div className="parent-item" onClick={() => toggleSection("section_howtogetaccess")}>
              <span>Introduction</span>
              <span className={`arrow ${expandedSections["section_howtogetaccess"] ? "expanded" : ""}`}>&#9662;</span>
            </div>
            {expandedSections["section_howtogetaccess"] && (
              <ul className="sub-links">
                <li><a href="#subsection_registration">User registration</a></li>
                <li><a href="#subsection_cli">CLI tool</a></li>
              </ul>
            )}
          </li>

          <li><a href="#section_knownissues">Known issues and limitations</a></li>
          <li><a href="#section_whatsnext"></a></li>

         
          {/* <li><a href="#code">Code</a></li>
          <li><a href="#thumbnail">Thumbnail</a></li>
          <li><a href="#future_work">Future Work</a></li> */}
        </ul>
      </aside>



      <main className="main-content">
        <section className="content">
            <h2 id="section_about">About</h2>
                <p> Metriffic is designed as an automation platform that assists in software development for edge 
                    devices, such as those used in consumer and commercial robotics. It focuses on simplifying 
                    access to target platforms, running experiments, and benchmarking with prerecorded datasets, 
                    which helps optimize applications for specific hardware. The platform is particularly suitable 
                    for battery-operated devices where power efficiency, weight, and cost are crucial considerations. 
                    As a side/hobby project, most of Metriffic's functionality is already implemented, well tested, 
                    and available for beta use, providing developers with a practical tool to evaluate and enhance 
                    their software efficiently.</p>

            <h2 id="section_whatdoesitdo">What does it do?</h2>
                <p>
                    WhatIsThis is designed to simplify the process of understanding and experimenting with complex concepts.
                </p>

            <h2 id="section_howdoesthiswork">How does this work?</h2>

            <h2 id="section_howtogetaccess">How to get access and use?</h2>
                <h3 id="subsection_registration">User registration</h3>
                    <p>
                        WhatIsThis is designed to simplify the process of understanding and experimenting with complex concepts.
                    </p>

                <h3 id="subsection_cli">CLI tool</h3>
                    <p>
                        WhatIsThis is designed to simplify the process of understanding and experimenting with complex concepts.
                    </p>
                    <div className="code-section">
                        <div
                            className="clickable-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCode("shell");
                            }}>
                            {expandedCode === "shell"
                                ? "collapse building instructions"
                                : "expand building instructions"}
                        </div>
                        {expandedCode === "shell" && (
                        <SyntaxHighlighter language="bash" style={solarizedlight}>
                            {
`# install the required packages (ubuntu 22.04+)
apt update
apt install build-essential vim git cmake libboost-system-dev libboost-chrono-dev  libboost-thread-dev libboost-filesystem-dev libssh2-1-dev openssl
# clone the repo
git clone https://github.com/metriffic/metriffic-cli.git
# and build it...
cd metriffic-cli
git submodule update --init --recursive
mkdir build; cd build
cmake ..
make`}
                        </SyntaxHighlighter>
                        )}
                    </div>

            <h2 id="section_knownissues">Known issues and limitations</h2>
                <p></p>

            <h2 id="section_nextsteps">Next steps...</h2>
                <p></p>
                

{/* 
          <h3 id="goals">Goals</h3>
          <p>
            The goal is to provide a lightweight, easy-to-use, and interactive experience for users.
          </p>
          <h2 id="features">Features</h2>
          <h3 id="feature1">Feature 1</h3>
          <p>Support for interactive learning modules.</p>
          <h3 id="feature2">Feature 2</h3>
          <p>Integration with real-world datasets and examples.</p>
          <h2 id="code">Code Examples</h2>
          <div className="code-section">
            <div
              className="clickable-item"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCode("python");
              }}
            >
              {expandedCode === "python"
                ? "Collapse Python Code"
                : "Expand Python Code"}
            </div>
            {expandedCode === "python" && (
              <SyntaxHighlighter language="python" style={solarizedlight}>
                {`def hello_world():
    print("Hello, World!")`}
              </SyntaxHighlighter>
            )}
            <div
              className="clickable-item"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCode("shell");
              }}
            >
              {expandedCode === "shell"
                ? "Collapse Shell Script"
                : "Expand Shell Script"}
            </div>
            {expandedCode === "shell" && (
              <SyntaxHighlighter language="bash" style={solarizedlight}>
                {`#!/bin/bash
echo "Hello, World!"`}
              </SyntaxHighlighter>
            )}
          </div>


          <h2 id="thumbnail">Interactive Thumbnail</h2>
          <div
            className={`thumbnail-container ${
              expandedCode === "thumbnail" ? "expanded" : "collapsed"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCode("thumbnail");
            }}
          >
            <img
              src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
              alt="Example Thumbnail"
              className="thumbnail"
            />
          </div> */}



        </section>
      </main>
    </div>
  );
};

export default WhatIsThis;

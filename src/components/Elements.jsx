import React, { useState, useEffect } from "react";
import { data } from "../data";
import KeyframeSlider from "./KeyframeSlider";
import "../index.css";
import 'primeicons/primeicons.css';
        
const Elements = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [range, setRange] = useState(0);
  const [keyframesAdded, setKeyframesAdded] = useState(new Set());
  const [elementKeyframeTextareas, setElementKeyframeTextareas] = useState({});
  const [duration, setDuration] = useState(4);
  const [timingFunction, setTimingFunction] = useState("ease");
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState(1);
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("none");
  const [showAnimation, setShowAnimation] = useState(false);
  const [keyframeTextareas, setKeyframeTextareas] = useState({});

  const handleRangeChange = (event) => {
    const newValue = parseInt(event.target.value);
    setRange(newValue);

    const animationSection = document.querySelector(".animation-section");
    const keyframes0 = JSON.parse(document.getElementById("1").value);
    const keyframes100 = JSON.parse(document.getElementById("2").value);

    let interpolatedKeyframes = {};
    if (newValue <= 0) {
      interpolatedKeyframes = keyframes0;
    } else if (newValue >= 100) {
      interpolatedKeyframes = keyframes100;
    } else {
      const startKeyframes = keyframes0;
      const endKeyframes = keyframes100;
      interpolatedKeyframes = {};
      for (const property in startKeyframes) {
        const start = parseFloat(startKeyframes[property]);
        const end = parseFloat(endKeyframes[property]);
        const interpolatedValue = start + ((end - start) * (newValue - 10)) / 0;
        interpolatedKeyframes[property] = interpolatedValue.toString();
      }
    }

    applyKeyframes(animationSection, interpolatedKeyframes);
  };

  const applyKeyframes = (element, keyframes) => {
    let cssText = "";
    for (const [property, value] of Object.entries(keyframes)) {
      cssText += `${property}: ${value}; `;
    }
    element.style.cssText = cssText;
  };

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    for (const category in data) {
      for (const animation of data[category]) {
        const keyframes = generateKeyframes(animation.animations);
        styleSheet.insertRule(
          `@keyframes ${animation.name} { ${keyframes} }`,
          styleSheet.cssRules.length
        );
      }
    }
  }, []);

  const generateKeyframes = (animations) => {
    let keyframes = "";
    for (let i = 0; i <= 100; i++) {
      const interpolatedKeyframes = {};
      for (const property in animations[0]) {
        const start = parseFloat(animations[0][property]);
        const end = parseFloat(animations[1][property]);
        const interpolatedValue = start + ((end - start) * i) / 100;
        interpolatedKeyframes[property] = interpolatedValue.toString();
      }
      keyframes += `${i}% { ${Object.entries(interpolatedKeyframes)
        .map(([property, value]) => `${property}: ${value};`)
        .join(" ")} } `;
    }
    return keyframes;
  };

  const handleDurationChange = (increment) => {
    const newDuration = Math.max(duration + (increment ? 0.1 : -0.1), 0);
    setDuration(newDuration);
  };

  const setKeyframes = (animationName, animations) => {
    let keyframes = "";
    for (let i = 0; i <= 100; i++) {
      const interpolatedKeyframes = {};
      for (const property in animations[0]) {
        const start = parseFloat(animations[0][property]);
        const end = parseFloat(animations[1][property]);
        const interpolatedValue = start + ((end - start) * i) / 100;
        interpolatedKeyframes[property] = interpolatedValue.toString();
      }
      keyframes += `${i}% {`;
      keyframes += Object.entries(interpolatedKeyframes)
        .map(([property, value]) => `${property}: ${value};`)
        .join(" ");
      keyframes += "} ";
    }

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `@keyframes ${animationName} { ${keyframes} }`,
      styleSheet.cssRules.length
    );
  };

  for (const category in data) {
    for (const animation of data[category]) {
      setKeyframes(animation.name, animation.animations);
    }
  }

  const handleDelayChange = (increment) => {
    const newDelay = Math.max(delay + (increment ? 0.1 : -0.1), 0);
    setDelay(newDelay);
  };

  const handleIterationCountChange = (increment) => {
    const newCount = Math.max(iterationCount + (increment ? 1 : -1), -1);
    setIterationCount(newCount);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--translate", `${range}%`);
  }, [range]);

  useEffect(() => {
    const animationSection = document.querySelector(".animation-section");
    if (selectedElement) {
      animationSection.style.animationName = selectedElement.name;

      animationSection.style.animationDuration = `${duration}s`;
      animationSection.style.animationTimingFunction = timingFunction;
      animationSection.style.animationDelay = `${delay}s`;
      animationSection.style.animationIterationCount =
        iterationCount === -1 ? "infinite" : iterationCount.toString();
      animationSection.style.animationDirection = direction;
      animationSection.style.animationFillMode = fillMode;
    }
  }, [
    selectedElement,
    duration,
    timingFunction,
    delay,
    iterationCount,
    direction,
    fillMode,
  ]);

  const handleElementClick = (element) => {
    for (let i = 1; i < 100; i++) {
      if (!keyframesAdded.has(i)) {
        const textareaId = `textarea-${i}`;
        const existingTextarea = document.getElementById(textareaId);
        if (existingTextarea) {
          existingTextarea.parentNode.remove();
        }
      }
    }

    setSelectedElement(element);
    const animations = element.animations || [];
    document.getElementById("1").value = JSON.stringify(
      animations[0] || {},
      null,
      2
    );
    document.getElementById("2").value = JSON.stringify(
      animations[1] || {},
      null,
      2
    );

    const newKeyframesAdded = new Set();
    newKeyframesAdded.add(0);
    newKeyframesAdded.add(100);
    setKeyframesAdded(newKeyframesAdded);
  };

  const updateKeyframeTextarea = (elementName, percent, value) => {
    setElementKeyframeTextareas((prevState) => {
      const newState = {
        ...prevState,
        [elementName]: {
          ...prevState[elementName],
          [percent]: value,
        },
      };

      localStorage.setItem(
        "elementKeyframeTextareas",
        JSON.stringify(newState)
      );
      return newState;
    });
  };

  const handlePartitionClick = (percent) => {
    const textareaId = `textarea-${percent}`;
    const existingTextarea = document.getElementById(textareaId);

    if (!existingTextarea) {
      const textareaContainer = document.createElement("div");
      textareaContainer.className = "textarea-container";

      const label = document.createElement("label");
      label.htmlFor = textareaId;
      label.innerText = `${percent}%`;

      const icon = document.createElement("i");
      icon.className = "pi pi-times";
      icon.onclick = () => textareaContainer.remove();

      const textarea = document.createElement("textarea");
      textarea.id = textareaId;
      textarea.rows = 5;

      const header = document.createElement("div");
      header.className = "code-heading";
      header.appendChild(label);
      header.appendChild(icon);

      textareaContainer.appendChild(header);
      textareaContainer.appendChild(textarea);
      document.querySelector(".textareas").appendChild(textareaContainer);

    
      const elementName = selectedElement.name;
      if (
        elementKeyframeTextareas[elementName] &&
        elementKeyframeTextareas[elementName][percent]
      ) {
        textarea.value = elementKeyframeTextareas[elementName][percent];
      } else {
       
        textarea.value = "";
      }

      
      textarea.addEventListener("input", (event) => {
        const value = event.target.value;
        updateKeyframeTextarea(elementName, percent, value);
      });
    }

    const addedTextarea = document.getElementById(textareaId);
    addedTextarea.focus();
  };

  const removeKeyframeTextarea = (percent) => {
    setKeyframeTextareas((prevState) => {
      const newState = { ...prevState };
      delete newState[percent];
      return newState;
    });
  };
  useEffect(() => {
    const savedKeyframeTextareas = localStorage.getItem("keyframeTextareas");
    if (savedKeyframeTextareas) {
      setKeyframeTextareas(JSON.parse(savedKeyframeTextareas));
    }
  }, []);

  const handleRunAnimation = () => {
    const animationSection = document.querySelector(".animation-section");

    let keyframes = `@keyframes ${selectedElement.name} {`;

    const keyframes0 = JSON.parse(document.getElementById("1").value || "{}");
    const keyframes100 = JSON.parse(document.getElementById("2").value || "{}");

    keyframes += `0% { ${Object.entries(keyframes0)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ")} }`;

    keyframes += `100% { ${Object.entries(keyframes100)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ")} }`;

    for (let i = 1; i < 100; i++) {
      const textareaId = `textarea-${i}`;
      const textareaValue = document.getElementById(textareaId)?.value || "{}";
      const keyframesPercent = JSON.parse(textareaValue);
      keyframes += `${i}% { ${Object.entries(keyframesPercent)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ")} }`;
    }

    keyframes += "}";

    const styleSheet = document.styleSheets[0];
    const existingIndex = Array.from(styleSheet.cssRules).findIndex(
      (rule) => rule.name === selectedElement.name
    );

    if (existingIndex !== -1) {
      styleSheet.deleteRule(existingIndex);
    }

    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    if (selectedElement) {
      animationSection.style.animation = "none";
      setTimeout(() => {
        animationSection.style.animation = "";
        animationSection.style.animationName = selectedElement.name;
        animationSection.style.animationDuration = `${duration}s`;
        animationSection.style.animationTimingFunction = timingFunction;
        animationSection.style.animationDelay = `${delay}s`;
        animationSection.style.animationIterationCount =
          iterationCount === -1 ? "infinite" : iterationCount.toString();
        animationSection.style.animationDirection = direction;
        animationSection.style.animationFillMode = fillMode;
      }, 10);
    }
  };

  return (
    <div className="container elements">
      <div className="top-bar">
        <div className="category-buttons">
          {Object.keys(data).map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`category-button ${
                selectedCategory === category ? "selected" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="element-buttons">
          {selectedCategory &&
            data[selectedCategory].map((element, index) => (
              <button
                key={index}
                onClick={() => handleElementClick(element)}
                className={`element-button ${
                  selectedElement === element ? "selected" : ""
                }`}
              >
                {element.name}
              </button>
            ))}
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="heading">Control Keyframes Execution Flow</div>
          <div className="duration">
            <p>
              duration
              <button
                className="params fbtn"
                onClick={() => handleDurationChange(false)}
              >
                -
              </button>
              <input type="number" value={duration} readOnly />
              <button
                className="params"
                onClick={() => handleDurationChange(true)}
              >
                +
              </button>
            </p>
          </div>
          <div className="timing">
            <p>
              timing-function
              <select
                className=" fbtn"
                value={timingFunction}
                onChange={(e) => setTimingFunction(e.target.value)}
              >
                <option value="linear">linear</option>
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
              </select>
            </p>
          </div>
          <div className="delay">
            <p>
              delay
              <button
                className="params fbtn"
                onClick={() => handleDelayChange(false)}
              >
                -
              </button>
              <input type="number" value={delay} readOnly />
              <button
                className="params"
                onClick={() => handleDelayChange(true)}
              >
                +
              </button>
            </p>
          </div>
          <div className="iteration-count">
            <p>
              iteration-count
              <button
                className="params fbtn"
                onClick={() => handleIterationCountChange(false)}
              >
                -
              </button>
              <input type="number" value={iterationCount} readOnly />
              <button
                className="params"
                onClick={() => handleIterationCountChange(true)}
              >
                +
              </button>
            </p>
          </div>
          <div className="direction">
            <p>
              direction
              <select
                className=" fbtn"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="normal">normal</option>
                <option value="reverse">reverse</option>
                <option value="alternate">alternate</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </select>
            </p>
          </div>
          <div className="fill-mode">
            <p>
              fill-mode
              <select
                className=" fbtn"
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
              >
                <option value="none">none</option>
                <option value="forwards">forwards</option>
                <option value="backwards">backwards</option>
                <option value="both">both</option>
              </select>
            </p>
          </div>
        </div>

        
        <div className="right-section">
          <div className="animation-section">animation</div>
          <div className="run-btn">
            <button className="run-button" onClick={handleRunAnimation}>
              Run
            </button>
          </div>
          <div className="textareas">
            <div className="code-heading">
              <h1 className="txth1">0%</h1>
              <i className="pi pi-times"></i>
            </div>
            <textarea id="1" className="textarea" rows="5"></textarea>
            <div className="code-heading">
              <h1 className="txth1">100%</h1>
              <i className="pi pi-times"></i>
            </div>
            <textarea id="2" className="textarea" rows="5"></textarea>
          </div>
        </div>
      </div>



      <div className="range-slider-container">
        <span className="range-value">{range}</span>
        <div className="range-slider">
          <span>0%</span>
          <input
            className="range-input"
            min={0}
            max={100}
            type="range"
            value={range}
            onChange={handleRangeChange}
          />
          <span>100%</span>
        </div>
      </div>
      <KeyframeSlider
        handlePartitionClick={handlePartitionClick}
        selectedElement={selectedElement}
      />
    </div>
  );
};

export default Elements;

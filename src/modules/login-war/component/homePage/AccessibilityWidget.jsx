import React, { useEffect, useRef, useState } from "react";
import {
  FaUniversalAccess,
  FaVolumeUp,
  FaTextHeight,
  FaLink,
  FaTextWidth,
  FaEyeSlash,
  FaMousePointer,
  FaMoon,
  FaAdjust,
  FaRedo,
  FaTimes,
  FaCheckCircle
} from "react-icons/fa";
import { MdTextIncrease, MdTextDecrease } from "react-icons/md";
import "./AccessibilityWidget.css";

const STORAGE_KEY = "portal_accessibility_settings_v2";

const defaultSettings = {
  biggerText: false,
  smallText: false,
  lineHeight: false,
  highlightLinks: false,
  textSpacing: false,
  dyslexiaFriendly: false,
  hideImages: false,
  bigCursor: false,
  darkMode: false,
  invertColors: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const utteranceRef = useRef(null);

  // ----------------------------
  // Apply classes to body
  // ----------------------------
  const applySettingsToDOM = (newSettings) => {
    const body = document.body;

    body.classList.toggle("acc-bigger-text", newSettings.biggerText);
    body.classList.toggle("acc-small-text", newSettings.smallText);
    body.classList.toggle("acc-line-height", newSettings.lineHeight);
    body.classList.toggle("acc-highlight-links", newSettings.highlightLinks);
    body.classList.toggle("acc-text-spacing", newSettings.textSpacing);
    body.classList.toggle("acc-dyslexia-font", newSettings.dyslexiaFriendly);
    body.classList.toggle("acc-hide-images", newSettings.hideImages);
    body.classList.toggle("acc-big-cursor", newSettings.bigCursor);
    body.classList.toggle("acc-dark-mode", newSettings.darkMode);
    body.classList.toggle("acc-invert-colors", newSettings.invertColors);
  };

  // ----------------------------
  // Load saved settings
  // ----------------------------
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettingsToDOM(parsed);
      } catch (err) {
        console.error("Accessibility settings parse error:", err);
      }
    }
  }, []);

  // ----------------------------
  // Save settings
  // ----------------------------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettingsToDOM(settings);
  }, [settings]);

  // ----------------------------
  // Lock body scroll when panel open
  // ----------------------------


  // ----------------------------
  // Cleanup speech
  // ----------------------------
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const updated = { ...prev };

      if (key === "biggerText") {
        updated.biggerText = !prev.biggerText;
        if (!prev.biggerText) updated.smallText = false;
      } else if (key === "smallText") {
        updated.smallText = !prev.smallText;
        if (!prev.smallText) updated.biggerText = false;
      } else {
        updated[key] = !prev[key];
      }

      return updated;
    });
  };

  const handleTextToSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = document.body.innerText || "No readable content found on this page.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const resetAll = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  const options = [
    {
      key: "textToSpeech",
      label: isSpeaking ? "Stop Speech" : "Text To Speech",
      description: "Read page content aloud",
      icon: <FaVolumeUp />,
      onClick: handleTextToSpeech,
      active: isSpeaking,
    },
    {
      key: "biggerText",
      label: "Bigger Text",
      description: "Increase overall text size",
      icon: <MdTextIncrease />,
      onClick: () => toggleSetting("biggerText"),
      active: settings.biggerText,
    },
    {
      key: "smallText",
      label: "Small Text",
      description: "Reduce overall text size",
      icon: <MdTextDecrease />,
      onClick: () => toggleSetting("smallText"),
      active: settings.smallText,
    },
    {
      key: "lineHeight",
      label: "Line Height",
      description: "Improve vertical readability",
      icon: <FaTextHeight />,
      onClick: () => toggleSetting("lineHeight"),
      active: settings.lineHeight,
    },
    {
      key: "highlightLinks",
      label: "Highlight Links",
      description: "Make links stand out clearly",
      icon: <FaLink />,
      onClick: () => toggleSetting("highlightLinks"),
      active: settings.highlightLinks,
    },
    {
      key: "textSpacing",
      label: "Text Spacing",
      description: "Increase letter and word spacing",
      icon: <FaTextWidth />,
      onClick: () => toggleSetting("textSpacing"),
      active: settings.textSpacing,
    },
    {
      key: "dyslexiaFriendly",
      label: "Dyslexia Friendly",
      description: "Use a cleaner readable font style",
      icon: <span className="acc-custom-icon">Df</span>,
      onClick: () => toggleSetting("dyslexiaFriendly"),
      active: settings.dyslexiaFriendly,
    },
    {
      key: "hideImages",
      label: "Hide Images",
      description: "Hide visual media on the page",
      icon: <FaEyeSlash />,
      onClick: () => toggleSetting("hideImages"),
      active: settings.hideImages,
    },
    {
      key: "bigCursor",
      label: "Cursor",
      description: "Use a larger, easier cursor",
      icon: <FaMousePointer />,
      onClick: () => toggleSetting("bigCursor"),
      active: settings.bigCursor,
    },
    {
      key: "darkMode",
      label: "Light / Dark",
      description: "Switch to dark reading mode",
      icon: <FaMoon />,
      onClick: () => toggleSetting("darkMode"),
      active: settings.darkMode,
    },
    {
      key: "invertColors",
      label: "Invert Colors",
      description: "Invert page colors for contrast",
      icon: <FaAdjust />,
      onClick: () => toggleSetting("invertColors"),
      active: settings.invertColors,
    },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        className="accessibility-floating-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open Accessibility Options"
      >
        <FaUniversalAccess className="acc-float-icon" />
        <span>Accessibility Options</span>
      </button>

      {/* Overlay */}
      <div
        className={`accessibility-overlay ${isOpen ? "show" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Side Panel */}
      <aside className={`accessibility-panel ${isOpen ? "open" : ""}`}>
        <div className="accessibility-panel-header">
          <div className="accessibility-panel-title-wrap">
            <div className="accessibility-panel-icon">
              <FaUniversalAccess />
            </div>
            <div>
              <h3>Accessibility Options</h3>
              <p>Customize reading, visibility and navigation preferences</p>
            </div>
          </div>

          <button
            type="button"
            className="accessibility-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close Accessibility Panel"
          >
            <FaTimes />
          </button>
        </div>

        <div className="accessibility-panel-body">
          <div className="accessibility-grid">
            {options.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`accessibility-card ${item.active ? "active" : ""}`}
                onClick={item.onClick}
              >
                {item.active && (
                  <div className="accessibility-active-badge">
                    <FaCheckCircle />
                    <span>On</span>
                  </div>
                )}

                <div className="accessibility-card-icon">{item.icon}</div>
                <div className="accessibility-card-content">
                  <h4>{item.label}</h4>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="accessibility-footer">
          <button type="button" className="accessibility-reset-btn" onClick={resetAll}>
            <FaRedo />
            <span>Reset All Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AccessibilityWidget;
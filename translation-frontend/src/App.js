import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import "./App.css";
import * as Tooltip from "@radix-ui/react-tooltip";

function App() {
    const [text, setText] = useState("N’hésitez pas à taper une phrase ou à télécharger un fichier texte");
    const [translations, setTranslations] = useState({});
    const [openTooltips, setOpenTooltips] = useState({});

    // Handle word click to show tooltip and fetch translation
    const handleWordClick = async (word, index) => {
        const key = `${word}-${index}`;
        if (translations[key]) {
            setOpenTooltips({ [key]: true });
            return;
        }
    
        try {
            const res = await fetch("https://api.mymemory.translated.net/get?q=" + word + "&langpair=fr|en");
            const data = await res.json();
            const translatedText = data.responseData.translatedText;
    
            setTranslations({ ...translations, [key]: translatedText });
            setOpenTooltips({ [key]: true });
        } catch (err) {
            console.error("Translation error:", err);
            setTranslations({ ...translations, [key]: "Error" });
        }
    };

    // Handle text input from user
    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setText(e.target.result); // Update text with file content
        };
        reader.readAsText(file);
    };

    return (
        <div className="container">
            <h1>French Text Translator</h1>

            {/* Text input */}
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter your text here..."
                rows={3}
                className="text-area"
            />
            <div className='file-container'>
            {/* File upload */}
            <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="file-upload"
            />
            </div>

            <p className='details'>Click on any word below to get the French translation</p>

            {/* Tooltip Provider wrapping the text */}
            <Tooltip.Provider delayDuration={0}>
                <div className="text-box">
                    {text.split(" ").map((word, index) => {
                        const key = `${word}-${index}`; // Unique key per word occurrence

                        return (
                            <Tooltip.Root
                                key={key}
                                open={openTooltips[key] || false}
                                onOpenChange={(open) => setOpenTooltips({ ...openTooltips, [key]: open })}
                            >
                                <Tooltip.Trigger asChild>
                                    <span
                                        onClick={() => handleWordClick(word, index)}
                                        className="word"
                                    >
                                        {word}{" "}
                                    </span>
                                </Tooltip.Trigger>

                                {/* Tooltip content */}
                                <Tooltip.Content
                                    side="top"
                                    align="center"
                                    className="tooltip"
                                >
                                    {translations[key] || "Click to translate"}
                                    <Tooltip.Arrow className="TooltipArrow" />
                                </Tooltip.Content>
                            </Tooltip.Root>
                        );
                    })}
                </div>
            </Tooltip.Provider>
        </div>
    );
}

export default App;









//function App() {


 // return (
 //   <div className="App">
 //     <header className="App-header">
 //       <img src={logo} className="App-logo" alt="logo" />
 //       <p>
 //         Edit <code>src/App.js</code> and save to reload.
 //       </p>
 //       <a
 //         className="App-link"
 //         href="https://reactjs.org"
 //         target="_blank"
 //         rel="noopener noreferrer"
 //       >
 //         Learn React
 //       </a>
 //     </header>
 //   </div>
 // );
//}

//export default App;

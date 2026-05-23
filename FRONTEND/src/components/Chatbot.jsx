// import React, { useState, useRef, useEffect } from 'react';
// import './Chatbot.css';

// const Chatbot = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         { sender: 'bot', text: 'Hello! I am the AP RERA Assistant. How can I help you today?' }
//     ]);
//     const [input, setInput] = useState('');
//     const messagesEndRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const toggleChat = () => setIsOpen(!isOpen);

//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         const userMessage = input.trim();
//         setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
//         setInput('');

//         try {
//             // API call to our new backend endpoint
//             const response = await fetch('https://0jv8810n-8080.inc1.devtunnels.ms/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ message: userMessage })
//             });

//             const data = await response.json();

//             setMessages(prev => [...prev, {
//                 sender: 'bot',
//                 text: data.response || "Something went wrong."
//             }]);
//         } catch (error) {
//             setMessages(prev => [...prev, {
//                 sender: 'bot',
//                 text: "Error connecting to the server. Please try again."
//             }]);
//         }
//     };

//     return (
//         <div className="chatbot-container">
//             {isOpen ? (
//                 <div className="chatbot-window">
//                     <div className="chatbot-header">
//                         <h4>AP RERA Assistant</h4>
//                         <button onClick={toggleChat} className="close-btn">&times;</button>
//                     </div>
//                     <div className="chatbot-messages">
//                         {messages.map((msg, idx) => (
//                             <div key={idx} className={`message ${msg.sender}`}>
//                                 {msg.text}
//                             </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                     </div>
//                     <form className="chatbot-input" onSubmit={sendMessage}>
//                         <input
//                             type="text"
//                             placeholder="Type your message..."
//                             value={input}
//                             onChange={e => setInput(e.target.value)}
//                         />
//                         <button type="submit">
//                             <svg fill="currentColor" viewBox="0 0 24 24" height="20" width="20"><path fill="none" d="M0 0h24v24H0z"></path><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>
//                         </button>
//                     </form>
//                 </div>
//             ) : (
//               <div className="chatbot-trigger-wrapper" onClick={toggleChat}>
//     <img
//         src="/assets/images/chatbot-avatar.png"
//         alt="Chat Assistant"
//         className="chatbot-avatar"
//     />

//     <div className="chatbot-label">
//         Ask <span>RERA</span>
//     </div>
// </div>

//             )}
//         </div>
//     );
// };

// export default Chatbot;

import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am the AP RERA Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {

    const newState = !isOpen;

    setIsOpen(newState);

    if (newState) {

        speakText(
            "Welcome to AP RERA Assistant. How can I help you today?"
        );

    }

};
  


// ================= VOICE INPUT =================

const startListening = () => {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported in this browser"
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {

    const transcript =
        event.results[0][0].transcript;

    setInput(transcript);

    sendVoiceMessage(
        transcript
    );
};

    recognition.onend = () => {

        setIsListening(false);
    };

    recognition.onerror = () => {

        setIsListening(false);
    };

    recognitionRef.current =
        recognition;
};


// ================= SEND MESSAGE =================

    const speakText = (text) => {

    if (!window.speechSynthesis) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";

    utterance.rate = 1;

    utterance.pitch = 1;

    const voices =
        speechSynthesis.getVoices();

    const femaleVoice =
        voices.find(
            v =>
                v.lang.includes("en") &&
                v.name.toLowerCase().includes("female")
        );

    if (femaleVoice) {
        utterance.voice =
            femaleVoice;
    }

    speechSynthesis.speak(
        utterance
    );
};
const sendVoiceMessage = async (message) => {

    try {

        setMessages(prev => [
            ...prev,
            {
                sender: 'user',
                text: message
            }
        ]);

        const response = await fetch(
            'https://0jv8810n-8080.inc1.devtunnels.ms/api/chat',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message
                })
            }
        );

        const data = await response.json();

        const botReply =
            data.response ||
            "Something went wrong.";

        setMessages(prev => [
            ...prev,
            {
                sender: 'bot',
                text: botReply
            }
        ]);

        speakText(botReply);

    } catch (error) {

        const errorMessage =
            "Error connecting to server.";

        setMessages(prev => [
            ...prev,
            {
                sender: 'bot',
                text: errorMessage
            }
        ]);

        speakText(errorMessage);
    }
};

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');

        try {
            // API call to our new backend endpoint
            const response = await fetch('https://0jv8810n-8080.inc1.devtunnels.ms/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            const botReply =
    data.response ||
    "Something went wrong.";

setMessages(prev => [
    ...prev,
    {
        sender: 'bot',
        text: botReply
    }
]);

speakText(botReply);
        } catch (error) {
            const errorMessage =
    "Error connecting to the server. Please try again.";

setMessages(prev => [
    ...prev,
    {
        sender: 'bot',
        text: errorMessage
    }
]);

speakText(errorMessage);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h4>AP RERA Assistant</h4>
                        <button onClick={toggleChat} className="close-btn">&times;</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input" onSubmit={sendMessage}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button
    type="button"
    className="mic-btn"
    onClick={startListening}
>

    {isListening ? "🎙 Listening" : "🎤"}

</button>
                        <button type="submit">
                            <svg fill="currentColor" viewBox="0 0 24 24" height="20" width="20"><path fill="none" d="M0 0h24v24H0z"></path><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>
                        </button>
                    </form>
                </div>
            ) : (
            
     <div className="chatbot-trigger-wrapper" onClick={toggleChat}>
    <img
         src="/assets/images/chatbot-avatar.png"
         alt="Chat Assistant"
         className="chatbot-avatar"
     />

     <div className="chatbot-label">
         Ask <span>RERA</span>
     </div>
 </div>
)}
        </div>
    );
};

export default Chatbot;
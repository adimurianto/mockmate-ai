"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type QA = {
  question: string;
  answer: string;
};

export default function Home() {
  const [cv, setCV] = useState("");
  const [role, setRole] = useState("");

  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");

  const [feedback, setFeedback] = useState("");
  const [final, setFinal] = useState("");

  const [showExample, setShowExample] = useState(false);

  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFinal, setLoadingFinal] = useState(false);

  useEffect(() => {
    setCV(localStorage.getItem("cv") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  useEffect(() => {
    localStorage.setItem("cv", cv);
  }, [cv]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  // =========================
  // GROQ CALL
  // =========================
  const callAI = async (messages: any[]) => {
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    if (!data.text) {
      console.error(data);
      alert("AI Error");
      return "";
    }

    return data.text;
  };

  const Spinner = () => (
    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></span>
  );

  // =========================
  // GENERATE (OPTIMIZED 1 CALL)
  // =========================
  const generateInterview = async () => {
    if (!cv || !role) return alert("Fill CV & role");

    setLoadingGenerate(true);

    const text = await callAI([
      {
        role: "system",
        content: `
          You are a professional HR + Technical interviewer from Singapore.

          Candidate: Indonesian with basic English.

          Generate interview data in JSON ONLY:

          {
            "questions": string[10],
            "answers": string[10]
          }

          RULES:
          - 10 questions exactly
          - 10 answers exactly (match question index)
          - Simple English
          - 2–3 sentences per answer
          - Based on CV + role
          - No explanation
          - No markdown
        `
      },
      {
        role: "user",
        content: `
          CV:
          ${cv}

          Role:
          ${role}
        `
      }
    ]);

    try {
      const data = JSON.parse(text);

      setQuestions(data.questions);
      setAnswers(data.answers);

      setIndex(0);
      setUserAnswer("");
      setFeedback("");
      setFinal("");
    } catch (err) {
      console.error("Invalid JSON:", text);
      alert("AI returned invalid JSON");
    }

    setLoadingGenerate(false);
  };

  // =========================
  // SUBMIT ANSWER (COMPARE AI ANSWER)
  // =========================
  const submitAnswer = async () => {
    if (!userAnswer) return alert("Write answer");

    setLoadingSubmit(true);

    const text = await callAI([
      {
        role: "system",
        content: `
          You are a strict but fair Singapore HR interviewer.

          Compare user answer with expected answer.

          Give:
          - Score (1-10)
          - What is good
          - What is missing
          - Improvement tip

          Simple English. Short feedback.
        `
      },
      {
        role: "user",
        content: `
          Question: ${questions[index]}

          Expected Answer:
          ${answers[index]}

          User Answer:
          ${userAnswer}
        `
      }
    ]);

    setFeedback(text);
    setLoadingSubmit(false);
  };

  // =========================
  // NEXT QUESTION
  // =========================
  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setUserAnswer("");
      setFeedback("");
    }
  };

  // =========================
  // PREV QUESTION
  // =========================
  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setUserAnswer("");
      setFeedback("");
    }
  };

  // =========================
  // FINAL REVIEW
  // =========================
  const finalReview = async () => {
    setLoadingFinal(true);

    const text = await callAI([
      {
        role: "system",
        content: `
          You are a senior HR interviewer from Singapore tech company.

          Give FINAL FEEDBACK.

          IMPORTANT:
          - Focus only on suggestions
          - Use SIMPLE English + Indonesian
          - MUST be structured clearly

          OUTPUT FORMAT:

          ENGLISH:
          - Point 1
          - Point 2
          - Point 3

          INDONESIA:
          - Poin 1
          - Poin 2
          - Poin 3

          RULES:
          - Use bullet points only
          - No long paragraph
          - Keep it clean and easy to read
        `
      },
      {
        role: "user",
        content: JSON.stringify({ cv, role, questions, answers })
      }
    ]);

    setFinal(text);
    setLoadingFinal(false);
  };

  // =========================
  // SPEAK
  // =========================
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const maleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("daniel")
      ) || voices[1];

    utterance.voice = maleVoice;

    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 0.8;    

    window.speechSynthesis.speak(utterance);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center flex flex-col items-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          <Image
            src="/logo.png"
            alt="MockMate"
            width={60}
            height={60}
            className="mb-2"
            loading="eager"
          />
        </h1>

        {/* CV INPUT */}
        <textarea
          className="w-full h-50 p-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
          placeholder="Paste your CV..."
          value={cv}
          onChange={(e) => setCV(e.target.value)}
        />

        {/* ROLE INPUT */}
        <input
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
          placeholder="Target Role (e.g. Backend Engineer Golang)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        {/* GENERATE BUTTON */}
        <button
          onClick={generateInterview}
          disabled={loadingGenerate}
          className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition disabled:opacity-50"
        >
          {loadingGenerate ? "Generating..." : "Generate Interview"}
        </button>

        {/* QUESTION CARD */}
        {questions.length > 0 && (
          <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">

            <p className="text-xs text-zinc-400 mb-2">
              Question {index + 1} / {questions.length}
            </p>

            <p className="text-white font-medium">
              {questions[index]}
            </p>

            <button
              onClick={() => speak(questions[index])}
              className="mt-2 top-3 right-3 text-blue-400 hover:text-blue-300"
            >
              🔊
            </button>
          </div>
        )}

        {/* EXAMPLE ANSWER */}
        {questions.length > 0 && (
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-sm text-yellow-400 hover:text-yellow-300"
          >
            👀 Show Example Answer
          </button>
        )}

        {showExample && (
          <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-sm space-y-2">
            <p className="text-zinc-400 text-xs">Example Answer:</p>
            <p className="text-white">
              {answers[index]}
            </p>
            <button
              onClick={() => speak(answers[index])}
              className="mt-2 top-3 right-3 text-blue-400 hover:text-blue-300"
            >
              🔊
            </button>
          </div>
        )}

        {/* USER ANSWER */}
        {questions.length > 0 && (
          <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-sm space-y-2">
            <textarea
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Write your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />

            <button
              onClick={() => speak(userAnswer)}
              className="mt-2 top-3 right-3 text-blue-400 hover:text-blue-300"
            >
              🔊
            </button>
          </div>
        )}

        {/* ACTION BUTTONS */}
        {questions.length > 0 && (
          <div className="flex gap-2 flex-wrap">

            <button
              onClick={submitAnswer}
              disabled={loadingSubmit}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50"
            >
              {loadingSubmit ? "Checking..." : "Submit"}
            </button>

            <button
              onClick={prev}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
            >
              Prev
            </button>

            <button
              onClick={next}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
            >
              Next
            </button>

            <button
              onClick={finalReview}
              disabled={loadingFinal}
              className="flex-1 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 transition disabled:opacity-50"
            >
              {loadingFinal ? "Analyzing..." : "Final Review"}
            </button>

          </div>
        )}

        {/* FEEDBACK */}
        {feedback && (
          <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-sm whitespace-pre-line">
            {feedback}
          </div>
        )}

        {/* FINAL REVIEW */}
        {final && (
          <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-xl space-y-3">
            <h2 className="text-lg font-bold text-purple-400">
              📊 Final Interview Review
            </h2>

            {/* split ENGLISH */}
            <div>
              <h3 className="font-semibold font-bold text-purple-400">
                🇬🇧 English Feedback
              </h3>
              <div className="text-sm whitespace-pre-line text-zinc-200">
                {final.split("INDONESIA:")[0].replace("ENGLISH:", " ")}
              </div>
            </div>

            {/* split INDONESIA */}
            <div>
              <h3 className="font-semibold font-bold text-purple-400">
                🇮🇩 Feedback Indonesia
              </h3>
              <div className="text-sm whitespace-pre-line text-zinc-200">
                {final.split("INDONESIA:")[1]}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
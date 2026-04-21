import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export const useInterview = () => {
  const [cv, setCV] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState("HR Interview");
  const [format, setFormat] = useState("Singapore");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finalReview, setFinalReview] = useState("");

  const [loading, setLoading] = useState({
    generate: false,
    submit: false,
    final: false,
  });

  useEffect(() => {
    setCV(localStorage.getItem("cv") || "");
    setRole(localStorage.getItem("role") || "");
    setStage(localStorage.getItem("stage") || "HR Interview");
    setFormat(localStorage.getItem("format") || "Singapore");
  }, []);

  useEffect(() => {
    localStorage.setItem("cv", cv);
  }, [cv]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("stage", stage);
  }, [stage]);

  useEffect(() => {
    localStorage.setItem("format", format);
  }, [format]);

  const generateInterview = async () => {
    if (!cv || !role) throw new Error("Please fill CV & Role");

    setLoading((prev) => ({ ...prev, generate: true }));
    try {
      const text = await api.callAI([
        {
          role: "system",
          content: `You are a professional HR + Technical interviewer from ${format}.
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
- Based on CV + role + interview stage + ${format} culture/standard
- No explanation
- No markdown`
        },
        {
          role: "user",
          content: `CV: ${cv}\nRole: ${role}\nStage: ${stage}\nFormat: ${format}`
        }
      ]);

      const data = JSON.parse(text);
      setQuestions(data.questions);
      setAnswers(data.answers);
      setIndex(0);
      setUserAnswer("");
      setFeedback("");
      setFinalReview("");
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, generate: false }));
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer) throw new Error("Write answer first");

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const text = await api.callAI([
        {
          role: "system",
          content: `You are a strict but fair ${format} HR interviewer. Compare user answer with expected answer. 
          Give: Score (1-10), What is good, What is missing, Improvement tip. Simple English. Short feedback.`
        },
        {
          role: "user",
          content: `Question: ${questions[index]}\nExpected Answer: ${answers[index]}\nUser Answer: ${userAnswer}`
        }
      ]);
      setFeedback(text);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const generateFinalReview = async () => {
    setLoading((prev) => ({ ...prev, final: true }));
    try {
      const text = await api.callAI([
        {
          role: "system",
          content: `You are a senior HR interviewer from ${format} tech company. Give FINAL FEEDBACK.
          Focus on suggestions. Use SIMPLE English + Indonesian. Structure clearly with bullet points.
          FORMAT: ENGLISH: (points) INDONESIA: (points)`
        },
        {
          role: "user",
          content: JSON.stringify({ cv, role, stage, questions, answers })
        }
      ]);
      setFinalReview(text);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, final: false }));
    }
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setUserAnswer("");
      setFeedback("");
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setUserAnswer("");
      setFeedback("");
    }
  };

  return {
    cv, setCV,
    role, setRole,
    stage, setStage,
    format, setFormat,
    questions,
    answers,
    index,
    userAnswer, setUserAnswer,
    feedback, setFeedback,
    finalReview,
    loading,
    generateInterview,
    submitAnswer,
    generateFinalReview,
    next,
    prev
  };
};

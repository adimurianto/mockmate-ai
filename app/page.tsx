"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Input, TextArea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge, IconButton } from "@/components/ui/Badge";
import { useInterview } from "@/hooks/useInterview";
import { useTranslation } from "@/hooks/useTranslation";
import { useTTS } from "@/hooks/useTTS";
import { extractTextFromPDF } from "@/lib/pdf";

export default function Home() {
  const {
    cv, setCV,
    role, setRole,
    stage, setStage,
    format, setFormat,
    questions,
    answers,
    index,
    userAnswer, setUserAnswer,
    feedback,
    finalReview,
    loading,
    generateInterview,
    submitAnswer,
    generateFinalReview,
    next,
    prev
  } = useInterview();

  const { translate, loading: translating } = useTranslation();
  const { speak } = useTTS();

  const [showExample, setShowExample] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [activeTranslating, setActiveTranslating] = useState<string | null>(null);
  const [cvMode, setCvMode] = useState<'manual' | 'upload'>('manual');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const text = await extractTextFromPDF(file);
      setCV(text);
      setCvMode('manual'); // Switch to manual to show the extracted text
    } catch (err: any) {
      alert("Failed to parse PDF: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslate = async (text: string, id: string) => {
    setActiveTranslating(id);
    const result = await translate(text);
    setTranslations((prev) => ({ ...prev, [id]: result }));
    setActiveTranslating(null);
  };

  const handleGenerate = async () => {
    try {
      await generateInterview();
      setTranslations({});
      setShowExample(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const currentQuestion = questions[index];
  const currentExample = answers[index];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4 md:p-8 selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <Image
              src="/logo.png"
              alt="MockMate"
              width={80}
              height={80}
              className="relative drop-shadow-2xl"
              priority
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
              MockMate AI
            </h1>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              Master your next interview with personalized AI feedback and Singaporean HR insights.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Section */}
          <section className="lg:col-span-5 space-y-6">
            <Card className="h-fit">
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">📝</span>
                  Profile Setup
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setCvMode('manual')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                      cvMode === 'manual' 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Manual Text
                  </button>
                  <button
                    onClick={() => setCvMode('upload')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                      cvMode === 'upload' 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Upload PDF
                  </button>
                </div>

                {cvMode === 'manual' ? (
                  <TextArea
                    label="Curriculum Vitae"
                    placeholder="Paste your CV content here..."
                    rows={8}
                    value={cv}
                    onChange={(e) => setCV(e.target.value)}
                  />
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Upload CV (PDF)</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                      />
                      <div className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                        isUploading 
                          ? 'bg-blue-500/5 border-blue-500/30' 
                          : 'bg-zinc-800/30 border-zinc-700 group-hover:border-blue-500/50 group-hover:bg-blue-500/5'
                      }`}>
                        {isUploading ? (
                          <>
                            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            <span className="text-xs text-blue-400 font-medium">Extracting text...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">📄</span>
                            <div className="text-center">
                              <p className="text-xs font-medium text-zinc-300">Click or drag PDF to upload</p>
                              <p className="text-[10px] text-zinc-500 mt-1">PDF files only, max 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <Input
                  label="Target Role"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Select
                  label="Interview Stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  options={[
                    { label: "HR Interview (Human Resources)", value: "HR Interview" },
                    { label: "User Interview (Hiring Manager / Tech Lead)", value: "User Interview" },
                    { label: "Final Interview (Manager / Director / CEO)", value: "Final Interview" },
                    { label: "Offering / Negotiation", value: "Offering / Negotiation" },
                  ]}
                />
                <Select
                  label="Interview Standard/Culture"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  options={[
                    { label: "Singapore (SG-Style)", value: "Singapore" },
                    { label: "Malaysia (MY-Style)", value: "Malaysia" },
                    { label: "Global Standard (International)", value: "Global" },
                  ]}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  isLoading={loading.generate}
                >
                  Start Mock Interview
                </Button>
              </CardFooter>
            </Card>

            {/* Stats/Info - Premium Touch */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-1">
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Confidence</span>
                <span className="text-xl font-mono text-emerald-400">High AI</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-1">
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Format</span>
                <span className="text-xl font-mono text-purple-400">{format === 'Singapore' ? 'SG-Style' : format === 'Malaysia' ? 'MY-Style' : 'Global'}</span>
              </div>
            </div>
          </section>

          {/* Interview Section */}
          <section className="lg:col-span-7 space-y-6">
            {questions.length > 0 ? (
              <>
                {/* Question Card */}
                <Card className="border-blue-500/20 shadow-blue-500/5 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="primary">Question {index + 1} of {questions.length}</Badge>
                    <div className="flex gap-1">
                      <IconButton 
                        icon="🔊" 
                        onClick={() => speak(currentQuestion)} 
                        title="Read question"
                      />
                      <IconButton 
                        icon="🌐" 
                        onClick={() => handleTranslate(currentQuestion, `q-${index}`)} 
                        isLoading={activeTranslating === `q-${index}`}
                        title="Translate to Indonesian"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium leading-relaxed mb-4">
                    "{currentQuestion}"
                  </h3>

                  {translations[`q-${index}`] && (
                    <div className="p-3 bg-zinc-800/50 rounded-xl text-zinc-400 text-sm italic border-l-2 border-blue-500">
                      {translations[`q-${index}`]}
                    </div>
                  )}
                </Card>

                {/* Example Answer Toggler */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowExample(!showExample)}
                    className="text-xs font-medium text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-2"
                  >
                    {showExample ? "Hide Example" : "Reveal Best Practice Answer"}
                    <span>{showExample ? "↑" : "↓"}</span>
                  </button>
                </div>

                {showExample && (
                  <Card className="bg-zinc-900/30 border-dashed border-zinc-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Suggested Approach</span>
                      <div className="flex gap-1">
                        <IconButton 
                          icon="🔊" 
                          onClick={() => speak(currentExample)} 
                        />
                        <IconButton 
                          icon="🌐" 
                          onClick={() => handleTranslate(currentExample, `e-${index}`)} 
                          isLoading={activeTranslating === `e-${index}`}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {currentExample}
                    </p>
                    {translations[`e-${index}`] && (
                      <p className="mt-2 text-xs text-zinc-500 border-t border-zinc-800 pt-2 italic">
                        {translations[`e-${index}`]}
                      </p>
                    )}
                  </Card>
                )}

                {/* User Input Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <TextArea
                      placeholder="Enter your response in English..."
                      rows={5}
                      className="bg-zinc-900/80 border-2 border-zinc-800 focus:border-emerald-500/50"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <IconButton 
                        icon="🔊" 
                        onClick={() => speak(userAnswer)} 
                      />
                      <IconButton 
                        icon="🌐" 
                        onClick={() => handleTranslate(userAnswer, `u-${index}`)} 
                        isLoading={activeTranslating === `u-${index}`}
                      />
                    </div>
                  </div>

                  {translations[`u-${index}`] && (
                    <div className="text-xs text-emerald-400 italic px-1">
                      Translation: {translations[`u-${index}`]}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="secondary" onClick={prev} disabled={index === 0}>
                      Previous
                    </Button>
                    <Button variant="success" onClick={submitAnswer} isLoading={loading.submit}>
                      Analyze
                    </Button>
                    <Button variant="secondary" onClick={next} disabled={index === questions.length - 1}>
                      Next
                    </Button>
                  </div>
                </div>

                {/* Feedback Section */}
                {feedback && (
                  <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <h4 className="text-emerald-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Interviewer Feedback
                    </h4>
                    <div className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
                      {feedback}
                    </div>
                  </Card>
                )}

                {/* Final Review Trigger */}
                <div className="pt-4 border-t border-zinc-900">
                  <Button 
                    variant="outline" 
                    className="w-full py-4 border-zinc-800 hover:border-purple-500/50 hover:bg-purple-500/5 text-zinc-400 hover:text-purple-300"
                    onClick={generateFinalReview}
                    isLoading={loading.final}
                  >
                    ✨ Generate Comprehensive Performance Report
                  </Button>
                </div>

                {/* Final Review Display */}
                {finalReview && (
                  <Card className="bg-zinc-900 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">📊</div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Final Interview Assessment
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {/* English Section */}
                      <div className="space-y-3">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">English Assessment</Badge>
                        <div className="text-sm text-zinc-300 whitespace-pre-line bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                          {finalReview.split("INDONESIA:")[0].replace("ENGLISH:", "").trim()}
                        </div>
                      </div>

                      {/* Indonesia Section */}
                      <div className="space-y-3">
                        <Badge variant="outline" className="border-rose-500/30 text-rose-400">Evaluasi Indonesia</Badge>
                        <div className="text-sm text-zinc-300 whitespace-pre-line bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                          {finalReview.split("INDONESIA:")[1]?.trim()}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800 rounded-3xl opacity-50">
                <div className="text-4xl mb-4">👋</div>
                <h3 className="text-xl font-medium text-zinc-400">Ready to start?</h3>
                <p className="text-zinc-600 text-sm mt-2 max-w-[250px]">
                  Input your CV and target role on the left to generate your custom interview session.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Footer Credit */}
      <footer className="mt-12 text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
        Developed by <a href="https://adimurianto.github.io" target="_blank" rel="noopener noreferrer">Adi Murianto</a>
      </footer>
    </main>
  );
}
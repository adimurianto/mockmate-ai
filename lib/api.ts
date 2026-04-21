export const api = {
  async callAI(messages: any[]) {
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    if (!res.ok || !data.text) {
      throw new Error(data.error || "AI Error");
    }

    return data.text;
  },

  async translate(text: string) {
    if (!text) return "";
    
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|id`
    );

    const data = await res.json();
    return data.responseData.translatedText || "";
  }
};

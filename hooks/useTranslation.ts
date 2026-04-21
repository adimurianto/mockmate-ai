import { useState } from "react";
import { api } from "@/lib/api";

export const useTranslation = () => {
  const [cache, setCache] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const translate = async (text: string) => {
    if (!text) return "";
    if (cache[text]) return cache[text];

    setLoading(true);
    try {
      const result = await api.translate(text);
      setCache((prev) => ({ ...prev, [text]: result }));
      return result;
    } catch (err) {
      console.error(err);
      return "Translation failed";
    } finally {
      setLoading(false);
    }
  };

  return { translate, loading };
};

"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GreetingMessage() {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/greeting",
    onError: error => {
      console.log("Error in greeting API call:", error);
    },
  });

  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setDisplayedText("");
    complete("");
  };

  useEffect(() => {
    complete("");
  }, []);

  useEffect(() => {
    if (!isLoading && completion) {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(completion.slice(0, index));
        index++;
        if (index > completion.length) {
          clearInterval(intervalId);
          setIsGenerating(false);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [isLoading, completion]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
      className="relative mx-auto mt-12 max-w-3xl rounded-xl bg-gradient-to-r from-primary/5 via-background/80 to-primary/5 p-8 pt-1 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md dark:bg-gradient-to-r dark:from-primary/10 dark:via-background/40 dark:to-primary/10 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <div className="flex flex-nowrap items-center justify-end gap-2">
        <span className="py-1 text-xs font-bold text-foreground/70">由 Qwen生成</span>
        <Button
          onClick={handleRegenerate}
          disabled={isGenerating}
          variant="ghost"
          size="icon"
          className="z-10 transition-all duration-300 hover:bg-primary/10"
        >
          <RotateCw className={`${isGenerating ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="relative"
      >
        <p className="greeting-text whitespace-pre-line text-xl font-normal leading-relaxed tracking-wide text-foreground/90 md:text-2xl lg:text-3xl">
          {displayedText}
          <span
            className={`${cursorVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
          >
            |
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}

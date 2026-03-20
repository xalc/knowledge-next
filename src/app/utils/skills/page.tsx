"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowLeft, Bot, Loader2, Send, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const quickPrompts = [
  "帮我查看 2026 年阅读计划，并给我一个本周可执行的安排。",
  "看看我的徽章概览，告诉我目前最强的 3 个技能方向。",
  "我想改博客，先列出最近 5 篇文章让我选。",
];

const capabilityTags = ["博客更新", "阅读计划", "徽章概览", "自动追问补全信息"];

function stringifyToolResult(value: unknown) {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function SkillsAssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, append, status, error } = useChat({
    api: "/api/skills-agent",
    maxSteps: 6,
  });

  const waiting = status === "submitted" || status === "streaming";

  const canSubmit = useMemo(() => input.trim().length > 0 && !waiting, [input, waiting]);

  const submitPrompt = async (prompt: string) => {
    if (waiting) return;
    await append({ role: "user", content: prompt });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-slate-50/50 dark:to-slate-950/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,.15),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,.10),transparent_40%)]" />
      <main className="container relative z-10 mx-auto max-w-5xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              AI Skills 工作台
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">AI 助手（可直接操作站点数据）</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              你可以直接让它更新博客、查看阅读计划、分析徽章，并在信息不足时自动追问。
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/utils" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回导航
            </Link>
          </Button>
        </div>

        <Card className="mb-5 border-sky-100/80 bg-background/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="h-4 w-4" />
              可用能力
            </CardTitle>
            <CardDescription>提示词里直接说需求即可，助手会自动调用对应工具。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {capabilityTags.map(tag => (
                <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map(prompt => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="h-auto whitespace-normal text-left"
                  onClick={() => submitPrompt(prompt)}
                  disabled={waiting}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-background/90 backdrop-blur">
          <CardContent className="p-0">
            <ScrollArea className="h-[58vh] border-b px-4 py-4 sm:px-6">
              {messages.length === 0 && (
                <div className="flex h-full min-h-[240px] items-center justify-center">
                  <div className="max-w-md space-y-3 text-center">
                    <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      先试一句：`把 slug 为 2025-4-20 的博客标题改成 xxx，并加上 tags：AI,产品`
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`max-w-[92%] rounded-xl border px-4 py-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "ml-auto border-sky-300/60 bg-sky-500 text-white"
                        : "border-slate-200 bg-white/90 text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100"
                    }`}
                  >
                    <div className="mb-2 text-xs opacity-80">
                      {message.role === "user" ? "你" : "AI Skills"}
                    </div>

                    {message.content ? (
                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    ) : (
                      <div className="text-xs opacity-70">（正在调用工具）</div>
                    )}

                    {message.toolInvocations && message.toolInvocations.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.toolInvocations.map(toolInvocation => (
                          <details
                            key={toolInvocation.toolCallId}
                            className="rounded-md border px-3 py-2"
                          >
                            <summary className="cursor-pointer text-xs font-medium">
                              Tool · {toolInvocation.toolName}
                            </summary>
                            {"result" in toolInvocation && (
                              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
                                {stringifyToolResult(toolInvocation.result)}
                              </pre>
                            )}
                            {"args" in toolInvocation && (
                              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs opacity-80">
                                {stringifyToolResult(toolInvocation.args)}
                              </pre>
                            )}
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form
              className="space-y-3 p-4 sm:p-5"
              onSubmit={event => {
                event.preventDefault();
                if (!canSubmit) return;
                handleSubmit(event);
              }}
            >
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={event => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (!canSubmit) return;
                    handleSubmit();
                  }
                }}
                rows={4}
                placeholder="说出你的目标，比如：帮我看 2026 年阅读计划并给我接下来 7 天安排。"
                className="min-h-[92px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  回车发送，`Shift + Enter` 换行。博客更新需要登录权限。
                </p>
                <Button type="submit" disabled={!canSubmit} className="gap-2">
                  {waiting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  发送
                </Button>
              </div>
              {error && <p className="text-xs text-destructive">请求失败：{error.message}</p>}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

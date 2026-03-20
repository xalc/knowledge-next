"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Loader2, PlayCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ToolName =
  | "reading.overview"
  | "reading.trend"
  | "reading.books"
  | "reading.notes"
  | "reading.plan";

const DEFAULT_ARGS: Record<ToolName, Record<string, unknown>> = {
  "reading.overview": { year: new Date().getFullYear() },
  "reading.trend": { year: new Date().getFullYear(), granularity: "month", periodDays: 90 },
  "reading.books": { status: "all", sort: "recent", limit: 20 },
  "reading.notes": { limit: 10 },
  "reading.plan": { year: new Date().getFullYear(), targetHours: 300 },
};

const TOOL_OPTIONS: { value: ToolName; label: string }[] = [
  { value: "reading.overview", label: "reading.overview" },
  { value: "reading.trend", label: "reading.trend" },
  { value: "reading.books", label: "reading.books" },
  { value: "reading.notes", label: "reading.notes" },
  { value: "reading.plan", label: "reading.plan" },
];

function safeFormat(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function ReadingSkillsDebugPage() {
  const [toolName, setToolName] = useState<ToolName>("reading.overview");
  const [argsText, setArgsText] = useState(safeFormat(DEFAULT_ARGS["reading.overview"]));
  const [responseText, setResponseText] = useState("");
  const [toolList, setToolList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setArgsText(safeFormat(DEFAULT_ARGS[toolName]));
  }, [toolName]);

  const loadTools = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/skills/reading", { method: "GET" });
      const data = await response.json();
      setToolList(safeFormat(data));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载工具列表失败");
    } finally {
      setLoading(false);
    }
  };

  const runTool = async () => {
    setLoading(true);
    setError("");
    try {
      const args = JSON.parse(argsText);
      const payload = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      };
      const response = await fetch("/api/skills/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResponseText(safeFormat(data));
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "调用失败");
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = async () => {
    const curl = [
      "curl -X POST http://localhost:3000/api/skills/reading \\",
      "  -H 'Content-Type: application/json' \\",
      "  -d '{",
      '    "jsonrpc": "2.0",',
      '    "id": 1,',
      '    "method": "tools/call",',
      '    "params": {',
      `      "name": "${toolName}",`,
      `      "arguments": ${argsText.replace(/\n/g, " ")}`,
      "    }",
      "  }'",
    ].join("\n");
    await navigator.clipboard.writeText(curl);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Reading AI Skills Debug</h1>
          <p className="text-sm text-muted-foreground">
            调试 `/api/skills/reading` 的 AI native 工具调用（只读）。
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/utils" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回导航
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="h-4 w-4" />
              Tool 调用
            </CardTitle>
            <CardDescription>选择工具，编辑参数 JSON，然后执行 `tools/call`。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toolName">工具名</Label>
              <Select
                value={toolName}
                onValueChange={value => setToolName(value as ToolName)}
                disabled={loading}
              >
                <SelectTrigger id="toolName">
                  <SelectValue placeholder="选择工具" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toolArgs">参数（JSON）</Label>
              <Textarea
                id="toolArgs"
                className="min-h-[220px] font-mono text-xs"
                value={argsText}
                onChange={event => setArgsText(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={runTool} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                调用工具
              </Button>
              <Button variant="outline" onClick={copyCurl} disabled={loading} className="gap-2">
                <Copy className="h-4 w-4" />
                复制 cURL
              </Button>
              <Button variant="ghost" onClick={loadTools} disabled={loading}>
                读取 tools/list
              </Button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">响应结果</CardTitle>
            <CardDescription>保留原始 JSON，方便本地 AI 直接消费。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>tools/list</Label>
              <pre className="max-h-[180px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
                {toolList || "点击“读取 tools/list”查看工具清单"}
              </pre>
            </div>

            <div className="space-y-2">
              <Label>tools/call</Label>
              <pre className="max-h-[280px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
                {responseText || "点击“调用工具”查看结构化响应"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

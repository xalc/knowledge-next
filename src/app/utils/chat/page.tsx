"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  return (
    <div className="stretch container mx-auto flex w-full max-w-lg flex-col py-24">
      {messages.map(m => (
        <div
          key={m.id}
          className={`mb-4 whitespace-pre-wrap rounded-lg p-3 ${m.role === "user" ? "self-end bg-blue-500 text-white" : "self-start bg-gray-300 text-black"}`}
        >
          <div className="text-sm opacity-75">{m.role === "user" ? "User" : "AI"}</div>
          {m.toolInvocations ? (
            <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
          ) : (
            <p>{m.content}</p>
          )}
          <div className="text-right text-xs opacity-50">{new Date().toLocaleTimeString()}</div>
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 mb-8 flex w-full max-w-md items-center rounded border border-zinc-300 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <input
          className="flex-grow rounded border border-zinc-300 p-2 dark:border-zinc-800"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <button type="submit" className="ml-2 rounded bg-blue-500 p-2 text-white">
          Send
        </button>
      </form>
    </div>
  );
}

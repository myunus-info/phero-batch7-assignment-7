"use client";

import { useState, useRef, useEffect } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "@/providers/themeProvider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Play, RotateCcw, Send, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  initialCode?: string;
  starterCode?: Record<string, string> | null;
  language?: string;
  onCodeChange: (code: string) => void;
  onRun: (code: string, language: string) => void;
  onSubmit: (code: string, language: string) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

const SUPPORTED_LANGUAGES = [{ value: "javascript", label: "JavaScript (Node.js)" }];

export const DEFAULT_BOILERPLATES: Record<string, string> = {
  javascript: `// Write your JavaScript (Node.js) solution here
// Input is available via standard input (stdin) or as the 'input' variable
const fs = require("fs");

function solution() {
  const input = fs.readFileSync(0, "utf-8").trim();
  
  // Write your solution logic here
  
}

solution();
`,
};

export function CodeEditor({
  initialCode,
  starterCode,
  language = "javascript",
  onCodeChange,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  isSubmitted = false,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [selectedLang, setSelectedLang] = useState(language);
  const getInitialCode = () => {
    if (initialCode !== undefined && initialCode !== "") {
      return initialCode;
    }
    if (starterCode?.[language]) {
      return starterCode[language];
    }
    return DEFAULT_BOILERPLATES[language] || DEFAULT_BOILERPLATES.javascript;
  };

  const [code, setCode] = useState(getInitialCode);

  const selectedLangRef = useRef(selectedLang);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    selectedLangRef.current = selectedLang;
    onRunRef.current = onRun;
    onSubmitRef.current = onSubmit;
  }, [selectedLang, onRun, onSubmit]);

  const handleLanguageChange = (newLang: string) => {
    setSelectedLang(newLang);
    const newCode = starterCode?.[newLang] || DEFAULT_BOILERPLATES[newLang] || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleReset = () => {
    const boilerplate = starterCode?.[selectedLang] || DEFAULT_BOILERPLATES[selectedLang] || "";
    setCode(boilerplate);
    onCodeChange(boilerplate);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current(editor.getValue(), selectedLangRef.current);
    });
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Editor Toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center space-x-3">
          <div className="w-52">
            <Select
              value={selectedLang}
              onChange={e => handleLanguageChange(e.target.value)}
              className="h-8 py-1 text-xs bg-background border-border text-foreground"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value} className="bg-card text-foreground">
                  {lang.label}
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Reset to starter code"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset to Starter
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Run Code Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRun(code, selectedLang)}
            isLoading={isRunning}
            disabled={isRunning || isSubmitting}
            className="h-8 gap-1.5 text-xs font-medium border-border hover:bg-muted"
            title="Run code against test cases (Ctrl+Enter)"
          >
            <Play className="h-3.5 w-3.5 fill-current text-foreground" />
            <span>Run Code</span>
            <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono">(Ctrl+↵)</span>
          </Button>

          {/* Submit Code Button */}
          <Button
            variant={isSubmitted ? "secondary" : "emerald"}
            size="sm"
            onClick={() => onSubmit(code, selectedLang)}
            isLoading={isSubmitting}
            disabled={isSubmitted || isSubmitting || isRunning}
            className={cn(
              "h-8 gap-1.5 text-xs font-semibold",
              isSubmitted &&
                "cursor-not-allowed pointer-events-auto disabled:cursor-not-allowed disabled:pointer-events-auto opacity-70 border border-border text-muted-foreground shadow-none",
            )}
            title={
              isSubmitted ? "Code has already been submitted for this problem" : "Submit final solution for grading"
            }
          >
            {isSubmitted ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Submitted</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Submit Code</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={selectedLang}
          theme={resolvedTheme === "light" ? "vs" : "vs-dark"}
          value={code}
          onMount={handleEditorMount}
          onChange={val => {
            const nextVal = val || "";
            setCode(nextVal);
            onCodeChange(nextVal);
          }}
          loading={
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Spinner size="md" className="mr-2" /> Loading Monaco Editor...
            </div>
          }
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "Geist Mono, JetBrains Mono, Menlo, monospace",
          }}
        />
      </div>
    </div>
  );
}

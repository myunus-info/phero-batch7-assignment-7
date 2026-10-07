"use client";

import { useState, useRef, useEffect } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "@/providers/themeProvider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Play, RotateCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface CodeEditorProps {
  initialCode?: string;
  starterCode?: Record<string, string> | null;
  language?: string;
  onCodeChange: (code: string) => void;
  onSubmit: (code: string, language: string) => void;
  isSubmitting?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript (Node.js)" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python 3" },
  { value: "cpp", label: "C++ (GCC)" },
  { value: "java", label: "Java (OpenJDK)" },
];

export const DEFAULT_BOILERPLATES: Record<string, string> = {
  javascript: `// Write your solution here
function solution() {
  
}
`,
  typescript: `// Write your TypeScript solution here
function solution(): void {
  
}
`,
  python: `# Write your Python solution here
def solution():
    pass
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}
`,
  java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}
`,
};

export function CodeEditor({
  initialCode,
  starterCode,
  language = "javascript",
  onCodeChange,
  onSubmit,
  isSubmitting,
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
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    selectedLangRef.current = selectedLang;
    onSubmitRef.current = onSubmit;
  }, [selectedLang, onSubmit]);

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
      onSubmitRef.current(editor.getValue(), selectedLangRef.current);
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
          <Button
            variant="emerald"
            size="sm"
            onClick={() => onSubmit(code, selectedLang)}
            isLoading={isSubmitting}
            className="h-8 gap-1.5 text-xs font-semibold"
            title="Press Ctrl+Enter or Cmd+Enter"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run & Submit Code</span>
            <span className="hidden sm:inline text-[10px] text-emerald-200/70 font-mono">(Ctrl+↵)</span>
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

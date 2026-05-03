import { useEditor, EditorContent } from "@tiptap/react";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import { useNavigate } from "react-router";

import { Plus, ImageIcon, FileText, Sparkles } from "lucide-react";
import { useConversationStore } from "@/stores/conversation.store";
import AppRoutes from "@/routes/app-routes";

const lowlight = createLowlight(all);
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RichTextInput() {
  const navigate = useNavigate();
  const submit = useConversationStore((s) => s.submit);
  const status = useConversationStore((s) => s.status);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleSubmit = async () => {
    if (!editor || editor.isEmpty) return;
    const plainText = editor.getText();
    const contentJson = JSON.stringify(editor.getJSON());
    const questionId = await submit(plainText, contentJson);
    editor.commands.clearContent();
    navigate(AppRoutes.chat(questionId));
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
      Placeholder.configure({ placeholder: "Ask anything…" }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ],
    onUpdate: ({ editor }) => setIsEmpty(editor.isEmpty),
    editorProps: {
      attributes: {
        class:
          "rich-input outline-none min-h-[140px] max-h-[360px] overflow-y-auto px-4 py-4 text-sm text-slate-800 leading-relaxed",
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain") ?? "";
        const trimmed = text.trimStart();

        const isMarkup = trimmed.startsWith("<") && trimmed.includes(">");
        const isCode = !isMarkup && looksLikeCode(text);

        if (isMarkup || isCode) {
          const { state, dispatch } = view;
          const node = state.schema.nodes.codeBlock.create({}, state.schema.text(text));
          dispatch(state.tr.replaceSelectionWith(node));
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) return null;

  return (
    <>
      <style>{`
        .rich-input p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .rich-input p { margin: 0 0 0.25em; }
        .rich-input p:last-child { margin-bottom: 0; }
        .rich-input strong { font-weight: 600; }
        .rich-input em { font-style: italic; }
        .rich-input s { text-decoration: line-through; }
        .rich-input code {
          background: #eef2ff;
          border: 1px solid #e0e7ff;
          border-radius: 4px;
          padding: 0.1em 0.35em;
          font-size: 0.82em;
          font-family: ui-monospace, monospace;
          color: #6366f1;
        }
        .rich-input pre {
          background: #0f172a;
          border-radius: 8px;
          padding: 0.75em 1em;
          margin: 0.5em 0;
          overflow-x: auto;
        }
        .rich-input pre code {
          background: transparent;
          border: none;
          color: #e2e8f0;
          padding: 0;
          font-size: 0.82em;
          font-family: ui-monospace, monospace;
        }
        /* lowlight / highlight.js token colors (GitHub Dark palette) */
        .rich-input .hljs-comment, .rich-input .hljs-quote { color: #8b949e; font-style: italic; }
        .rich-input .hljs-keyword, .rich-input .hljs-selector-tag, .rich-input .hljs-built_in { color: #ff7b72; }
        .rich-input .hljs-string, .rich-input .hljs-attr, .rich-input .hljs-symbol, .rich-input .hljs-bullet, .rich-input .hljs-addition { color: #a5d6ff; }
        .rich-input .hljs-title, .rich-input .hljs-section, .rich-input .hljs-name { color: #d2a8ff; }
        .rich-input .hljs-variable, .rich-input .hljs-template-variable { color: #ffa657; }
        .rich-input .hljs-number, .rich-input .hljs-literal, .rich-input .hljs-type { color: #79c0ff; }
        .rich-input .hljs-tag { color: #7ee787; }
        .rich-input .hljs-attribute { color: #ffa657; }
        .rich-input .hljs-meta { color: #e3b341; }
        .rich-input .hljs-deletion { color: #ffa198; }
        .rich-input .hljs-emphasis { font-style: italic; }
        .rich-input .hljs-strong { font-weight: bold; }
        .rich-input ul { list-style: disc; padding-left: 1.4em; margin: 0.25em 0; }
        .rich-input ol { list-style: decimal; padding-left: 1.4em; margin: 0.25em 0; }
        .rich-input li { margin: 0.1em 0; }
        .rich-input blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 0.75em;
          margin: 0.25em 0;
          color: #64748b;
        }
      `}</style>

      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-slate-300 focus-within:shadow-md">
        {/* Editor area */}
        <EditorContent editor={editor} />

        {/* Bottom action bar */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          {/* + Attach */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition-colors outline-none hover:bg-slate-300 hover:text-slate-700"
                aria-label="Attach file"
              >
                <Plus className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-52 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
            >
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 outline-none focus:bg-slate-50">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-500">
                  <ImageIcon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">Upload Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 outline-none focus:bg-slate-50">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">Upload Document</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Get Solution */}
          <button
            onClick={handleSubmit}
            disabled={status === "creating" || isEmpty}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {status === "creating" ? "Submitting…" : "Get Solution"}
          </button>
        </div>
      </div>
    </>
  );
}

const CODE_PATTERNS = [
  /^import\s/,
  /^export\s/,
  /^const\s/,
  /^let\s/,
  /^var\s/,
  /^function\s/,
  /^class\s/,
  /^interface\s/,
  /^type\s/,
  /^return\s/,
  /^\/\//,
  /^\/\*/,
  /^\s*(if|else|for|while|switch)\s*[\({]/,
];

function looksLikeCode(text: string): boolean {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return false;
  const matches = lines.filter((line) => CODE_PATTERNS.some((p) => p.test(line)));
  return matches.length >= 2;
}

import { useRef, useEffect, useState, KeyboardEvent } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showFormatBar, setShowFormatBar] = useState(false);
    const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
    const [lastRange, setLastRange] = useState<Range | null>(null);

    const formatButtons = [
        { command: "bold", icon: "B", label: "Bold (Ctrl+B)" },
        { command: "italic", icon: "I", label: "Italic (Ctrl+I)" },
        { command: "underline", icon: "U", label: "Underline (Ctrl+U)" },
        { command: "strikeThrough", icon: "S", label: "Strikethrough" },
        { command: "insertUnorderedList", icon: "•", label: "Bullet List" },
        { command: "insertOrderedList", icon: "1.", label: "Numbered List" },
        { command: "blockquote", icon: "❝", label: "Blockquote" },
        { command: "insertHorizontalRule", icon: "—", label: "Insert Line" },
        { command: "createLink", icon: "🔗", label: "Add Link (Ctrl+K)" },
        { command: "removeFormat", icon: "✖", label: "Clear Formatting" },
    ];

    // Save the cursor selection
    const saveSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0);
        setLastRange(range);
        return range;
    };

    // Restore the cursor selection
    const restoreSelection = () => {
        if (lastRange) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(lastRange);
        }
    };

    const handleFormat = (command: string) => {
        restoreSelection(); // Restore cursor before applying format

        if (command === "createLink") {
            const url = prompt("Enter URL:");
            if (url) document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false);
        }

        saveSelection(); // Save cursor after formatting
        editorRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case "b":
                    e.preventDefault();
                    handleFormat("bold");
                    break;
                case "i":
                    e.preventDefault();
                    handleFormat("italic");
                    break;
                case "u":
                    e.preventDefault();
                    handleFormat("underline");
                    break;
                case "k":
                    e.preventDefault();
                    handleFormat("createLink");
                    break;
            }
        }
    };

    const handleSelection = () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            saveSelection(); // Save the selection for later use
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectionPosition({
                top: rect.top - 50,
                left: rect.left + rect.width / 2,
            });
            setShowFormatBar(true);
        } else {
            setShowFormatBar(false);
        }
    };

    useEffect(() => {
        document.addEventListener("selectionchange", handleSelection);
        return () => document.removeEventListener("selectionchange", handleSelection);
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    return (
        <div className="relative w-full p-4 border border-gray-300 rounded-lg bg-white">
            {/* Toolbar */}
            <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-100 rounded-t-lg">
                {formatButtons.map((button) => (
                    <button
                        key={button.command}
                        type="button"
                        title={button.label}
                        onClick={() => handleFormat(button.command)}
                        className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        {button.icon}
                    </button>
                ))}
            </div>

            {/* Floating Toolbar for Mobile & Desktop Selection */}
            {showFormatBar && (
                <div
                    className="fixed z-50 bg-white border border-gray-300 shadow-md rounded-md p-2 flex gap-2"
                    style={{ top: `${selectionPosition.top}px`, left: `${selectionPosition.left}px` }}
                >
                    {formatButtons.map((button) => (
                        <button
                            key={button.command}
                            type="button"
                            title={button.label}
                            onClick={() => handleFormat(button.command)}
                            className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            {button.icon}
                        </button>
                    ))}
                </div>
            )}

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="w-full min-h-[200px] p-3 text-gray-800 focus:outline-none"
                onKeyDown={handleKeyDown}
                onInput={() => onChange(editorRef.current?.innerHTML || "")}
                onClick={saveSelection} // Save cursor position on click
                onBlur={saveSelection} // Save cursor position when clicking outside
            />
        </div>
    );
}

export default RichTextEditor;

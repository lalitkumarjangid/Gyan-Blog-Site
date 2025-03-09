import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import TurndownService from "turndown";
import { RichTextEditor } from "../components/RichTextEditor";
import React from "react";

interface BlogEditorProps {
    value: string;
    onChange: (value: string) => void;
    editorType?: "markdown" | "rich-text";
}

const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
});

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange, editorType = "markdown" }) => {
    const [currentEditorType, setCurrentEditorType] = useState(editorType);
    
    const handleEditorSwitch = () => {
        if (currentEditorType === "rich-text") {
            // Convert HTML to Markdown
            const markdown = turndownService.turndown(value);
            onChange(markdown);
            setCurrentEditorType("markdown");
        } else {
            setCurrentEditorType("rich-text");
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-end mb-2">
                {/* Want to enable in Future */}
                {/* <button
                    onClick={handleEditorSwitch}
                    className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                    Switch to {currentEditorType === "markdown" ? "Rich Text" : "Markdown"} Editor
                </button> */}
            </div>

            {currentEditorType === "markdown" ? (
                <div data-color-mode="light">
                    <MDEditor
                        value={value}
                        onChange={(val) => onChange(val || "")}
                        height={500}
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]]
                        }}
                    />
                </div>
            ) : (
                <RichTextEditor 
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default BlogEditor; // Ensure default export

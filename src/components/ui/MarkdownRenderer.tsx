import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    if (!content) return null;

    // Split content by newlines
    const lines = content.split('\n');

    // Helper to parse bold text (**text**)
    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-gray-900 dark:text-gray-100">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="space-y-4 text-slate-800 dark:text-slate-200 leading-7 text-base">
            {lines.map((line, index) => {
                const trimmedLine = line.trim();

                if (!trimmedLine) return <br key={index} />;

                // H3: ### Header
                if (trimmedLine.startsWith('### ')) {
                    return (
                        <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
                            {parseBold(trimmedLine.replace('### ', ''))}
                        </h3>
                    );
                }

                // H2: ## Header
                if (trimmedLine.startsWith('## ')) {
                    return (
                        <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3 border-b pb-2">
                            {parseBold(trimmedLine.replace('## ', ''))}
                        </h2>
                    );
                }

                // Unordered List: - Item
                if (trimmedLine.startsWith('- ')) {
                    return (
                        <div key={index} className="flex gap-3 ml-4">
                            <span className="text-blue-500 mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>{parseBold(trimmedLine.replace('- ', ''))}</span>
                        </div>
                    );
                }

                // Ordered List: 1. Item
                // Simple regex check for "Number. "
                const orderedListMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
                if (orderedListMatch) {
                    return (
                        <div key={index} className="flex gap-3 ml-4">
                            <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[1.5rem]">{orderedListMatch[1]}.</span>
                            <span>{parseBold(orderedListMatch[2])}</span>
                        </div>
                    )
                }

                // Default Paragraph
                return (
                    <p key={index} className="mb-2">
                        {parseBold(trimmedLine)}
                    </p>
                );
            })}
        </div>
    );
};

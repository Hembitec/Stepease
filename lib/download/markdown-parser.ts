// =============================================================================
// Stepease - Markdown Parser for Download Generators
// Shared parsing logic for converting Markdown into structured sections
// =============================================================================

import { TextRun } from 'docx';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type SectionType = 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'table' | 'codeblock';

export interface ParsedSection {
    type: SectionType;
    content: string;
    items?: string[];
    rows?: string[][];
    isNumbered?: boolean;
}

export interface TextSegment {
    text: string;
    bold: boolean;
    italic: boolean;
    code: boolean;
}

// -----------------------------------------------------------------------------
// Markdown → Structured Sections
// -----------------------------------------------------------------------------

/**
 * Parses Markdown into structured sections for rendering.
 * Handles headings, paragraphs, lists, tables, and code blocks.
 */
export function parseMarkdownSections(markdown: string): ParsedSection[] {
    const sections: ParsedSection[] = [];
    const lines = markdown.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) {
            i++;
            continue;
        }

        // Code blocks (```...```)
        if (trimmed.startsWith('```')) {
            const codeLines: string[] = [];
            i++; // Skip opening ```
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // Skip closing ```
            sections.push({
                type: 'codeblock',
                content: codeLines.join('\n'),
            });
            continue;
        }

        // Tables (lines starting and ending with |)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const tableRows: string[][] = [];
            while (i < lines.length) {
                const tableLine = lines[i]?.trim();
                if (!tableLine?.startsWith('|') || !tableLine?.endsWith('|')) break;

                // Skip separator rows (|---|---|)
                if (!/^\|[\s\-:|]+\|$/.test(tableLine)) {
                    const cells = tableLine
                        .slice(1, -1)
                        .split('|')
                        .map(c => c.trim());
                    tableRows.push(cells);
                }
                i++;
            }
            if (tableRows.length > 0) {
                sections.push({
                    type: 'table',
                    content: '',
                    rows: tableRows,
                });
            }
            continue;
        }

        // Headers
        if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
            sections.push({ type: 'heading1', content: trimmed.slice(2) });
            i++;
            continue;
        }
        if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
            sections.push({ type: 'heading2', content: trimmed.slice(3) });
            i++;
            continue;
        }
        if (trimmed.startsWith('### ')) {
            sections.push({ type: 'heading3', content: trimmed.slice(4) });
            i++;
            continue;
        }

        // List items (collect consecutive items)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
            const isNumbered = /^\d+\.\s/.test(trimmed);
            const listItems: string[] = [];
            while (i < lines.length) {
                const listLine = lines[i]?.trim();
                if (!listLine) break;
                if (listLine.startsWith('- ') || listLine.startsWith('* ')) {
                    listItems.push(listLine.slice(2));
                } else if (/^\d+\.\s/.test(listLine)) {
                    listItems.push(listLine.replace(/^\d+\.\s/, ''));
                } else {
                    break;
                }
                i++;
            }
            sections.push({
                type: 'list',
                content: '',
                items: listItems,
                isNumbered,
            });
            continue;
        }

        // Regular paragraph
        sections.push({ type: 'paragraph', content: trimmed });
        i++;
    }

    return sections;
}

// -----------------------------------------------------------------------------
// Inline Formatting Helpers
// -----------------------------------------------------------------------------

/**
 * Strips markdown formatting (bold, italic, code) for plain text output.
 */
export function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1');
}

/**
 * Parses text with markdown formatting into typed segments.
 * Handles **bold**, *italic*, and `code`.
 */
export function parseInlineFormatting(text: string): TextSegment[] {
    const segments: TextSegment[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            segments.push({
                text: text.slice(lastIndex, match.index),
                bold: false,
                italic: false,
                code: false,
            });
        }

        const matchedText = match[0];
        if (matchedText.startsWith('**')) {
            segments.push({
                text: matchedText.slice(2, -2),
                bold: true,
                italic: false,
                code: false,
            });
        } else if (matchedText.startsWith('`')) {
            segments.push({
                text: matchedText.slice(1, -1),
                bold: false,
                italic: false,
                code: true,
            });
        } else if (matchedText.startsWith('*')) {
            segments.push({
                text: matchedText.slice(1, -1),
                bold: false,
                italic: true,
                code: false,
            });
        }

        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        segments.push({
            text: text.slice(lastIndex),
            bold: false,
            italic: false,
            code: false,
        });
    }

    return segments.length > 0 ? segments : [{ text, bold: false, italic: false, code: false }];
}

// -----------------------------------------------------------------------------
// DOCX-specific Text Runs
// -----------------------------------------------------------------------------

/**
 * Converts text with **bold**, *italic*, and `code` markers to DOCX TextRun array.
 */
export function createStyledTextRuns(text: string): TextRun[] {
    const runs: TextRun[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            runs.push(new TextRun({ text: text.slice(lastIndex, match.index) }));
        }

        const matchedText = match[0];
        if (matchedText.startsWith('**')) {
            runs.push(new TextRun({ text: matchedText.slice(2, -2), bold: true }));
        } else if (matchedText.startsWith('`')) {
            // Inline code - monospace with background
            runs.push(new TextRun({
                text: matchedText.slice(1, -1),
                font: 'Courier New',
                shading: { fill: 'F4F4F5' },
            }));
        } else if (matchedText.startsWith('*')) {
            runs.push(new TextRun({ text: matchedText.slice(1, -1), italics: true }));
        }

        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        runs.push(new TextRun({ text: text.slice(lastIndex) }));
    }

    return runs.length > 0 ? runs : [new TextRun({ text })];
}

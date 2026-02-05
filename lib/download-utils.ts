// =============================================================================
// Stepease - Download Utilities
// Functions to generate PDF, DOCX, and HTML files from Markdown content
// =============================================================================

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';

// -----------------------------------------------------------------------------
// PDF Generation - Styled Output
// -----------------------------------------------------------------------------

interface PDFSection {
    type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'table' | 'codeblock';
    content: string;
    items?: string[];
    rows?: string[][];
    isNumbered?: boolean;
}

/**
 * Parses Markdown into structured sections for PDF rendering.
 */
function parseMarkdownForPDF(markdown: string): PDFSection[] {
    const sections: PDFSection[] = [];
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

/**
 * Strips markdown formatting for plain text output.
 */
function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1');
}

interface TextSegment {
    text: string;
    bold: boolean;
    italic: boolean;
    code: boolean;
}

/**
 * Parses text with markdown formatting into segments.
 */
function parseInlineFormatting(text: string): TextSegment[] {
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

/**
 * Renders text with inline formatting (bold, italic, code) to PDF.
 * Handles automatic word wrapping withinMaxWidth.
 * Returns the final Y position after rendering.
 */
function renderFormattedText(
    pdf: jsPDF,
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    fontSize: number,
    baseColor: [number, number, number]
): number {
    const lineHeight = fontSize * 0.5; // Approximate line height in mm
    let currentX = x;
    let currentY = startY;

    // Helper to set font based on segment style
    const setSegmentFont = (segment: TextSegment) => {
        if (segment.code) {
            pdf.setFont('courier', 'normal');
            pdf.setFontSize(fontSize - 1);
        } else if (segment.bold && segment.italic) {
            pdf.setFont('helvetica', 'bolditalic');
            pdf.setFontSize(fontSize);
        } else if (segment.bold) {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(fontSize);
        } else if (segment.italic) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(fontSize);
        } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(fontSize);
        }
        pdf.setTextColor(...baseColor);
    };

    const segments = parseInlineFormatting(text);

    // We need to process word by word to handle wrapping correctly
    // while maintaining styling.

    for (const segment of segments) {
        setSegmentFont(segment);

        // Split segment into words, preserving spaces
        const words = segment.text.split(/(\s+)/);

        for (const word of words) {
            const wordWidth = pdf.getTextWidth(word);

            // Check if word fits on current line
            if (currentX + wordWidth > x + maxWidth) {
                // Determine if we need to wrap
                // If the word itself is longer than maxWidth (rare), force wrap or just print it?
                // For now, simple wrap:
                currentY += lineHeight;
                currentX = x;
            }

            // If it's a newline character (though usually handled by block parser), reset
            if (word.includes('\n')) {
                currentY += lineHeight;
                currentX = x;
                continue; // Don't print the newline char itself
            }

            pdf.text(word, currentX, currentY);
            currentX += wordWidth;
        }
    }

    // Reset font
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);

    return currentY;
}

/**
 * Generates a styled PDF from Markdown content.
 * Includes proper tables, code blocks with backgrounds, and typography.
 */
export async function generatePDF(
    markdown: string,
    filename: string,
    addWatermark: boolean = false
): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Colors
    const colors = {
        heading1: [26, 26, 26] as [number, number, number],
        heading2: [42, 42, 42] as [number, number, number],
        heading3: [58, 58, 58] as [number, number, number],
        text: [51, 51, 51] as [number, number, number],
        codeBg: [244, 244, 245] as [number, number, number],
        codeText: [31, 41, 55] as [number, number, number],
        tableHeader: [243, 244, 246] as [number, number, number],
        tableBorder: [209, 213, 219] as [number, number, number],
        link: [37, 99, 235] as [number, number, number],
    };

    let y = margin;
    const sections = parseMarkdownForPDF(markdown);

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }
    };

    for (const section of sections) {
        switch (section.type) {
            case 'heading1': {
                checkPageBreak(15);
                pdf.setFontSize(20);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(...colors.heading1);
                const text = stripMarkdown(section.content);
                // Simple wrap for headings too
                const lines = pdf.splitTextToSize(text, contentWidth);
                pdf.text(lines, margin, y);
                y += lines.length * 8 + 2;

                // Underline
                pdf.setDrawColor(229, 231, 235);
                pdf.setLineWidth(0.5);
                pdf.line(margin, y, pageWidth - margin, y);
                y += 8;
                break;
            }

            case 'heading2': {
                checkPageBreak(12);
                y += 4;
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(...colors.heading2);
                const text = stripMarkdown(section.content);
                const lines = pdf.splitTextToSize(text, contentWidth);
                pdf.text(lines, margin, y);
                y += lines.length * 7 + 2;
                break;
            }

            case 'heading3': {
                checkPageBreak(10);
                y += 2;
                pdf.setFontSize(13);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(...colors.heading3);
                const text = stripMarkdown(section.content);
                const lines = pdf.splitTextToSize(text, contentWidth);
                pdf.text(lines, margin, y);
                y += lines.length * 6 + 1;
                break;
            }

            case 'paragraph': {
                // Estimate height (rough)
                const textLength = section.content.length;
                const estLines = Math.ceil(textLength / 80);
                checkPageBreak(estLines * 5);

                y = renderFormattedText(pdf, section.content, margin, y, contentWidth, 10, colors.text);
                y += 7; // Spacing after paragraph
                break;
            }

            case 'list': {
                if (section.items) {
                    for (let idx = 0; idx < section.items.length; idx++) {
                        const item = section.items[idx];
                        const prefix = section.isNumbered ? `${idx + 1}. ` : '• ';

                        // Estimate height
                        const textLength = item.length;
                        const estLines = Math.ceil(textLength / 75);
                        checkPageBreak(estLines * 5);

                        // Render prefix
                        pdf.setFontSize(10);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(...colors.text);
                        pdf.text(prefix, margin + 3, y);

                        // Render formatted item text
                        const prefixWidth = pdf.getTextWidth(prefix);
                        const listContentWidth = contentWidth - 10 - prefixWidth;

                        const finalY = renderFormattedText(pdf, item, margin + 3 + prefixWidth, y, listContentWidth, 10, colors.text);
                        y = finalY + 6;
                    }
                    y += 2;
                }
                break;
            }

            case 'table': {
                if (section.rows && section.rows.length > 0) {
                    checkPageBreak(30);

                    const head = [section.rows[0]];
                    const body = section.rows.slice(1);

                    autoTable(pdf, {
                        startY: y,
                        head: head,
                        body: body,
                        margin: { left: margin, right: margin },
                        styles: {
                            fontSize: 9,
                            cellPadding: 3,
                            textColor: colors.text,
                            lineColor: colors.tableBorder,
                            lineWidth: 0.1,
                        },
                        headStyles: {
                            fillColor: colors.tableHeader,
                            textColor: colors.heading2,
                            fontStyle: 'bold',
                        },
                        alternateRowStyles: {
                            fillColor: [250, 250, 250],
                        },
                        tableLineColor: colors.tableBorder,
                        tableLineWidth: 0.1,
                    });

                    // Get the final Y position after the table
                    y = (pdf as any).lastAutoTable.finalY + 6;
                }
                break;
            }

            case 'codeblock': {
                pdf.setFontSize(8);
                pdf.setFont('courier', 'normal');

                // Wrap long lines in code blocks
                const maxCodeWidth = contentWidth - 8; // Account for padding
                const rawLines = section.content.split('\n');
                const wrappedLines: string[] = [];
                for (const line of rawLines) {
                    const wrapped = pdf.splitTextToSize(line || ' ', maxCodeWidth);
                    wrappedLines.push(...wrapped);
                }

                const lineHeight = 4;
                const padding = 4;
                const codeHeight = wrappedLines.length * lineHeight + padding * 2;

                checkPageBreak(codeHeight + 4);

                // Draw background rectangle
                pdf.setFillColor(...colors.codeBg);
                pdf.setDrawColor(209, 213, 219);
                pdf.roundedRect(margin, y - 2, contentWidth, codeHeight, 2, 2, 'FD');

                // Draw code text
                pdf.setTextColor(...colors.codeText);
                let codeY = y + padding;
                for (const codeLine of wrappedLines) {
                    pdf.text(codeLine, margin + padding, codeY);
                    codeY += lineHeight;
                }

                y += codeHeight + 6;
                break;
            }
        }
    }

    // Add watermark to all pages if requested (for Starter tier)
    if (addWatermark) {
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(40);
            // Much lighter gray for watermark
            pdf.setTextColor(240, 240, 240);
            pdf.setFont('helvetica', 'bold');
            // Diagonal watermark across the page
            pdf.text('STEPEASE', pageWidth / 2, pageHeight / 2, {
                align: 'center',
                angle: 45
            });
            pdf.setFontSize(12);
            pdf.text('Upgrade to Pro for clean exports', pageWidth / 2, pageHeight / 2 + 15, {
                align: 'center',
                angle: 45
            });
        }
    }

    pdf.save(`${filename}.pdf`);
}

// -----------------------------------------------------------------------------
// HTML Generation
// -----------------------------------------------------------------------------

/**
 * Generates a standalone HTML file with embedded styles.
 */
export function generateHTML(markdownContent: string, title: string): void {
    // Convert markdown to basic HTML (simple conversion for common patterns)
    let htmlBody = markdownContent
        // Code blocks
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold and Italic
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        // Line breaks and paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Wrap list items
    htmlBody = htmlBody.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      color: #333;
    }
    h1 { color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { color: #2a2a2a; margin-top: 30px; }
    h3 { color: #3a3a3a; }
    ul, ol { padding-left: 30px; }
    li { margin: 5px 0; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f5f5f5; font-weight: 600; }
    strong { font-weight: 600; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #f4f4f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
  </style>
</head>
<body>
  <p>${htmlBody}</p>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${title.replace(/\s+/g, '-').toLowerCase()}.html`);
}

// -----------------------------------------------------------------------------
// DOCX Generation - Enhanced Styling
// -----------------------------------------------------------------------------

interface DOCXSection {
    type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'table' | 'codeblock';
    content: string;
    items?: string[];
    rows?: string[][];
    isNumbered?: boolean;
}

/**
 * Parses Markdown into structured sections for DOCX rendering.
 */
function parseMarkdownForDOCX(markdown: string): DOCXSection[] {
    const sections: DOCXSection[] = [];
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

/**
 * Converts text with **bold**, *italic*, and `code` markers to TextRun array.
 */
function createStyledTextRuns(text: string): TextRun[] {
    const runs: TextRun[] = [];
    // Match bold, italic, and inline code
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

/**
 * Generates a styled DOCX file from Markdown content.
 * Includes proper code blocks, tables, and typography.
 */
export async function generateDOCX(
    markdown: string,
    filename: string
): Promise<void> {
    const sections = parseMarkdownForDOCX(markdown);
    const children: (Paragraph | Table)[] = [];

    for (const section of sections) {
        switch (section.type) {
            case 'heading1':
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: section.content.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1'),
                                bold: true,
                                size: 36, // 18pt
                                color: '1A1A1A',
                            }),
                        ],
                        spacing: { before: 400, after: 200 },
                        border: {
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E5E7EB' },
                        },
                    })
                );
                break;

            case 'heading2':
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: section.content.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1'),
                                bold: true,
                                size: 28, // 14pt
                                color: '2A2A2A',
                            }),
                        ],
                        spacing: { before: 300, after: 150 },
                    })
                );
                break;

            case 'heading3':
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: section.content.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1'),
                                bold: true,
                                size: 24, // 12pt
                                color: '3A3A3A',
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    })
                );
                break;

            case 'paragraph':
                children.push(
                    new Paragraph({
                        children: createStyledTextRuns(section.content),
                        spacing: { before: 100, after: 100 },
                    })
                );
                break;

            case 'list':
                if (section.items) {
                    for (let idx = 0; idx < section.items.length; idx++) {
                        const item = section.items[idx];
                        if (section.isNumbered) {
                            children.push(
                                new Paragraph({
                                    children: createStyledTextRuns(item),
                                    numbering: { reference: 'default-numbering', level: 0 },
                                    spacing: { before: 60, after: 60 },
                                })
                            );
                        } else {
                            children.push(
                                new Paragraph({
                                    children: createStyledTextRuns(item),
                                    bullet: { level: 0 },
                                    spacing: { before: 60, after: 60 },
                                })
                            );
                        }
                    }
                }
                break;

            case 'table':
                if (section.rows && section.rows.length > 0) {
                    const tableRows: TableRow[] = section.rows.map((row, rowIndex) => {
                        const isHeader = rowIndex === 0;
                        const cells = row.map(
                            (cellText) =>
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: isHeader
                                                ? [new TextRun({ text: cellText, bold: true })]
                                                : createStyledTextRuns(cellText),
                                            alignment: AlignmentType.LEFT,
                                        }),
                                    ],
                                    shading: isHeader ? { fill: 'F3F4F6' } : { fill: 'FFFFFF' },
                                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                                    borders: {
                                        top: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
                                        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
                                        left: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
                                        right: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
                                    },
                                })
                        );
                        return new TableRow({ children: cells });
                    });

                    children.push(
                        new Table({
                            rows: tableRows,
                            width: { size: 100, type: WidthType.PERCENTAGE },
                        })
                    );
                    // Add spacing after table
                    children.push(new Paragraph({ text: '', spacing: { before: 100, after: 100 } }));
                }
                break;

            case 'codeblock':
                // Create a shaded paragraph for code blocks
                const codeLines = section.content.split('\n');
                for (let lineIdx = 0; lineIdx < codeLines.length; lineIdx++) {
                    const codeLine = codeLines[lineIdx];
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: codeLine || ' ', // Use space for empty lines
                                    font: 'Courier New',
                                    size: 18, // 9pt
                                    color: '1F2937',
                                }),
                            ],
                            shading: { fill: 'F4F4F5' },
                            spacing: {
                                before: lineIdx === 0 ? 100 : 0,
                                after: lineIdx === codeLines.length - 1 ? 100 : 0,
                                line: 276, // 1.15 line spacing
                            },
                            indent: { left: 200, right: 200 },
                        })
                    );
                }
                break;
        }
    }

    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: 'default-numbering',
                    levels: [
                        {
                            level: 0,
                            format: 'decimal',
                            text: '%1.',
                            alignment: AlignmentType.LEFT,
                        },
                    ],
                },
            ],
        },
        sections: [
            {
                children,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename.replace(/\s+/g, '-').toLowerCase()}.docx`);
}

// -----------------------------------------------------------------------------
// Markdown Download (simple blob)
// -----------------------------------------------------------------------------

export function generateMarkdown(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${filename.replace(/\s+/g, '-').toLowerCase()}.md`);
}

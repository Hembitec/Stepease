// =============================================================================
// Stepease - PDF Generator
// Generates styled PDF documents from Markdown content using jsPDF
// =============================================================================

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    parseMarkdownSections,
    parseInlineFormatting,
    stripMarkdown,
    type TextSegment,
} from './markdown-parser';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
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

// -----------------------------------------------------------------------------
// Text Rendering Helpers
// -----------------------------------------------------------------------------

/**
 * Renders text with inline formatting (bold, italic, code) to PDF.
 * Handles automatic word wrapping within maxWidth.
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
    const lineHeight = fontSize * 0.5;
    let currentX = x;
    let currentY = startY;

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

    for (const segment of segments) {
        setSegmentFont(segment);
        const words = segment.text.split(/(\s+)/);

        for (const word of words) {
            const wordWidth = pdf.getTextWidth(word);

            if (currentX + wordWidth > x + maxWidth) {
                currentY += lineHeight;
                currentX = x;
            }

            if (word.includes('\n')) {
                currentY += lineHeight;
                currentX = x;
                continue;
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

// -----------------------------------------------------------------------------
// Watermark
// -----------------------------------------------------------------------------

/**
 * Applies a very subtle watermark on the first page only.
 * Uses an extremely transparent color so it never obscures content.
 * Includes a small footer upsell line.
 */
function applyWatermark(pdf: jsPDF): void {
    // Only apply to the first page
    pdf.setPage(1);

    // --- Tiled watermark pattern (very transparent) ---
    const tileSpacingX = 70;
    const tileSpacingY = 50;

    pdf.setFontSize(22);
    pdf.setTextColor(242, 242, 242); // Extremely faint — won't obscure content
    pdf.setFont('helvetica', 'bold');

    const cols = Math.ceil(PAGE_WIDTH / tileSpacingX) + 2;
    const rows = Math.ceil(PAGE_HEIGHT / tileSpacingY) + 2;

    for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
            const offsetX = (row % 2) * (tileSpacingX / 2);
            const px = col * tileSpacingX + offsetX;
            const py = row * tileSpacingY;
            pdf.text('STEPEASE', px, py, { angle: -35 });
        }
    }

    // --- Subtle footer upsell ---
    pdf.setFontSize(7);
    pdf.setTextColor(195, 195, 195);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
        'Generated with StepEase \u00B7 Upgrade to Pro for clean exports \u00B7 stepease.pro',
        PAGE_WIDTH / 2,
        PAGE_HEIGHT - 8,
        { align: 'center' }
    );
}

// -----------------------------------------------------------------------------
// Section Renderers
// -----------------------------------------------------------------------------

/**
 * Renders a heading1 section and returns updated Y position.
 */
function renderHeading1(
    pdf: jsPDF,
    content: string,
    y: number,
    checkPageBreak: (h: number) => void
): number {
    checkPageBreak(15);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.heading1);
    const text = stripMarkdown(content);
    const lines = pdf.splitTextToSize(text, CONTENT_WIDTH);
    pdf.text(lines, MARGIN, y);
    y += lines.length * 8 + 2;

    // Underline
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 8;
    return y;
}

/**
 * Renders a heading2 section and returns updated Y position.
 */
function renderHeading2(
    pdf: jsPDF,
    content: string,
    y: number,
    checkPageBreak: (h: number) => void
): number {
    checkPageBreak(12);
    y += 4;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.heading2);
    const text = stripMarkdown(content);
    const lines = pdf.splitTextToSize(text, CONTENT_WIDTH);
    pdf.text(lines, MARGIN, y);
    y += lines.length * 7 + 2;
    return y;
}

/**
 * Renders a heading3 section and returns updated Y position.
 */
function renderHeading3(
    pdf: jsPDF,
    content: string,
    y: number,
    checkPageBreak: (h: number) => void
): number {
    checkPageBreak(10);
    y += 2;
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.heading3);
    const text = stripMarkdown(content);
    const lines = pdf.splitTextToSize(text, CONTENT_WIDTH);
    pdf.text(lines, MARGIN, y);
    y += lines.length * 6 + 1;
    return y;
}

/**
 * Renders a paragraph section and returns updated Y position.
 */
function renderParagraph(
    pdf: jsPDF,
    content: string,
    y: number,
    checkPageBreak: (h: number) => void
): number {
    const estLines = Math.ceil(content.length / 80);
    checkPageBreak(estLines * 5);
    y = renderFormattedText(pdf, content, MARGIN, y, CONTENT_WIDTH, 10, COLORS.text);
    y += 7;
    return y;
}

/**
 * Renders a list section and returns updated Y position.
 */
function renderList(
    pdf: jsPDF,
    items: string[],
    isNumbered: boolean,
    y: number,
    checkPageBreak: (h: number) => void
): number {
    for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        const prefix = isNumbered ? `${idx + 1}. ` : '• ';

        const estLines = Math.ceil(item.length / 75);
        checkPageBreak(estLines * 5);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...COLORS.text);
        pdf.text(prefix, MARGIN + 3, y);

        const prefixWidth = pdf.getTextWidth(prefix);
        const listContentWidth = CONTENT_WIDTH - 10 - prefixWidth;

        const finalY = renderFormattedText(pdf, item, MARGIN + 3 + prefixWidth, y, listContentWidth, 10, COLORS.text);
        y = finalY + 6;
    }
    y += 2;
    return y;
}

/**
 * Renders a table section and returns updated Y position.
 */
function renderTable(
    pdf: jsPDF,
    rows: string[][],
    y: number,
    checkPageBreak: (h: number) => void
): number {
    checkPageBreak(30);

    const head = [rows[0]];
    const body = rows.slice(1);

    autoTable(pdf, {
        startY: y,
        head: head,
        body: body,
        margin: { left: MARGIN, right: MARGIN },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            textColor: COLORS.text,
            lineColor: COLORS.tableBorder,
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: COLORS.tableHeader,
            textColor: COLORS.heading2,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        tableLineColor: COLORS.tableBorder,
        tableLineWidth: 0.1,
    });

    y = (pdf as any).lastAutoTable.finalY + 6;
    return y;
}

/**
 * Renders a code block section and returns updated Y position.
 */
function renderCodeBlock(
    pdf: jsPDF,
    content: string,
    y: number,
    checkPageBreak: (h: number) => void
): number {
    pdf.setFontSize(8);
    pdf.setFont('courier', 'normal');

    const maxCodeWidth = CONTENT_WIDTH - 8;
    const rawLines = content.split('\n');
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
    pdf.setFillColor(...COLORS.codeBg);
    pdf.setDrawColor(209, 213, 219);
    pdf.roundedRect(MARGIN, y - 2, CONTENT_WIDTH, codeHeight, 2, 2, 'FD');

    // Draw code text
    pdf.setTextColor(...COLORS.codeText);
    let codeY = y + padding;
    for (const codeLine of wrappedLines) {
        pdf.text(codeLine, MARGIN + padding, codeY);
        codeY += lineHeight;
    }

    y += codeHeight + 6;
    return y;
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Generates a styled PDF from Markdown content.
 * Includes proper tables, code blocks with backgrounds, and typography.
 * Optionally applies a professional tiled watermark (for Starter tier).
 */
export async function generatePDF(
    markdown: string,
    filename: string,
    addWatermark: boolean = false
): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = MARGIN;
    const sections = parseMarkdownSections(markdown);

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > PAGE_HEIGHT - MARGIN) {
            pdf.addPage();
            y = MARGIN;
        }
    };

    for (const section of sections) {
        switch (section.type) {
            case 'heading1':
                y = renderHeading1(pdf, section.content, y, checkPageBreak);
                break;
            case 'heading2':
                y = renderHeading2(pdf, section.content, y, checkPageBreak);
                break;
            case 'heading3':
                y = renderHeading3(pdf, section.content, y, checkPageBreak);
                break;
            case 'paragraph':
                y = renderParagraph(pdf, section.content, y, checkPageBreak);
                break;
            case 'list':
                if (section.items) {
                    y = renderList(pdf, section.items, !!section.isNumbered, y, checkPageBreak);
                }
                break;
            case 'table':
                if (section.rows && section.rows.length > 0) {
                    y = renderTable(pdf, section.rows, y, checkPageBreak);
                }
                break;
            case 'codeblock':
                y = renderCodeBlock(pdf, section.content, y, checkPageBreak);
                break;
        }
    }

    // Apply watermark after all content is rendered (Starter tier)
    if (addWatermark) {
        applyWatermark(pdf);
    }

    pdf.save(`${filename}.pdf`);
}

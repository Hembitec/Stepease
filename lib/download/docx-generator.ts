// =============================================================================
// Stepease - DOCX Generator
// Generates styled Word documents from Markdown content
// =============================================================================

import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import { parseMarkdownSections, createStyledTextRuns } from './markdown-parser';

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Generates a styled DOCX file from Markdown content.
 * Includes proper code blocks, tables, and typography.
 */
export async function generateDOCX(
    markdown: string,
    filename: string
): Promise<void> {
    const sections = parseMarkdownSections(markdown);
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
                    for (const item of section.items) {
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

            case 'codeblock': {
                const codeLines = section.content.split('\n');
                for (let lineIdx = 0; lineIdx < codeLines.length; lineIdx++) {
                    const codeLine = codeLines[lineIdx];
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: codeLine || ' ',
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

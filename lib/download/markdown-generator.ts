// =============================================================================
// Stepease - Markdown Download
// Generates a downloadable .md file from content
// =============================================================================

import { saveAs } from 'file-saver';

/**
 * Downloads content as a Markdown (.md) file.
 */
export function generateMarkdown(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${filename.replace(/\s+/g, '-').toLowerCase()}.md`);
}

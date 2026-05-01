# AI AGENT PROMPT: FILE HANDLING & EXPORT SYSTEM

## YOUR TASK

I need you to implement the complete file handling and export system for the SOP Builder application. This includes:
1. Uploading and parsing existing SOPs (PDF, Word, Markdown)
2. Extracting text and structure from uploaded documents
3. Analyzing uploaded SOPs for quality and completeness
4. Generating downloadable files in multiple formats (Markdown, PDF, Word, HTML)
5. Handling the copy-to-clipboard functionality

---

## TECHNICAL STACK FOR FILE HANDLING

**Libraries You Must Use:**

1. **For Reading Uploaded Files:**
   - `window.fs.readFile` - Already available in the artifact environment
   - `FileReader API` - For browser-based file reading
   - `Papaparse` - NOT NEEDED (only for CSVs)

2. **For PDF Processing:**
   - Use `web_fetch` to load PDF.js library if needed
   - Or use the file as base64 and send to Claude API to extract text
   - Claude API accepts PDFs directly via base64 encoding

3. **For Word Documents (.docx):**
   - Use `mammoth` library (already available in artifact environment)
   - Converts .docx to HTML or plain text
   - Import: `import * as mammoth from 'mammoth'`

4. **For Markdown Files:**
   - Simple text parsing (no library needed)
   - Already in text format

5. **For Generating Downloads:**
   - `Blob` API for creating downloadable files
   - `URL.createObjectURL()` for download links
   - `document.createElement('a')` for triggering downloads

---

## PART 1: UPLOADING & PARSING EXISTING SOPs

### File Upload Implementation

Create a robust file upload component that handles:

```jsx
// FileUploader Component Structure

const FileUploader = ({ onFileProcessed }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Supported file types
  const SUPPORTED_TYPES = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/markdown': '.md',
    'text/plain': '.txt'
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = async (file) => {
    // Validation
    if (!SUPPORTED_TYPES[file.type]) {
      setError('Unsupported file type. Please upload PDF, Word, or Markdown files.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Process based on file type
      let extractedText = '';
      let metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      };

      if (file.type === 'application/pdf') {
        extractedText = await processPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await processWordDoc(file);
      } else if (file.type === 'text/markdown' || file.type === 'text/plain') {
        extractedText = await processTextFile(file);
      }

      // Calculate statistics
      const stats = calculateStats(extractedText);

      // Callback with processed data
      onFileProcessed({
        text: extractedText,
        metadata,
        stats
      });

    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Processing your file...</p>
        </div>
      ) : (
        <>
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Drag & Drop Your SOP Here</p>
          <p className="text-gray-600 mb-4">or</p>
          <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            <span>Browse Files</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,.md,.txt"
              onChange={handleChange}
            />
          </label>
          <p className="text-sm text-gray-500 mt-4">
            Supported: PDF, Word (.docx), Markdown (.md) • Max 10MB
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

### Processing Different File Types

#### 1. Processing PDF Files

```javascript
const processPDF = async (file) => {
  // Method 1: Send to Claude API for extraction (RECOMMENDED)
  // This is the most reliable method as Claude can understand PDF structure
  
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Extract base64 data (remove data:application/pdf;base64, prefix)
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read PDF'));
    reader.readAsDataURL(file);
  });

  // Send to Claude API to extract text
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64Data
              }
            },
            {
              type: "text",
              text: `Please extract all text from this PDF document. The document is an SOP (Standard Operating Procedure). 

Extract the content preserving:
- Document structure (headings, sections)
- Numbered/bulleted lists
- Tables (convert to markdown table format)
- Any special formatting that indicates hierarchy

Return ONLY the extracted text with basic markdown formatting. Do not summarize or analyze, just extract.`
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  
  if (data.content && data.content[0]) {
    return data.content[0].text;
  } else {
    throw new Error('Failed to extract text from PDF');
  }
};
```

#### 2. Processing Word Documents (.docx)

```javascript
const processWordDoc = async (file) => {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read Word document'));
      reader.readAsArrayBuffer(file);
    });

    // Use mammoth to convert to markdown-like text
    const result = await mammoth.convertToMarkdown({ arrayBuffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }

    return result.value; // Extracted markdown text
    
  } catch (error) {
    throw new Error(`Failed to process Word document: ${error.message}`);
  }
};
```

#### 3. Processing Text/Markdown Files

```javascript
const processTextFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};
```

### Calculating Document Statistics

```javascript
const calculateStats = (text) => {
  // Word count
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Character count
  const charCount = text.length;

  // Estimate reading time (average 200 words per minute)
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Count steps (look for numbered items or "Step" occurrences)
  const stepMatches = text.match(/(\d+\.|Step \d+|^\d+\s)/gm) || [];
  const stepCount = stepMatches.length;

  // Count sections (look for headings)
  const sectionMatches = text.match(/^#{1,3}\s+.+$/gm) || [];
  const sectionCount = sectionMatches.length;

  // Detect if it has tables
  const hasTables = /\|(.+)\|/.test(text);

  // Detect if it has lists
  const hasLists = /^[\-\*\+]\s+/gm.test(text) || /^\d+\.\s+/gm.test(text);

  return {
    wordCount,
    charCount,
    readingTimeMinutes,
    stepCount,
    sectionCount,
    hasTables,
    hasLists
  };
};
```

---

## PART 2: ANALYZING UPLOADED SOPs

### SOP Structure Analysis

After extracting text, analyze the SOP's structure and quality:

```javascript
const analyzeSOPStructure = (text) => {
  // Essential sections to check for
  const essentialSections = {
    purpose: {
      patterns: [/purpose/i, /objective/i, /intent/i],
      found: false,
      quality: null
    },
    scope: {
      patterns: [/scope/i, /applicability/i, /applies to/i],
      found: false,
      quality: null
    },
    roles: {
      patterns: [/roles/i, /responsibilities/i, /responsible/i],
      found: false,
      quality: null
    },
    procedure: {
      patterns: [/procedure/i, /process/i, /steps/i, /instructions/i],
      found: false,
      quality: null
    },
    definitions: {
      patterns: [/definitions/i, /glossary/i, /terminology/i],
      found: false,
      quality: null
    },
    references: {
      patterns: [/references/i, /related documents/i],
      found: false,
      quality: null
    },
    troubleshooting: {
      patterns: [/troubleshooting/i, /common issues/i, /errors/i],
      found: false,
      quality: null
    },
    quality: {
      patterns: [/quality/i, /success criteria/i, /verification/i],
      found: false,
      quality: null
    },
    revision: {
      patterns: [/revision/i, /version history/i, /change log/i],
      found: false,
      quality: null
    }
  };

  // Check for each section
  Object.keys(essentialSections).forEach(section => {
    const patterns = essentialSections[section].patterns;
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        essentialSections[section].found = true;
        
        // Extract section content for quality check
        const sectionContent = extractSectionContent(text, pattern);
        essentialSections[section].quality = assessSectionQuality(sectionContent);
        break;
      }
    }
  });

  // Calculate overall scores
  const foundCount = Object.values(essentialSections).filter(s => s.found).length;
  const totalSections = Object.keys(essentialSections).length;
  const completenessScore = Math.round((foundCount / totalSections) * 100);

  // Assess content quality
  const qualityMetrics = assessContentQuality(text);

  return {
    sections: essentialSections,
    completenessScore,
    foundCount,
    totalSections,
    qualityMetrics,
    strengths: identifyStrengths(essentialSections, qualityMetrics),
    improvements: identifyImprovements(essentialSections, qualityMetrics)
  };
};

const extractSectionContent = (text, pattern) => {
  // Find section and extract content until next section or 300 chars
  const match = text.match(new RegExp(`${pattern.source}[\\s\\S]{0,300}`, 'i'));
  return match ? match[0] : '';
};

const assessSectionQuality = (content) => {
  if (!content) return 'missing';
  
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 10) return 'too-brief';
  if (wordCount > 10 && wordCount < 50) return 'adequate';
  return 'detailed';
};

const assessContentQuality = (text) => {
  // Check for active vs passive voice (simplified)
  const passiveIndicators = text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || [];
  const passiveCount = passiveIndicators.length;
  
  // Check for vague terms
  const vagueTerms = text.match(/\b(periodic|typical|general|usually|sometimes|often|regularly)\b/gi) || [];
  const vagueCount = vagueTerms.length;

  // Check for numbered steps
  const numberedSteps = text.match(/^\d+\.|^Step \d+/gm) || [];
  const hasNumberedSteps = numberedSteps.length > 0;

  // Check readability (simplified Flesch score approximation)
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const avgWordsPerSentence = words / sentences;
  const readabilityScore = avgWordsPerSentence < 20 ? 'good' : avgWordsPerSentence < 30 ? 'moderate' : 'difficult';

  return {
    passiveVoiceCount: passiveCount,
    vagueTermCount: vagueCount,
    hasNumberedSteps,
    readabilityScore,
    avgWordsPerSentence: Math.round(avgWordsPerSentence)
  };
};

const identifyStrengths = (sections, qualityMetrics) => {
  const strengths = [];

  // Check what's present and good quality
  if (sections.purpose.found && sections.purpose.quality !== 'too-brief') {
    strengths.push('Has clear purpose statement');
  }
  if (sections.procedure.found) {
    strengths.push('Contains step-by-step procedures');
  }
  if (sections.scope.found) {
    strengths.push('Defined scope section');
  }
  if (qualityMetrics.hasNumberedSteps) {
    strengths.push('Uses numbered steps for clarity');
  }
  if (qualityMetrics.readabilityScore === 'good') {
    strengths.push('Good readability (clear, concise sentences)');
  }
  if (sections.revision.found) {
    strengths.push('Includes revision history');
  }

  return strengths.length > 0 ? strengths : ['Document contains basic SOP structure'];
};

const identifyImprovements = (sections, qualityMetrics) => {
  const improvements = [];

  // Check what's missing or poor quality
  if (!sections.troubleshooting.found) {
    improvements.push({ type: 'missing', text: 'Missing troubleshooting section' });
  }
  if (!sections.roles.found || sections.roles.quality === 'too-brief') {
    improvements.push({ type: 'warning', text: 'Roles and responsibilities not clearly defined' });
  }
  if (!sections.quality.found) {
    improvements.push({ type: 'warning', text: 'No quality check or success criteria' });
  }
  if (!sections.definitions.found) {
    improvements.push({ type: 'missing', text: 'No glossary/definitions section' });
  }
  if (qualityMetrics.passiveVoiceCount > 10) {
    improvements.push({ type: 'warning', text: `High use of passive voice (${qualityMetrics.passiveVoiceCount} instances) - consider using active voice` });
  }
  if (qualityMetrics.vagueTermCount > 5) {
    improvements.push({ type: 'warning', text: `Contains vague terms (${qualityMetrics.vagueTermCount} instances like "periodic", "typical") - be more specific` });
  }
  if (!qualityMetrics.hasNumberedSteps) {
    improvements.push({ type: 'warning', text: 'Steps are not clearly numbered' });
  }
  if (qualityMetrics.readabilityScore === 'difficult') {
    improvements.push({ type: 'warning', text: 'Readability could be improved - sentences are too long on average' });
  }

  return improvements;
};
```

### Display Analysis Results Component

```jsx
const AnalysisResults = ({ analysis, fileName, onContinue, onViewOriginal }) => {
  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">File Uploaded Successfully</h3>
            <p className="text-sm text-green-700 mt-1">{fileName}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{analysis.stats.wordCount}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{analysis.stats.stepCount}</div>
          <div className="text-sm text-gray-600">Steps Found</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{analysis.stats.sectionCount}</div>
          <div className="text-sm text-gray-600">Sections</div>
        </div>
      </div>

      {/* Analysis Card */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📊 Structure Analysis</h3>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">{analysis.completenessScore}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">✅ Strengths Found:</h4>
            <ul className="space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {analysis.improvements.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📈 Areas for Improvement:</h4>
            <ul className="space-y-1">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className={`mr-2 ${
                    improvement.type === 'missing' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {improvement.type === 'missing' ? '✗' : '⚠'}
                  </span>
                  <span className="text-gray-700">{improvement.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quality Metrics */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Content Quality:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Readability:</span>
              <span className={`ml-2 font-medium ${
                analysis.qualityMetrics.readabilityScore === 'good' ? 'text-green-600' :
                analysis.qualityMetrics.readabilityScore === 'moderate' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {analysis.qualityMetrics.readabilityScore.charAt(0).toUpperCase() + 
                 analysis.qualityMetrics.readabilityScore.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Avg. Words/Sentence:</span>
              <span className="ml-2 font-medium">{analysis.qualityMetrics.avgWordsPerSentence}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Original SOP Preview */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">📄 Original SOP Preview</h3>
          <button
            onClick={onViewOriginal}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Full Document →
          </button>
        </div>
        <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {analysis.text.substring(0, 500)}...
          </pre>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onViewOriginal}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          View Original SOP
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Start Improvement Chat</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
```

---

## PART 3: GENERATING DOWNLOADABLE FILES

### Markdown Export (Simplest)

```javascript
const exportAsMarkdown = (sopContent, fileName = 'sop') => {
  // sopContent is already in markdown format
  const blob = new Blob([sopContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

### HTML Export

```javascript
const exportAsHTML = (sopContent, fileName = 'sop') => {
  // Convert markdown to HTML (basic conversion)
  const htmlContent = markdownToHTML(sopContent);
  
  // Wrap in complete HTML document
  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1 {
      color: #1a1a1a;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #2563eb;
      margin-top: 40px;
      margin-bottom: 15px;
      font-size: 1.5em;
    }
    h3 {
      color: #374151;
      margin-top: 25px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    code {
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    ul, ol {
      margin: 15px 0;
      padding-left: 30px;
    }
    li {
      margin: 8px 0;
    }
    strong {
      color: #1a1a1a;
      font-weight: 600;
    }
    blockquote {
      border-left: 4px solid #2563eb;
      padding-left: 20px;
      margin: 20px 0;
      color: #6b7280;
    }
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 40px 0;
    }
    .metadata {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .metadata p {
      margin: 5px 0;
    }
    @media print {
      body {
        padding: 20px;
      }
      h2 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Basic markdown to HTML converter
const markdownToHTML = (markdown) => {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // Tables (basic support)
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headerCells = header.split('|').filter(cell => cell.trim()).map(cell => `<th>${cell.trim()}</th>`).join('');
    const bodyRows = rows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(cell => cell.trim()).map(cell => `<td>${cell.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Wrap in paragraphs
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');

  return html;
};
```

### PDF Export

```javascript
const exportAsPDF = async (sopContent, fileName = 'sop') => {
  // For PDF generation in the browser, we'll use a workaround:
  // Convert to HTML and then use browser's print functionality
  // OR use jsPDF library (but it's not in our available libraries)
  
  // Method: Create a printable HTML page and trigger print
  const htmlContent = markdownToHTML(sopContent);
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    @page {
      margin: 0.75in;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      font-size: 11pt;
    }
    h1 {
      color: #1a1a1a;
      font-size: 24pt;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
      margin-bottom: 20px;
      page-break-after: avoid;
    }
    h2 {
      color: #2563eb;
      font-size: 18pt;
      margin-top: 30px;
      margin-bottom: 15px;
      page-break-after: avoid;
    }
    h3 {
      color: #374151;
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #999;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 25px;
    }
    li {
      margin: 5px 0;
    }
    strong {
      font-weight: 600;
    }
    .no-print {
      display: none;
    }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.onload = function() {
      window.print();
      // Close window after print dialog
      setTimeout(() => window.close(), 100);
    };
  </script>
</body>
</html>
  `);
  printWindow.document.close();
};
```

### Word Document Export

```javascript
const exportAsWord = (sopContent, fileName = 'sop') => {
  // Convert markdown to basic HTML
  const htmlContent = markdownToHTML(sopContent);
  
  // Create Word-compatible HTML (DOCX is actually a zipped XML format, 
  // but we can create a simpler .doc HTML file that Word can open)
  const wordHTML = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
    }
    h1 {
      font-size: 20pt;
      font-weight: bold;
      color: #2563eb;
      border-bottom: 2pt solid #2563eb;
      padding-bottom: 6pt;
      margin-bottom: 12pt;
    }
    h2 {
      font-size: 16pt;
      font-weight: bold;
      color: #2563eb;
      margin-top: 18pt;
      margin-bottom: 6pt;
    }
    h3 {
      font-size: 14pt;
      font-weight: bold;
      color: #374151;
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    p {
      margin: 6pt 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
    }
    th, td {
      border: 1pt solid #999;
      padding: 6pt;
    }
    th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    ul, ol {
      margin: 6pt 0;
      padding-left: 24pt;
    }
    li {
      margin: 3pt 0;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;

  // Create blob with Word MIME type
  const blob = new Blob(['\ufeff', wordHTML], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

### Copy to Clipboard

```javascript
const copyToClipboard = async (sopContent) => {
  try {
    await navigator.clipboard.writeText(sopContent);
    return { success: true, message: 'SOP copied to clipboard!' };
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = sopContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, message: 'SOP copied to clipboard!' };
    } catch (err) {
      document.body.removeChild(textArea);
      return { success: false, message: 'Failed to copy to clipboard' };
    }
  }
};
```

### Download Menu Component

```jsx
const DownloadMenu = ({ sopContent, fileName, onDownloadComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDownload = async (format) => {
    setDownloading(true);
    setMessage(null);

    try {
      switch (format) {
        case 'markdown':
          exportAsMarkdown(sopContent, fileName);
          setMessage({ type: 'success', text: 'Downloaded as Markdown' });
          break;
        case 'html':
          exportAsHTML(sopContent, fileName);
          setMessage({ type: 'success', text: 'Downloaded as HTML' });
          break;
        case 'pdf':
          await exportAsPDF(sopContent, fileName);
          setMessage({ type: 'success', text: 'Opening print dialog for PDF' });
          break;
        case 'word':
          exportAsWord(sopContent, fileName);
          setMessage({ type: 'success', text: 'Downloaded as Word document' });
          break;
        case 'copy':
          const result = await copyToClipboard(sopContent);
          setMessage({ 
            type: result.success ? 'success' : 'error', 
            text: result.message 
          });
          break;
        default:
          break;
      }

      if (onDownloadComplete) {
        onDownloadComplete(format);
      }

    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setDownloading(false);
      setTimeout(() => setIsOpen(false), 1500);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        disabled={downloading}
      >
        {downloading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Download
            <ChevronDown className="h-5 w-5 ml-2" />
          </>
        )}
      </button>

      {isOpen && !downloading && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <button
            onClick={() => handleDownload('markdown')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">Markdown (.md)</div>
              <div className="text-xs text-gray-500">Plain text format</div>
            </div>
          </button>

          <button
            onClick={() => handleDownload('pdf')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">PDF Document</div>
              <div className="text-xs text-gray-500">Printable format</div>
            </div>
          </button>

          <button
            onClick={() => handleDownload('word')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">Word (.doc)</div>
              <div className="text-xs text-gray-500">Editable in Microsoft Word</div>
            </div>
          </button>

          <button
            onClick={() => handleDownload('html')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">HTML File</div>
              <div className="text-xs text-gray-500">Web-ready format</div>
            </div>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={() => handleDownload('copy')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <Copy className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">Copy to Clipboard</div>
              <div className="text-xs text-gray-500">Copy markdown text</div>
            </div>
          </button>
        </div>
      )}

      {message && (
        <div className={`absolute right-0 mt-2 px-4 py-2 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## PART 4: INTEGRATION EXAMPLES

### Complete File Upload Flow

```jsx
const ImproveSOPPage = () => {
  const [uploadedSOP, setUploadedSOP] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleFileProcessed = async (data) => {
    // Store uploaded SOP
    setUploadedSOP(data);

    // Analyze the SOP
    const sopAnalysis = analyzeSOPStructure(data.text);

    // Combine with stats
    const fullAnalysis = {
      ...sopAnalysis,
      stats: data.stats,
      text: data.text,
      metadata: data.metadata
    };

    setAnalysis(fullAnalysis);
  };

  const handleStartImprovement = () => {
    // Navigate to chat interface with context
    // Pass the analysis and original text to the chat
    // The AI will use this to ask targeted improvement questions
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        {!uploadedSOP ? (
          <div>
            <h1 className="text-3xl font-bold mb-2">Improve Existing SOP</h1>
            <p className="text-gray-600 mb-8">
              Upload your current SOP and we'll help you enhance it with AI-powered suggestions.
            </p>
            <FileUploader onFileProcessed={handleFileProcessed} />
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setUploadedSOP(null);
                setAnalysis(null);
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Upload Different File
            </button>

            <AnalysisResults
              analysis={analysis}
              fileName={uploadedSOP.metadata.fileName}
              onContinue={handleStartImprovement}
              onViewOriginal={() => setShowOriginal(true)}
            />
          </div>
        )}
      </div>

      {/* Original SOP Modal */}
      {showOriginal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Original SOP</h2>
              <button
                onClick={() => setShowOriginal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {uploadedSOP.text}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### Complete Download Flow

```jsx
const SOPPreviewPage = ({ sopContent, sopTitle }) => {
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'markdown'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Generated SOP</h1>
          <DownloadMenu 
            sopContent={sopContent} 
            fileName={sopTitle || 'sop'}
            onDownloadComplete={(format) => {
              console.log(`Downloaded as ${format}`);
            }}
          />
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setViewMode('formatted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'formatted'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👁️ Formatted Preview
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'markdown'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 Markdown Source
          </button>
        </div>

        {/* Preview Area */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {viewMode === 'formatted' ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHTML(sopContent) }}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded-lg overflow-x-auto">
              {sopContent}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## ERROR HANDLING & EDGE CASES

### Handle Corrupted Files

```javascript
const handleFileError = (error, fileName) => {
  const errorMessages = {
    'Failed to read PDF': 'The PDF file appears to be corrupted or password-protected. Please try a different file.',
    'Failed to read Word document': 'Unable to read the Word document. Make sure it\'s a valid .docx file.',
    'Failed to read text file': 'Unable to read the text file. Please check the file encoding.',
    'File too large': 'The file exceeds the 10MB limit. Please upload a smaller file.',
    'Unsupported file type': 'This file type is not supported. Please upload a PDF, Word, or Markdown file.'
  };

  // Find matching error message
  const message = Object.keys(errorMessages).find(key => error.includes(key))
    ? errorMessages[Object.keys(errorMessages).find(key => error.includes(key))]
    : 'An unexpected error occurred while processing the file.';

  return {
    title: 'File Processing Error',
    message,
    suggestion: 'Try uploading a different file or contact support if the problem persists.'
  };
};
```

### Handle Empty or Invalid SOPs

```javascript
const validateSOPContent = (text) => {
  const minWordCount = 50;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);

  if (words.length < minWordCount) {
    return {
      valid: false,
      error: `The document is too short (${words.length} words). A valid SOP should have at least ${minWordCount} words.`
    };
  }

  // Check if it looks like an SOP (has some structure)
  const hasHeadings = /^#{1,3}\s+/m.test(text) || /^\w+:/m.test(text);
  const hasSteps = /\d+\.|step \d+/i.test(text);
  const hasProcedure = /procedure|process|instructions/i.test(text);

  if (!hasHeadings && !hasSteps && !hasProcedure) {
    return {
      valid: false,
      error: 'This doesn\'t appear to be a standard SOP document. SOPs typically contain procedures, steps, or instructions.'
    };
  }

  return { valid: true };
};
```

### Handle Download Failures

```javascript
const safeDownload = async (downloadFunction, format) => {
  try {
    await downloadFunction();
    return { success: true, message: `Successfully downloaded as ${format}` };
  } catch (error) {
    console.error(`Download error (${format}):`, error);
    
    return {
      success: false,
      message: `Failed to download as ${format}. Please try again or use a different format.`,
      error: error.message
    };
  }
};
```

---

## TESTING CHECKLIST

Before deployment, test these scenarios:

### File Upload Testing:
- [ ] Upload valid PDF SOP
- [ ] Upload valid Word (.docx) SOP
- [ ] Upload valid Markdown (.md) SOP
- [ ] Upload corrupted/invalid PDF
- [ ] Upload password-protected PDF
- [ ] Upload file exceeding 10MB
- [ ] Upload unsupported file type (.txt, .xlsx, .pptx)
- [ ] Upload empty file
- [ ] Upload file with special characters in name
- [ ] Drag and drop file
- [ ] Select file via browse button

### Analysis Testing:
- [ ] Analyze SOP with all sections present
- [ ] Analyze SOP with missing sections
- [ ] Analyze SOP with poor quality (passive voice, vague terms)
- [ ] Analyze SOP with good quality
- [ ] Analyze very short SOP (< 100 words)
- [ ] Analyze very long SOP (> 5000 words)

### Download Testing:
- [ ] Download as Markdown (.md)
- [ ] Download as PDF (print dialog)
- [ ] Download as Word (.doc)
- [ ] Download as HTML
- [ ] Copy to clipboard
- [ ] Download with special characters in filename
- [ ] Download with very long filename
- [ ] Multiple consecutive downloads
- [ ] Download while offline (should fail gracefully)

### Edge Cases:
- [ ] Upload SOP, analyze, then upload different SOP
- [ ] Start download, cancel browser dialog
- [ ] Generate SOP with Unicode characters (émojis, Chinese, Arabic)
- [ ] Generate SOP with tables
- [ ] Generate SOP with nested lists
- [ ] Generate SOP with code blocks
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

---

## FINAL IMPLEMENTATION NOTES

1. **Always provide user feedback**: Show loading states, success messages, error messages
2. **Validate early**: Check file type and size before attempting to process
3. **Handle errors gracefully**: Never show technical error messages to users
4. **Optimize large files**: Consider chunking or streaming for files > 5MB
5. **Test across browsers**: File handling APIs vary slightly between browsers
6. **Provide fallbacks**: If modern APIs fail, fall back to older methods
7. **Clean up resources**: Always revoke object URLs after downloads
8. **Preserve formatting**: When converting between formats, maintain structure as much as possible

Your file handling system is now complete and ready to integrate with the UI and AI components!
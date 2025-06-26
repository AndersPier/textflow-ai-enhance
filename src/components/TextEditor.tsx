import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FormatToolbar } from './FormatToolbar';
import { analyzeTextWithOpenAI } from '@/utils/openai';
import { Settings, Sparkles, Copy, ClipboardPaste } from 'lucide-react';

const TextEditor = () => {
  const [content, setContent] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFormatCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const htmlToMarkdown = (html: string): string => {
    let markdown = html;
    
    // Convert headers with proper markdown syntax
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    
    // Convert formatting
    markdown = markdown.replace(/<strong[^>]*>|<b[^>]*>/gi, '**');
    markdown = markdown.replace(/<\/strong>|<\/b>/gi, '**');
    markdown = markdown.replace(/<em[^>]*>|<i[^>]*>/gi, '*');
    markdown = markdown.replace(/<\/em>|<\/i>/gi, '*');
    
    // Convert lists
    markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    
    // Convert paragraphs and line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
    markdown = markdown.replace(/<\/p>/gi, '\n\n');
    markdown = markdown.replace(/<p[^>]*>/gi, '');
    markdown = markdown.replace(/<div[^>]*>/gi, '');
    markdown = markdown.replace(/<\/div>/gi, '\n');
    
    // Clean up extra whitespace and remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();
    
    return markdown;
  };

  const markdownToHtml = (markdown: string): string => {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    
    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    // Convert lists
    html = html.replace(/^\- (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Convert paragraphs and line breaks
    const lines = html.split('\n');
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        processedLines.push('');
      } else if (line.match(/^<(h[1-4]|ul|li)/)) {
        processedLines.push(line);
      } else if (!line.match(/^<\/?(h[1-4]|ul|li)/)) {
        processedLines.push(`<p>${line}</p>`);
      } else {
        processedLines.push(line);
      }
    }
    
    html = processedLines.join('\n');
    html = html.replace(/\n{2,}/g, '\n');
    
    return html;
  };

  const handleCopyText = async () => {
    const markdown = htmlToMarkdown(content);
    try {
      await navigator.clipboard.writeText(markdown);
      toast({
        title: "Copied to Clipboard",
        description: "Text copied as Markdown format.",
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const html = markdownToHtml(text);
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        setContent(html);
      }
      toast({
        title: "Pasted from Clipboard",
        description: "Markdown text pasted and formatted.",
      });
    } catch (error) {
      console.error('Paste failed:', error);
      toast({
        title: "Paste Failed",
        description: "Failed to paste from clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeText = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    const plainText = editorRef.current?.innerText || '';
    if (!plainText.trim()) {
      toast({
        title: "No Content",
        description: "Please write some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeTextWithOpenAI(plainText, apiKey);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Your text has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze text. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('openai-api-key', apiKey);
    setIsApiKeyDialogOpen(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved locally.",
    });
  };

  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            〽 FancyEdit
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Beautiful writing with AI-powered insights
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex gap-3">
            <Button 
              onClick={handleCopyText}
              variant="outline"
              className="bg-white/50 hover:bg-white/80 border-slate-200 shadow-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy as Markdown
            </Button>
            <Button 
              onClick={handlePasteText}
              variant="outline"
              className="bg-white/50 hover:bg-white/80 border-slate-200 shadow-sm"
            >
              <ClipboardPaste className="w-4 h-4 mr-2" />
              Paste Markdown
            </Button>
          </div>

          <div className="flex gap-3">
            <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-slate-200 shadow-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  API Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-slate-800">OpenAI API Configuration</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Configure your OpenAI API key to enable text analysis features.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="openai-api-key" className="text-slate-700">OpenAI API Key</Label>
                    <Input
                      id="openai-api-key"
                      name="openai-api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="mt-1 bg-white/50"
                      autoComplete="off"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Your API key is stored locally and never sent to our servers.
                    </p>
                  </div>
                  <Button onClick={saveApiKey} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Save API Key
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={handleAnalyzeText} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20">
          <FormatToolbar onFormat={handleFormatCommand} />
          
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            className="min-h-[500px] p-8 focus:outline-none text-slate-800 leading-relaxed editor-content"
            style={{ whiteSpace: 'pre-wrap' }}
            suppressContentEditableWarning={true}
            data-placeholder="Start writing your masterpiece..."
          />
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-blue-900 mb-4 text-xl flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Analysis
            </h3>
            <div className="text-blue-800 whitespace-pre-wrap leading-relaxed">{analysis}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;

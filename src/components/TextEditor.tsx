
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FormatToolbar } from './FormatToolbar';
import { analyzeTextWithOpenAI } from '@/utils/openai';
import { Settings, Sparkles } from 'lucide-react';

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

  const handleAnalyzeText = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please write some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeTextWithOpenAI(content, apiKey);
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Text Editor</h1>
        <div className="flex gap-2">
          <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                API Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>OpenAI API Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">OpenAI API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>
                <Button onClick={saveApiKey} className="w-full">
                  Save API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleAnalyzeText} 
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <FormatToolbar onFormat={handleFormatCommand} />
        
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          className="min-h-[400px] p-4 focus:outline-none prose max-w-none"
          style={{ whiteSpace: 'pre-wrap' }}
          suppressContentEditableWarning={true}
          placeholder="Start writing your text here..."
        />
      </div>

      {analysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">AI Analysis</h3>
          <div className="text-blue-800 whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;

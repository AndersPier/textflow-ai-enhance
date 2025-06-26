
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo
} from 'lucide-react';

interface FormatToolbarProps {
  onFormat: (command: string, value?: string) => void;
}

export const FormatToolbar: React.FC<FormatToolbarProps> = ({ onFormat }) => {
  const formatButtons = [
    { command: 'bold', icon: Bold, title: 'Bold' },
    { command: 'italic', icon: Italic, title: 'Italic' },
    { command: 'underline', icon: Underline, title: 'Underline' },
    { command: 'justifyLeft', icon: AlignLeft, title: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, title: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, title: 'Align Right' },
    { command: 'insertUnorderedList', icon: List, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Numbered List' },
    { command: 'undo', icon: Undo, title: 'Undo' },
    { command: 'redo', icon: Redo, title: 'Redo' },
  ];

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormat('foreColor', e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFormat('fontSize', e.target.value);
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-3 flex items-center gap-2 flex-wrap">
      <select 
        onChange={handleFontSizeChange}
        className="px-3 py-2 bg-white/50 border border-slate-200 rounded-lg text-sm shadow-sm hover:bg-white/80 transition-colors"
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Extra Large</option>
      </select>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {formatButtons.map(({ command, icon: Icon, title }) => (
        <Button
          key={command}
          variant="ghost"
          size="sm"
          onClick={() => onFormat(command)}
          title={title}
          className="h-9 w-9 p-0 hover:bg-white/60 hover:shadow-sm transition-all duration-200"
        >
          <Icon className="h-4 w-4 text-slate-600" />
        </Button>
      ))}

      <div className="w-px h-6 bg-slate-300 mx-1" />

      <input
        type="color"
        onChange={handleColorChange}
        className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        title="Text Color"
      />
    </div>
  );
};

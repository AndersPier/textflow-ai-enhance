
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const handleHeadingChange = (value: string) => {
    if (value === 'p') {
      onFormat('formatBlock', 'p');
    } else {
      onFormat('formatBlock', value);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-3 flex items-center gap-2 flex-wrap">
      <Select onValueChange={handleHeadingChange} defaultValue="p">
        <SelectTrigger className="w-40 bg-white/50 border-slate-200 shadow-sm hover:bg-white/80">
          <SelectValue placeholder="Text Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="p">Normal Text</SelectItem>
          <SelectItem value="h1">Large Header</SelectItem>
          <SelectItem value="h2">Medium Header</SelectItem>
          <SelectItem value="h3">Small Header</SelectItem>
          <SelectItem value="h4">Subheading</SelectItem>
        </SelectContent>
      </Select>

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

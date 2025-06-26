
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
    <div className="border-b bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
      <select 
        onChange={handleFontSizeChange}
        className="px-2 py-1 border rounded text-sm"
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Extra Large</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {formatButtons.map(({ command, icon: Icon, title }) => (
        <Button
          key={command}
          variant="ghost"
          size="sm"
          onClick={() => onFormat(command)}
          title={title}
          className="h-8 w-8 p-0"
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <input
        type="color"
        onChange={handleColorChange}
        className="w-8 h-8 rounded border cursor-pointer"
        title="Text Color"
      />
    </div>
  );
};

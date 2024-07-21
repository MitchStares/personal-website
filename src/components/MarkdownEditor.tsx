// src/components/MarkdownEditor.tsx
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const handleChange = (value?: string) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="markdown-editor">
      <MDEditor value={value} onChange={handleChange} />
    </div>
  );
};

export default MarkdownEditor;

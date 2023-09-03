import React, { useState } from 'react';

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import './style.scss';

const modules = {
  toolbar: [
    [{ font: [] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ['link'],
    ['clean'], // remove formatting button
  ],
  clipboard: {
    matchVisual: false,
  },
};

interface TextEditorProps {
  setValue?: any;
  value?: any;
  onBlur?: () => Promise<void>;
}

const TextEditor: React.FC<TextEditorProps> = ({ setValue, value, onBlur }) => {
  return (
    <ReactQuill
      onBlur={onBlur}
      theme='snow'
      value={value}
      onChange={setValue}
      modules={modules}
      className='height-editor'
    />
  );
};

export default TextEditor;

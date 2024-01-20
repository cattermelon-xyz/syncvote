import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './style.scss';

interface TextEditorProps {
  setValue?: any;
  value?: any;
  onBlur?: () => Promise<void>;
  id?: string;
  onReady?: (editor: any) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  setValue,
  value,
  onBlur,
  onReady,
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onBlur={onBlur}
      onChange={(event, editor) => {
        setValue(editor.getData());
      }}
      onReady={onReady}
    />
  );
};

export default TextEditor;

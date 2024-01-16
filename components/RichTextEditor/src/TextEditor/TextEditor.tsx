import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './style.scss';

interface TextEditorProps {
  setValue?: any;
  value?: any;
  onBlur?: () => Promise<void>;
  id?: string;
  isEditorUI?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  setValue,
  value,
  onBlur,
  isEditorUI,
}) => {
  const editorClass = isEditorUI ? 'editor-ui' : '';

  return (
    <div className={editorClass}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onBlur={onBlur}
        onChange={(event, editor) => {
          setValue(editor.getData());
        }}
      />
    </div>
  );
};

export default TextEditor;

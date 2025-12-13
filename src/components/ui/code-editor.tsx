'use client';

import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { glslLanguage } from '../../utils/glsl-lang';
import './code-editor.css';

interface CodeEditorProps {
  initialCode?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  height?: string;
  readOnly?: boolean;
  value?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onChange, onBlur, readOnly = false }) => {
  const [code, setCode] = useState(initialCode);

  // 当 initialCode 变化时更新内部状态
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // 处理代码变更
  const handleChange = (value: string) => {
    setCode(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <CodeMirror
      value={code}
      height={'100%'}
      extensions={[glslLanguage()]}
      onChange={handleChange}
      onBlur={onBlur}
      readOnly={readOnly}
      theme={oneDark}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        foldGutter: true,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
    />
  );
};

export default CodeEditor;

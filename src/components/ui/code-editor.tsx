'use client';

import React, { useEffect, useState, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion } from '@codemirror/autocomplete';
import { glslLanguage } from '../../utils/glsl-lang';
import { getAllSnippetsCompletion } from '../../utils/glsl-autocomplete';
import { type Locale } from '../../lib/i18n';
import './code-editor.css';

interface CodeEditorProps {
  initialCode?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  height?: string;
  readOnly?: boolean;
  value?: string;
  category?: string;
  locale?: Locale;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  onChange,
  onBlur,
  readOnly = false,
  category = 'basic',
  locale = 'zh'
}) => {
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

  // 创建自动补全扩展（使用useMemo避免重复创建）
  const extensions = useMemo(() => {
    return [
      glslLanguage(),
      autocompletion({
        override: [getAllSnippetsCompletion(locale)],
        activateOnTyping: true,
        maxRenderedOptions: 20,
        closeOnBlur: true
      })
    ];
  }, [locale]);

  return (
    <CodeMirror
      value={code}
      height={'100%'}
      extensions={extensions}
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
        autocompletion: false, // 禁用默认自动补全，使用我们自定义的
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

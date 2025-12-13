import { type Locale } from './i18n';

interface ErrorMessage {
  zh: string;
  en: string;
  hint: {
    zh: string;
    en: string;
  };
}

interface ParsedError {
  title: string;
  hint: string | null;
  raw: string;
  line?: number;
}

const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  'undeclared identifier': {
    zh: '未声明的变量或函数',
    en: 'Undeclared variable or function',
    hint: {
      zh: '检查变量名是否拼写正确，或者是否忘记声明',
      en: 'Check if the variable name is spelled correctly or if you forgot to declare it'
    }
  },
  'syntax error': {
    zh: '语法错误',
    en: 'Syntax error',
    hint: {
      zh: '检查是否缺少分号、括号或其他符号',
      en: 'Check for missing semicolons, brackets, or other symbols'
    }
  },
  'no matching overloaded function found': {
    zh: '函数参数类型不匹配',
    en: 'Function parameter type mismatch',
    hint: {
      zh: '检查函数调用时传入的参数类型是否正确',
      en: 'Check if the parameter types passed to the function are correct'
    }
  },
  'type mismatch': {
    zh: '类型不匹配',
    en: 'Type mismatch',
    hint: {
      zh: '检查赋值或运算时两边的数据类型是否一致',
      en: 'Check if the data types on both sides of the assignment or operation match'
    }
  },
  'use of undeclared identifier': {
    zh: '使用了未声明的标识符',
    en: 'Use of undeclared identifier',
    hint: {
      zh: '确保变量在使用前已经声明',
      en: 'Make sure the variable is declared before use'
    }
  },
  "'main' : function already has a body": {
    zh: 'main 函数重复定义',
    en: 'main function is defined multiple times',
    hint: {
      zh: '确保只有一个 main 函数',
      en: 'Make sure there is only one main function'
    }
  },
  'missing return statement': {
    zh: '缺少返回语句',
    en: 'Missing return statement',
    hint: {
      zh: '函数需要返回一个值',
      en: 'The function needs to return a value'
    }
  },
  'incompatible types': {
    zh: '不兼容的类型',
    en: 'Incompatible types',
    hint: {
      zh: '尝试使用类型转换函数，如 float(), vec2(), vec3() 等',
      en: 'Try using type conversion functions like float(), vec2(), vec3(), etc.'
    }
  },
  'division by zero': {
    zh: '除以零错误',
    en: 'Division by zero',
    hint: {
      zh: '确保除数不为零',
      en: 'Make sure the divisor is not zero'
    }
  },
  'too many arguments': {
    zh: '参数过多',
    en: 'Too many arguments',
    hint: {
      zh: '检查函数调用时传入的参数数量',
      en: 'Check the number of parameters passed when calling the function'
    }
  },
  'too few arguments': {
    zh: '参数过少',
    en: 'Too few arguments',
    hint: {
      zh: '检查函数调用时是否传入了所有必需的参数',
      en: 'Check if all required parameters are passed when calling the function'
    }
  }
};

/**
 * 解析 GLSL 编译错误，返回友好的错误消息
 */
export function parseShaderError(error: string, locale: Locale = 'zh'): ParsedError {
  if (!error) {
    return {
      title: locale === 'zh' ? '未知错误' : 'Unknown error',
      hint: null,
      raw: error
    };
  }

  // 提取行号（如果有）
  const lineMatch = error.match(/ERROR:\s*\d+:(\d+)/);
  const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

  // 查找匹配的错误模式
  for (const [pattern, message] of Object.entries(ERROR_MESSAGES)) {
    if (error.toLowerCase().includes(pattern.toLowerCase())) {
      return {
        title: locale === 'zh' ? message.zh : message.en,
        hint: locale === 'zh' ? message.hint.zh : message.hint.en,
        raw: error,
        line
      };
    }
  }

  // 如果没有匹配的模式，返回原始错误
  return {
    title: locale === 'zh' ? 'Shader 编译错误' : 'Shader compilation error',
    hint: locale === 'zh' ? '请查看详细错误信息' : 'Please check the detailed error message',
    raw: error,
    line
  };
}

/**
 * 格式化错误消息为用户友好的字符串
 */
export function formatErrorMessage(parsedError: ParsedError): string {
  let message = parsedError.title;

  if (parsedError.line) {
    message += ` (第 ${parsedError.line} 行)`;
  }

  if (parsedError.hint) {
    message += `\n💡 提示: ${parsedError.hint}`;
  }

  return message;
}

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'src/lib/tutorials');
const MARKER = '<!-- AUTO-GENERATED: tutorial-readme -->';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function stripLeadingTitle(md) {
  return md.replace(/^# .+\n+/m, '');
}

function hasChinese(s) {
  return /[\u4e00-\u9fff]/.test(s);
}

function extractTodos(glsl) {
  const todos = [];
  for (const line of glsl.split('\n')) {
    const m = line.match(/^\s*\/\/\s*TODO:?\s*(.+?)\s*$/);
    if (m?.[1]) todos.push(m[1]);
  }
  return Array.from(new Set(todos));
}

function extractUniforms(exerciseCode, answerCode) {
  const code = `${exerciseCode}\n${answerCode}`;
  const uniforms = new Map();
  const re = /^\s*uniform\s+([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_]+)\s*;/gm;
  let m = null;
  while ((m = re.exec(code))) {
    const type = m[1];
    const name = m[2];
    if (!uniforms.has(name)) uniforms.set(name, type);
  }
  return Array.from(uniforms.entries()).map(([name, type]) => ({ name, type }));
}

function detectFeatures(exerciseCode, answerCode) {
  const code = `${exerciseCode}\n${answerCode}`;
  const has = re => re.test(code);
  return {
    usesVuv: has(/varying\s+vec2\s+vUv/),
    usesFragCoord: has(/gl_FragCoord/),
    usesResolution: has(/uniform\s+vec2\s+u_resolution/),
    usesTime: has(/uniform\s+float\s+u_time/),
    usesMouse: has(/uniform\s+vec2\s+u_mouse/),
    usesMix: has(/\bmix\s*\(/),
    usesStep: has(/\bstep\s*\(/),
    usesSmoothstep: has(/\bsmoothstep\s*\(/),
    usesFract: has(/\bfract\s*\(/),
    usesFloor: has(/\bfloor\s*\(/),
    usesMod: has(/\bmod\s*\(/),
    usesSinCos: has(/\bsin\s*\(|\bcos\s*\(/),
    usesAtan: has(/\batan\s*\(/),
    usesLengthDistance: has(/\blength\s*\(|\bdistance\s*\(/),
  };
}

function pickFirstMatch(code, regexes) {
  for (const re of regexes) {
    const m = code.match(re);
    if (m) return m;
  }
  return null;
}

function analyzeTutorial(category, id, exerciseCode, answerCode) {
  const features = detectFeatures(exerciseCode, answerCode);
  const code = `${answerCode}\n${exerciseCode}`;

  const analysis = {
    category,
    id,
    features,
    recipe: 'generic',
    gradientAxis: null,
    stripeAxis: null,
    gradientMode: null, // 'mix' | 'channel' | 'grayscale' | 'radial'
    usesPolar: features.usesAtan,
    usesNoise: /\bvalueNoise\s*\(|\bfbm\s*\(|\bhash21\s*\(|\brandom\s*\(/.test(code),
    usesLighting: /\bdot\s*\(\s*n\s*,\s*l|\breflect\s*\(|\bblinn|\bphong|shininess|specular/i.test(code),
    hasRing: /\babs\s*\(\s*(?:length|distance)\s*\([^)]*\)\s*-\s*[0-9.]+/.test(answerCode) || /\babs\s*\(\s*d\s*-\s*r/.test(answerCode),
    usesSdfBox: /\bsd(Box|RoundBox)\s*\(/.test(code),
  };

  const mixAxis = pickFirstMatch(answerCode, [
    /\bmix\s*\([^;]+,\s*[^;]+,\s*vUv\.(x|y)\s*\)/,
    /\bmix\s*\([^;]+,\s*[^;]+,\s*uv\.(x|y)\s*\)/,
  ]);
  if (mixAxis?.[1]) {
    analysis.gradientAxis = mixAxis[1];
    analysis.gradientMode = 'mix';
  }

  const glFragColor = pickFirstMatch(answerCode, [
    /\bgl_FragColor\s*=\s*vec4\s*\(\s*([^;]+)\s*\)\s*;/,
    /\bgl_FragColor\s*=\s*vec4\s*\(\s*([^;]+)\s*\)\s*;/m,
  ]);

  if (!analysis.gradientAxis && glFragColor?.[1]) {
    const expr = glFragColor[1];
    const axisMatch = expr.match(/\b(?:vUv|uv)\.(x|y)\b/);
    if (axisMatch?.[1]) {
      analysis.gradientAxis = axisMatch[1];
      analysis.gradientMode = /\bmix\s*\(/.test(expr) ? 'mix' : 'channel';
    }
  }

  if (!analysis.gradientAxis && /\b(?:vUv|uv)\.(x|y)\b/.test(answerCode)) {
    const axisMatch = pickFirstMatch(answerCode, [/\b(?:vUv|uv)\.(x|y)\b/]);
    if (axisMatch?.[1]) {
      analysis.gradientAxis = axisMatch[1];
      analysis.gradientMode = 'channel';
    }
  }

  if (!analysis.gradientMode && /\blength\s*\(\s*(?:vUv|uv)\s*-\s*0\\.5/.test(answerCode)) {
    analysis.gradientMode = 'radial';
  }

  const stripeAxis = pickFirstMatch(answerCode, [
    /\bfract\s*\(\s*vUv\.(x|y)\s*\*\s*([0-9.]+|[a-zA-Z_][a-zA-Z0-9_]*)\s*\)/,
    /\bfract\s*\(\s*uv\.(x|y)\s*\*\s*([0-9.]+|[a-zA-Z_][a-zA-Z0-9_]*)\s*\)/,
  ]);
  if (stripeAxis?.[1]) analysis.stripeAxis = stripeAxis[1];

  if (analysis.usesLighting) analysis.recipe = 'lighting';
  else if (analysis.usesNoise) analysis.recipe = 'noise';
  else if (analysis.usesPolar) analysis.recipe = 'polar';
  else if (analysis.hasRing) analysis.recipe = 'ring';
  else if (analysis.usesSdfBox) analysis.recipe = 'sdf-box';
  else if (analysis.stripeAxis) analysis.recipe = 'stripes';
  else if (analysis.gradientAxis || analysis.gradientMode === 'radial') analysis.recipe = 'gradient';
  else if (features.usesLengthDistance && (features.usesSmoothstep || features.usesStep)) analysis.recipe = 'distance-mask';

  return analysis;
}

function buildConcepts(locale, features) {
  const t = (en, zh) => (locale === 'en' ? en : zh);
  const concepts = [];

  if (features.usesVuv) {
    concepts.push({
      text: t('`vUv` is normalized UV in `[0,1]`.', '`vUv` 是归一化 UV（`[0,1]`）。'),
      code: 'vec2 uv = vUv;',
    });
  }

  if (features.usesFragCoord && features.usesResolution) {
    concepts.push({
      text: t(
        'Normalize pixel coordinates using `u_resolution`.',
        '用 `u_resolution` 把像素坐标归一化。',
      ),
      code: 'vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    });
  }

  if (features.usesTime) {
    concepts.push({
      text: t('Animate with `u_time` + `sin/cos`.', '用 `u_time` + `sin/cos` 做动画。'),
      code: 'float pulse = sin(u_time) * 0.5 + 0.5;',
    });
  }

  if (features.usesMouse && features.usesResolution) {
    concepts.push({
      text: t('Normalize mouse position.', '归一化鼠标坐标。'),
      code: 'vec2 mouse = u_mouse / u_resolution;',
    });
  }

  if (features.usesMix) {
    concepts.push({
      text: t('Blend values with `mix(a, b, t)`.', '用 `mix(a, b, t)` 混合/插值。'),
      code: 'vec3 color = mix(colorA, colorB, t);',
    });
  }

  if (features.usesStep) {
    concepts.push({
      text: t('Build a hard mask with `step`.', '用 `step` 构造硬边遮罩。'),
      code: 'float mask = step(0.5, uv.x);',
    });
  }

  if (features.usesSmoothstep) {
    concepts.push({
      text: t('Build a soft mask with `smoothstep`.', '用 `smoothstep` 构造软边遮罩。'),
      code: 'float m = 1.0 - smoothstep(r, r + aa, d);',
    });
  }

  if (features.usesFract || features.usesFloor || features.usesMod) {
    concepts.push({
      text: t('Use `floor/fract/mod` for tiling and repetition.', '用 `floor/fract/mod` 做分段与重复。'),
      code: 'vec2 cell = floor(uv * 10.0);\nfloat m = mod(cell.x + cell.y, 2.0);',
    });
  }

  if (features.usesLengthDistance) {
    concepts.push({
      text: t('Distance fields with `length/distance`.', '用 `length/distance` 构造距离场。'),
      code: 'float d = length(uv - 0.5);',
    });
  }

  if (features.usesAtan) {
    concepts.push({
      text: t('Angle with `atan(y, x)` and normalize to `[0,1]`.', '用 `atan(y, x)` 求角度并归一化到 `[0,1]`。'),
      code: 'float a = atan(p.y, p.x);\nfloat t = (a + PI) / (2.0 * PI);',
    });
  }

  return concepts;
}

function buildInputs(locale, uniforms) {
  const t = (en, zh) => (locale === 'en' ? en : zh);
  if (!uniforms.length) return [];

  const describe = name => {
    switch (name) {
      case 'u_time':
        return t('Time in seconds.', '时间（秒）。');
      case 'u_resolution':
        return t('Canvas size in pixels.', '画布尺寸（像素）。');
      case 'u_mouse':
        return t('Mouse position in pixels.', '鼠标位置（像素）。');
      default:
        return t('Shader input.', '着色器输入。');
    }
  };

  return uniforms.map(u => ({
    text: `\`${u.type} ${u.name}\` — ${describe(u.name)}`,
  }));
}

function buildRecipeConcepts(locale, analysis) {
  const t = (en, zh) => (locale === 'en' ? en : zh);
  const { recipe, gradientAxis, stripeAxis, gradientMode } = analysis;
  const uvRef = analysis.features.usesVuv
    ? 'vUv'
    : analysis.features.usesFragCoord && analysis.features.usesResolution
      ? 'uv'
      : 'uv';

  if (recipe === 'gradient') {
    const axisLabel = gradientAxis === 'y' ? t('vertical', '垂直') : t('horizontal', '水平');
    if (gradientMode === 'radial') {
      const radialConcepts = [
        {
          text: t(
            'A radial gradient uses distance to the center as a 0-1 factor.',
            '径向渐变用到中心的距离作为 0-1 因子。',
          ),
          code: `vec2 p = ${uvRef} - 0.5;\nfloat t = length(p);`,
        },
        { text: t('Clamp and map to color.', '限制范围并映射到颜色。'), code: 't = clamp(t, 0.0, 1.0);\nvec3 color = vec3(t);' },
      ];
      if (!analysis.features.usesVuv && analysis.features.usesFragCoord && analysis.features.usesResolution) {
        radialConcepts.unshift({
          text: t('Normalize pixel coordinates to UV.', '把像素坐标归一化为 UV。'),
          code: 'vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        });
      }
      return radialConcepts;
    }
    const linearConcepts = [
      {
        text: t(
          `A ${axisLabel} gradient uses a 0-1 factor (usually UV) to blend colors.`,
          `${axisLabel}渐变使用 0-1 因子（通常来自 UV）来混合颜色。`,
        ),
        code:
          gradientMode === 'mix'
            ? `float t = ${uvRef}.${gradientAxis || 'x'};\nvec3 color = mix(colorA, colorB, t);`
            : `float t = ${uvRef}.${gradientAxis || 'x'};\nvec3 color = vec3(t);`,
      },
      { text: t('Keep the factor inside `[0,1]`.', '把因子限制在 `[0,1]`。'), code: 't = clamp(t, 0.0, 1.0);' },
    ];
    if (!analysis.features.usesVuv && analysis.features.usesFragCoord && analysis.features.usesResolution) {
      linearConcepts.unshift({
        text: t('Normalize pixel coordinates to UV.', '把像素坐标归一化为 UV。'),
        code: 'vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
      });
    }
    return linearConcepts;
  }

  if (recipe === 'stripes') {
    return [
      {
        text: t(
          'Stripes come from repeating coordinates with `fract` and converting them to a 0/1 mask.',
          '条纹来自 `fract` 的坐标重复，再用阈值转成 0/1 遮罩。',
        ),
        code: `float count = 12.0;\nfloat v = fract(vUv.${stripeAxis || 'x'} * count);\nfloat mask = step(0.5, v);`,
      },
      { text: t('Use `mix` to select between two colors.', '用 `mix` 在两种颜色间切换。'), code: 'vec3 color = mix(colorA, colorB, mask);' },
    ];
  }

  if (recipe === 'distance-mask' || recipe === 'ring') {
    const maskCode =
      recipe === 'ring'
        ? 'float ringDist = abs(d - r);\nfloat mask = 1.0 - smoothstep(w, w + aa, ringDist);'
        : 'float mask = 1.0 - smoothstep(r, r + aa, d);';
    return [
      { text: t('Distance to center builds a distance field.', '到中心的距离可以构造距离场。'), code: 'vec2 p = vUv - 0.5;\nfloat d = length(p);' },
      { text: t('Convert distance into a mask.', '把距离转换为遮罩。'), code: maskCode },
    ];
  }

  if (recipe === 'polar') {
    return [
      { text: t('Angle comes from `atan(y, x)`.', '角度来自 `atan(y, x)`。'), code: 'float a = atan(p.y, p.x);' },
      { text: t('Normalize angle to `[0,1]` and use it as a factor.', '把角度归一化到 `[0,1]` 并作为插值因子。'), code: 'float t = (a + PI) / (2.0 * PI);' },
    ];
  }

  if (recipe === 'noise') {
    return [
      {
        text: t(
          'Noise is built from random values on a grid plus smooth interpolation.',
          '噪声由格点随机值 + 平滑插值构成。',
        ),
        code: 'vec2 i = floor(p);\nvec2 f = fract(p);\nvec2 u = f*f*(3.0-2.0*f);\nfloat n = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);',
      },
      { text: t('Map noise to color with `mix` or thresholds.', '用 `mix` 或阈值把噪声映射到颜色。'), code: 'vec3 color = mix(colorA, colorB, n);' },
    ];
  }

  if (recipe === 'lighting') {
    return [
      { text: t('Diffuse lighting uses `max(dot(n, l), 0.0)`.', '漫反射使用 `max(dot(n, l), 0.0)`。'), code: 'float diff = max(dot(n, lightDir), 0.0);' },
      { text: t('Specular highlights use `pow` (Phong/Blinn-Phong).', '高光使用 `pow`（Phong/Blinn-Phong）。'), code: 'float spec = pow(max(dot(r, v), 0.0), shininess);' },
    ];
  }

  return buildConcepts(locale, analysis.features);
}

function buildRecipeSteps(locale, analysis, todos) {
  const t = (en, zh) => (locale === 'en' ? en : zh);
  const usableTodos = locale === 'en' ? todos.filter(x => !hasChinese(x)) : todos;
  if (usableTodos.length >= 2) return usableTodos.slice(0, 12);

  const { recipe, gradientAxis, stripeAxis, features } = analysis;
  const uvRef = features.usesVuv ? 'vUv' : 'uv';
  const steps = [];

  if (recipe === 'gradient') {
    if (!features.usesVuv && features.usesFragCoord && features.usesResolution) {
      steps.push(
        t(
          'Normalize coordinates: `uv = gl_FragCoord.xy / u_resolution.xy`.',
          '先归一化坐标：`uv = gl_FragCoord.xy / u_resolution.xy`。',
        ),
      );
    }
    steps.push(
      t(
        `Set factor: \`t = ${uvRef}.${gradientAxis || 'x'}\`.`,
        `设置因子：\`t = ${uvRef}.${gradientAxis || 'x'}\`。`,
      ),
    );
    steps.push(t('Map `t` to a color (grayscale or `mix`).', '把 `t` 映射到颜色（灰度或 `mix`）。'));
    steps.push(t('Output `gl_FragColor` with alpha=1.', '输出 `gl_FragColor`，alpha=1。'));
    return steps;
  }

  if (recipe === 'stripes') {
    steps.push(t(`Repeat with \`fract(vUv.${stripeAxis || 'x'} * count)\`.`, `用 \`fract(vUv.${stripeAxis || 'x'} * count)\` 做重复。`));
    steps.push(t('Convert to mask with `step(0.5, v)`.', '用 `step(0.5, v)` 转成遮罩。'));
    steps.push(t('Use `mix` to switch colors by mask.', '用遮罩 `mix` 切换颜色。'));
    return steps;
  }

  if (recipe === 'distance-mask') {
    steps.push(t('Center coordinates: `p = vUv - 0.5`.', '居中坐标：`p = vUv - 0.5`。'));
    steps.push(t('Compute distance: `d = length(p)`.', '计算距离：`d = length(p)`。'));
    steps.push(t('Build a mask with `smoothstep` or `step`.', '用 `smoothstep` 或 `step` 构造遮罩。'));
    steps.push(t('Mix foreground/background by the mask.', '用遮罩混合前景/背景。'));
    return steps;
  }

  if (recipe === 'ring') {
    steps.push(t('Compute distance `d` from center.', '计算到中心距离 `d`。'));
    steps.push(t('Compute ring distance: `abs(d - r)`.', '计算圆环距离：`abs(d - r)`。'));
    steps.push(t('Convert ring distance to mask with `smoothstep`.', '用 `smoothstep` 把距离转成遮罩。'));
    steps.push(t('Mix colors and output.', '混合颜色并输出。'));
    return steps;
  }

  if (recipe === 'polar') {
    steps.push(t('Center coordinates: `p = vUv - 0.5`.', '居中坐标：`p = vUv - 0.5`。'));
    steps.push(t('Angle: `a = atan(p.y, p.x)`.', '角度：`a = atan(p.y, p.x)`。'));
    steps.push(t('Normalize: `t = (a + PI) / (2*PI)`.', '归一化：`t = (a + PI) / (2*PI)`。'));
    steps.push(t('Use `t` to mix colors.', '用 `t` 混合颜色。'));
    return steps;
  }

  if (recipe === 'noise') {
    steps.push(t('Scale UV to control frequency (e.g. `p = vUv * 6.0`).', '缩放 UV 控制频率（如 `p = vUv * 6.0`）。'));
    steps.push(t('Compute base noise (hash/valueNoise).', '计算基础噪声（hash/valueNoise）。'));
    steps.push(t('Optionally sum octaves (FBM) for detail.', '可选：叠加多层（FBM）增强细节。'));
    steps.push(t('Map noise to grayscale or color.', '把噪声映射到灰度或颜色。'));
    return steps;
  }

  if (recipe === 'lighting') {
    steps.push(t('Get normal `n` and a normalized light direction.', '获得法线 `n` 与归一化光照方向。'));
    steps.push(t('Compute diffuse term with `dot(n, l)`.', '用 `dot(n, l)` 计算漫反射项。'));
    steps.push(t('Optionally compute specular with `pow`.', '可选：用 `pow` 计算高光。'));
    steps.push(t('Combine terms and output.', '组合各项并输出。'));
    return steps;
  }

  return buildSteps(locale, todos, features);
}

function buildSteps(locale, todos, features) {
  const t = (en, zh) => (locale === 'en' ? en : zh);

  const steps = [];
  const usableTodos =
    locale === 'en' ? todos.filter(x => !hasChinese(x)) : todos;

  if (usableTodos.length >= 2) return usableTodos.slice(0, 12);

  if (features.usesFragCoord && features.usesResolution) {
    steps.push(t('Normalize coordinates to UV.', '归一化坐标得到 UV。'));
  } else if (features.usesVuv) {
    steps.push(t('Start from vUv.', '从 vUv 开始。'));
  }

  if (features.usesLengthDistance) {
    steps.push(t('Compute a distance value for masks/shapes.', '计算距离值用于遮罩/形状。'));
  }

  if (features.usesStep) steps.push(t('Build a hard mask with step().', '用 step() 构造硬边遮罩。'));
  if (features.usesSmoothstep) steps.push(t('Build a soft mask with smoothstep().', '用 smoothstep() 构造软边遮罩。'));
  if (features.usesFract || features.usesFloor || features.usesMod) {
    steps.push(t('Use floor/fract/mod for repetition or patterns.', '用 floor/fract/mod 做重复/图案。'));
  }
  if (features.usesMix) steps.push(t('Use mix() to blend outputs.', '用 mix() 混合输出。'));
  if (features.usesTime) steps.push(t('Animate with u_time (optional).', '用 u_time 做动画（可选）。'));
  if (features.usesMouse) steps.push(t('Use u_mouse to make it interactive (optional).', '用 u_mouse 做交互（可选）。'));

  if (steps.length === 0) steps.push(t('Follow the TODOs in fragment-exercise.glsl.', '按 fragment-exercise.glsl 的 TODO 完成。'));
  return steps;
}

function buildCommonMistakes(locale, features) {
  const t = (en, zh) => (locale === 'en' ? en : zh);
  const mistakes = [];
  if (features.usesMix) mistakes.push(t('Clamp `t` into `[0,1]` when needed.', '必要时把 `t` 用 clamp 限制到 `[0,1]`。'));
  if (features.usesFragCoord) mistakes.push(t('Don’t use raw pixels without normalization.', '不要直接用像素坐标，记得归一化。'));
  if (features.usesSmoothstep) mistakes.push(t('Make sure `edge0 < edge1` for smoothstep().', '`smoothstep` 通常要保证 `edge0 < edge1`。'));
  if (features.usesFract) mistakes.push(t('Change frequency by scaling before fract().', '先缩放再 fract() 才能改变密度。'));
  if (mistakes.length === 0) mistakes.push(t('If output is black, check your mask/factor isn’t always 0.', '如果画面全黑，检查遮罩/因子是否一直为 0。'));
  return mistakes.slice(0, 6);
}

function buildReadme(locale, config, exerciseCode, answerCode, previous) {
  const title = config?.title?.[locale] || config?.title?.zh || config?.title || config?.id || '';
  const description =
    config?.description?.[locale] || config?.description?.zh || config?.description || '';
  const objectives = (config?.learningObjectives && (config.learningObjectives[locale] || config.learningObjectives.zh)) || [];
  const prereq = config?.prerequisites || [];

  const todos = extractTodos(exerciseCode);
  const analysis = analyzeTutorial(config?.category || 'unknown', config?.id || 'unknown', exerciseCode, answerCode);
  const uniforms = extractUniforms(exerciseCode, answerCode);
  const inputs = buildInputs(locale, uniforms);
  const concepts = buildRecipeConcepts(locale, analysis);
  const steps = buildRecipeSteps(locale, analysis, todos);
  const mistakes = buildCommonMistakes(locale, analysis.features);

  const t = (en, zh) => (locale === 'en' ? en : zh);

  const lines = [];
  lines.push(MARKER);
  lines.push(`# ${title}`);
  if (description) lines.push('', description);

  lines.push('', `## ${t('Overview', '概览')}`);
  const overview = (() => {
    switch (analysis.recipe) {
      case 'gradient':
        return t(
          `Implement a ${analysis.gradientAxis === 'y' ? 'vertical' : 'horizontal'} gradient using UV as the factor.`,
          `使用 UV 作为因子实现${analysis.gradientAxis === 'y' ? '垂直' : '水平'}渐变。`,
        );
      case 'stripes':
        return t('Create repeating stripes using `fract` and `step`.', '用 `fract` 与 `step` 创建重复条纹。');
      case 'distance-mask':
        return t('Use a distance field and a mask to shape the image.', '用距离场与遮罩来塑形。');
      case 'ring':
        return t('Draw a ring by measuring distance to a circle boundary.', '通过到圆周边界的距离绘制圆环。');
      case 'polar':
        return t('Use polar angle as a gradient factor.', '用极角作为渐变因子。');
      case 'noise':
        return t('Generate procedural noise and map it to color.', '生成程序化噪声并映射到颜色。');
      case 'lighting':
        return t('Compute lighting terms and shade a shape.', '计算光照项并为形状着色。');
      default:
        return t('Follow the steps to complete the exercise.', '按步骤完成练习。');
    }
  })();
  lines.push(`- ${overview}`);

  lines.push('', `## ${t('Learning Objectives', '学习目标')}`);
  if (objectives.length) objectives.forEach(o => lines.push(`- ${o}`));
  else lines.push(`- ${t('Complete the exercise and understand the key concepts used.', '完成练习并理解题目用到的关键概念。')}`);

  if (prereq.length) {
    lines.push('', `## ${t('Prerequisites', '前置知识')}`);
    prereq.forEach(p => lines.push(`- ${p}`));
  }

  if (inputs.length) {
    lines.push('', `## ${t('Inputs', '输入')}`);
    inputs.forEach(i => lines.push(`- ${i.text}`));
  }

  lines.push('', `## ${t('Key Concepts', '关键概念')}`);
  concepts.forEach(c => {
    lines.push(`- ${c.text}`);
    lines.push('', '```glsl', c.code, '```');
  });

  lines.push('', `## ${t('How To Implement (Step-by-step)', '如何实现（步骤）')}`);
  steps.forEach(s => lines.push(`- ${s}`));

  lines.push('', `## ${t('Self-check', '自检')}`);
  lines.push(`- ${t('Does it compile without errors?', '是否能无错误编译？')}`);
  lines.push(`- ${t('Does the output match the goal?', '输出是否符合目标？')}`);
  lines.push(`- ${t('Are key values kept in `[0,1]`?', '关键数值是否在 `[0,1]`？')}`);

  lines.push('', `## ${t('Common Mistakes', '常见坑')}`);
  mistakes.forEach(m => lines.push(`- ${m}`));

  if (previous && previous.trim()) {
    const clean = stripLeadingTitle(previous).trim();
    if (clean) {
      lines.push('', '---', '', `## ${t('Additional Notes', '补充笔记')}`, '', clean);
    }
  }

  return lines.join('\n') + '\n';
}

function regenerate() {
  const categories = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let updated = 0;
  let skipped = 0;

  for (const category of categories) {
    const catDir = path.join(ROOT, category);
    const tutorialDirs = fs
      .readdirSync(catDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const id of tutorialDirs) {
      const dir = path.join(catDir, id);
      const cfgPath = path.join(dir, 'config.json');
      if (!fs.existsSync(cfgPath)) continue;

      const config = readJson(cfgPath);
      const exercisePath = path.join(dir, 'fragment-exercise.glsl');
      const answerPath = path.join(dir, 'fragment.glsl');
      const exerciseCode = fs.existsSync(exercisePath) ? fs.readFileSync(exercisePath, 'utf8') : '';
      const answerCode = fs.existsSync(answerPath) ? fs.readFileSync(answerPath, 'utf8') : '';

      for (const locale of ['en', 'zh']) {
        const readmePath = path.join(dir, `${locale}-README.md`);
        const previous = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
        const next = buildReadme(locale, config, exerciseCode, answerCode, previous.startsWith(MARKER) ? '' : previous);

        if (previous === next) {
          skipped++;
          continue;
        }
        fs.writeFileSync(readmePath, next, 'utf8');
        updated++;
      }
    }
  }

  console.log(`README regenerated. updated=${updated}, unchanged=${skipped}`);
}

if (require.main === module) {
  regenerate();
}

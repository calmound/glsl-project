import fs from 'fs';
import path from 'path';
import { type Locale } from './i18n';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isFree?: boolean;
}

export interface TutorialConfig {
  id: string;
  isFree?: boolean;
  title:
    | {
        zh: string;
        en: string;
      }
    | string;
  title_en?: string;
  description:
    | {
        zh: string;
        en: string;
      }
    | string;
  description_en?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags?: string[];
  estimatedTime?: number;
  prerequisites?: string[];
  learningObjectives?: {
    zh: string[];
    en: string[];
  };
  uniforms?: Record<string, any>;
  preview?: string;
}

export interface TutorialRouteParam {
  category: string;
  id: string;
}

type TutorialListItem = {
  tutorial: Tutorial;
  prerequisitesCount: number;
  estimatedTime: number;
};

type TutorialDirectoryEntry = {
  category: string;
  tutorialDir: string;
  fullPath: string;
};

const TUTORIALS_DIR = path.join(process.cwd(), 'src/lib/tutorials');

function getDifficultyRank(difficulty: Tutorial['difficulty']): number {
  switch (difficulty) {
    case 'beginner':
      return 0;
    case 'intermediate':
      return 1;
    case 'advanced':
      return 2;
    default:
      return 99;
  }
}

function getTutorialDirectory(category: string, id: string) {
  const resolved = path.resolve(TUTORIALS_DIR, category, id);
  if (!resolved.startsWith(TUTORIALS_DIR + path.sep)) {
    throw new Error('Invalid tutorial path');
  }
  return resolved;
}

function getLocalizedField(
  value: TutorialConfig['title'] | TutorialConfig['description'],
  locale: Locale,
  fallback?: string
): string {
  if (typeof value === 'object') {
    return value[locale] || value.zh || value.en;
  }

  return locale === 'en' && fallback ? fallback : value;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

function readTextFile(filePath: string): string {
  try {
    if (!fs.existsSync(filePath)) {
      return '';
    }

    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading text file ${filePath}:`, error);
    return '';
  }
}

function listTutorialDirectories(category?: string): TutorialDirectoryEntry[] {
  const baseDir = category ? path.join(TUTORIALS_DIR, category) : TUTORIALS_DIR;

  if (!fs.existsSync(baseDir)) {
    return [];
  }

  if (category) {
    return fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        category,
        tutorialDir: dirent.name,
        fullPath: path.join(baseDir, dirent.name),
      }));
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .flatMap(dirent => {
      const categoryName = dirent.name;
      const categoryDir = path.join(baseDir, categoryName);

      return fs
        .readdirSync(categoryDir, { withFileTypes: true })
        .filter(child => child.isDirectory())
        .map(child => ({
          category: categoryName,
          tutorialDir: child.name,
          fullPath: path.join(categoryDir, child.name),
        }));
    });
}

function normalizeTutorial(config: TutorialConfig, locale: Locale): Tutorial {
  return {
    id: config.id,
    title: getLocalizedField(config.title, locale, config.title_en),
    description: getLocalizedField(config.description, locale, config.description_en),
    difficulty: config.difficulty,
    category: config.category,
    isFree: config.isFree ?? false,
  };
}

function buildTutorialList(entries: TutorialDirectoryEntry[], locale: Locale, groupByCategory: boolean): Tutorial[] {
  const tutorialsWithMeta: TutorialListItem[] = [];

  for (const entry of entries) {
    const configPath = path.join(entry.fullPath, 'config.json');
    const config = readJsonFile<TutorialConfig>(configPath);

    if (!config) {
      continue;
    }

    tutorialsWithMeta.push({
      tutorial: normalizeTutorial(config, locale),
      prerequisitesCount: config.prerequisites?.length ?? 0,
      estimatedTime: config.estimatedTime ?? Number.POSITIVE_INFINITY,
    });
  }

  tutorialsWithMeta.sort((a, b) => {
    if (groupByCategory) {
      const categoryCompare = a.tutorial.category.localeCompare(b.tutorial.category);
      if (categoryCompare !== 0) return categoryCompare;
    }

    const difficultyCompare =
      getDifficultyRank(a.tutorial.difficulty) - getDifficultyRank(b.tutorial.difficulty);
    if (difficultyCompare !== 0) return difficultyCompare;

    const prereqCompare = a.prerequisitesCount - b.prerequisitesCount;
    if (prereqCompare !== 0) return prereqCompare;

    const timeCompare = a.estimatedTime - b.estimatedTime;
    if (timeCompare !== 0) return timeCompare;

    return a.tutorial.id.localeCompare(b.tutorial.id);
  });

  return tutorialsWithMeta.map(item => item.tutorial);
}

export async function getTutorials(locale: Locale): Promise<Tutorial[]> {
  try {
    return buildTutorialList(listTutorialDirectories(), locale, true);
  } catch (error) {
    console.error('Error reading tutorials from file system:', error);
    return [];
  }
}

export async function getTutorialRouteParams(): Promise<TutorialRouteParam[]> {
  try {
    return listTutorialDirectories()
      .map(entry => {
        const config = readJsonFile<TutorialConfig>(path.join(entry.fullPath, 'config.json'));
        if (!config?.id || !config.category) {
          return null;
        }

        return {
          category: config.category,
          id: config.id,
        };
      })
      .filter((value): value is TutorialRouteParam => value !== null)
      .sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        if (categoryCompare !== 0) return categoryCompare;
        return a.id.localeCompare(b.id);
      });
  } catch (error) {
    console.error('Error reading tutorial route params from file system:', error);
    return [];
  }
}

export async function getTutorial(category: string, id: string, locale: Locale): Promise<Tutorial | null> {
  const config = await getTutorialConfig(category, id);

  if (!config) {
    return null;
  }

  return normalizeTutorial(config, locale);
}

export async function getTutorialReadme(category: string, id: string, locale?: Locale): Promise<string> {
  const tutorialDir = getTutorialDirectory(category, id);
  const readmePath =
    locale === 'en' && fs.existsSync(path.join(tutorialDir, 'en-README.md'))
      ? path.join(tutorialDir, 'en-README.md')
      : path.join(tutorialDir, 'zh-README.md');

  return readTextFile(readmePath);
}

export async function getTutorialsByCategory(category: string, locale: Locale): Promise<Tutorial[]> {
  try {
    return buildTutorialList(listTutorialDirectories(category), locale, false);
  } catch (error) {
    console.error(`Error reading tutorials for category ${category}:`, error);
    return [];
  }
}

export async function getTutorialShaders(
  category: string,
  id: string
): Promise<{
  fragment: string;
  vertex: string;
  exercise: string;
}> {
  const tutorialDir = getTutorialDirectory(category, id);

  return {
    fragment: readTextFile(path.join(tutorialDir, 'fragment.glsl')),
    vertex: readTextFile(path.join(tutorialDir, 'vertex.glsl')),
    exercise: readTextFile(path.join(tutorialDir, 'fragment-exercise.glsl')),
  };
}

function stripGlslComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function buildEnglishShaderHeader(config: TutorialConfig | null): string {
  if (!config || typeof config.title !== 'object' || typeof config.description !== 'object') {
    return '/* Tutorial */\n\n';
  }

  const title = config.title.en || config.title.zh;
  const description = config.description.en || config.description.zh;
  const objectives = config.learningObjectives?.en || config.learningObjectives?.zh || [];

  const lines = [`/* ${title}`, '', description];

  if (objectives.length > 0) {
    lines.push('', 'Learning objectives:', ...objectives.map(objective => `- ${objective}`));
  }

  lines.push('*/', '');
  return `${lines.join('\n')}\n`;
}

export async function getTutorialShadersLocalized(
  category: string,
  id: string,
  locale: Locale
): Promise<{
  fragment: string;
  vertex: string;
  exercise: string;
}> {
  const shaders = await getTutorialShaders(category, id);

  if (locale !== 'en') {
    return shaders;
  }

  const config = await getTutorialConfig(category, id);
  const header = buildEnglishShaderHeader(config);
  const normalize = (code: string) => `${header}${stripGlslComments(code).trim()}\n`;

  return {
    fragment: normalize(shaders.fragment),
    vertex: shaders.vertex ? normalize(shaders.vertex) : '',
    exercise: normalize(shaders.exercise || shaders.fragment),
  };
}

export async function getTutorialConfig(category: string, id: string): Promise<TutorialConfig | null> {
  return readJsonFile<TutorialConfig>(path.join(getTutorialDirectory(category, id), 'config.json'));
}

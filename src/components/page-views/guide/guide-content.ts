import source from '../../../../docs/page-development-plans/ai-video-expander-guide.md?raw';
import { normalizeLockedCopy } from '../../../lib/locked-copy';

const document = normalizeLockedCopy(source);

function lockedBlock(name: string): string {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const value = document.split(start)[1]?.split(end)[0]?.trim();
  if (!value) throw new Error(`Guide document is missing the ${name} block`);
  return value;
}

function field(block: string, name: string): string {
  const prefix = `**${name}:** `;
  const fieldText = block.split('\n').find(line => line.startsWith(prefix))?.slice(prefix.length);
  if (!fieldText) throw new Error(`Guide document is missing the ${name} field`);
  return fieldText;
}

function action(block: string, name: string) {
  const [label, href] = field(block, name).split(' -> ');
  if (!href) throw new Error(`Guide action ${name} needs a destination`);
  return { label, href };
}

function heading(block: string, level: number): string {
  const prefix = `${'#'.repeat(level)} `;
  const value = block.split('\n').find(line => line.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`Guide block needs an H${level} heading`);
  return value;
}

function subtopics(block: string) {
  return block.split(/^### /m).slice(1).map(topic => {
    const [title, ...copy] = topic.trim().split('\n');
    return { title, body: copy.join('\n').trim() };
  });
}

const tdk = lockedBlock('tdk');
export const guideMetadata = {
  title: field(tdk, 'Title'),
  description: field(tdk, 'Description'),
  keywords: field(tdk, 'Keywords').split(', '),
};
const json = lockedBlock('json-ld').match(/```json\s*([\s\S]+?)\s*```/)?.[1];
if (!json) throw new Error('Guide JSON-LD code block is missing');
export const guideSchema = JSON.parse(json) as Record<string, unknown>;

const hero = lockedBlock('module:hero');
export const guideHero = {
  title: heading(hero, 1),
  subtitle: field(hero, 'Subtitle'),
  primary: action(hero, 'Primary CTA'),
  secondary: action(hero, 'Secondary CTA'),
};

const sectionIds = [
  'quick-start', 'starting-workflow', 'prepare-inputs', 'configure-sequence',
  'generate-video', 'download-save', 'continue-edit', 'prompt-examples', 'troubleshooting', 'faq',
];

export const guideSections = sectionIds.map(id => {
  const block = lockedBlock(`module:${id}`);
  const title = heading(block, 2);
  return { id, title, topics: subtopics(block), body: block.slice(`## ${title}`.length).trim() };
});

const final = lockedBlock('module:final-cta');
export const guideFinal = {
  title: heading(final, 2),
  body: final.split('\n\n')[1]?.trim() ?? '',
  action: action(final, 'Primary CTA'),
};

const caseLayouts = [
  { sourceRatio: '16/9', ratio: '9/16' },
  { sourceRatio: '9/16', ratio: '16/9' },
  { sourceRatio: '16/9', ratio: '1/1' },
  { sourceRatio: '16/9', ratio: '3/4' },
  { sourceRatio: '16/9', ratio: '21/9' },
];
const cases = subtopics(lockedBlock('module:prompt-examples'));
if (cases.length !== caseLayouts.length) throw new Error('Guide case layout count differs from locked cases');

export const guideCases = cases.map(({ title, body }, index) => {
  const id = `guide-case-${index + 1}`;
  const asset = `/media/guide/${id}`;
  const prompt = body.match(/^\*\*Prompt:\*\* ([\s\S]+)$/m)?.[1];
  if (!prompt) throw new Error(`Guide case ${index + 1} has no locked prompt`);
  return {
    id, title, prompt, startingMaterial: field(body, 'Starting material'), ...caseLayouts[index],
    source: `${asset}-source.mp4`,
    sourcePoster: `${asset}-source.webp`,
    result: `${asset}.mp4`,
    resultPoster: `${asset}.webp`,
  };
});

export const reframeResolutions = ['480p', '768p', '1080p'] as const;
export type ReframeResolution = typeof reframeResolutions[number];

export const reframeRatios = [
  { label: '16:9', name: 'Widescreen', width: 16, height: 9 },
  { label: '9:16', name: 'Vertical', width: 9, height: 16 },
  { label: '1:1', name: 'Square', width: 1, height: 1 },
  { label: '4:3', name: 'Classic landscape', width: 4, height: 3 },
  { label: '3:4', name: 'Portrait', width: 3, height: 4 },
  { label: '21:9', name: 'Ultrawide', width: 21, height: 9 },
  { label: '9:21', name: 'Tall portrait', width: 9, height: 21 },
] as const;
export type ReframeRatio = typeof reframeRatios[number]['label'];

export const maxReframeSeconds = 300;
export const maxReframePromptLength = 50_000;

const creditsPerSecond: Record<ReframeResolution, number> = {
  '480p': 4,
  '768p': 6,
  '1080p': 12,
};

export function reframeCredits(resolution: ReframeResolution, seconds: number) {
  return creditsPerSecond[resolution] * seconds;
}

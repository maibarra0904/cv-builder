import type { SectionConfig } from '../types/cv';

export function getSortedSections(config: SectionConfig): (keyof SectionConfig)[] {
  return Object.keys(config)
    .map(key => key as keyof SectionConfig)
    .sort((a, b) => config[a].order - config[b].order);
}

export function getSortedVisibleSections(config: SectionConfig): (keyof SectionConfig)[] {
  return getSortedSections(config).filter(section => config[section].visible);
}

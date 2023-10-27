const semver = require('semver');
import { Selectors, VersionedSelectors } from './types';
const processSelectors = (
  selectors: Selectors,
  versionedSelectors: VersionedSelectors,
  grafanaVersion: string
): Selectors => {
  const keys = Object.keys(versionedSelectors);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    // @ts-ignore
    const value = versionedSelectors[key];

    if (typeof value === 'object' && Object.keys(value).length > 0 && !semver.valid(Object.keys(value)[0])) {
      // @ts-ignore
      selectors[key] = processSelectors({}, value, grafanaVersion);
    } else {
      if (typeof value === 'object' && Object.keys(value).length > 0 && semver.valid(Object.keys(value)[0])) {
        // @ts-ignore
        const sorted = Object.keys(value).sort(semver.rcompare);
        let validVersion = sorted[0];
        for (let index = 0; index < sorted.length; index++) {
          const version = sorted[index];
          if (semver.gte(grafanaVersion, version)) {
            validVersion = version;
            break;
          }
        }
        // @ts-ignore
        selectors[key] = value[validVersion];
      } else {
        // @ts-ignore
        selectors[key] = value;
      }
    }

    continue;
  }

  return selectors;
};

export const resolveSelectorVersion = (versionedSelectors: VersionedSelectors, version: string): Selectors => {
  const selectors: Selectors = {} as Selectors;
  const s = processSelectors(selectors, versionedSelectors, version);
  return s;
};
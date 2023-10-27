import { promises } from 'fs';
import { resolve as resolvePath } from 'path';
import { parse as parseYml } from 'yaml';

export const readProvision = async <T>(CWD: string, filePath: string): Promise<T> => {
  const path = resolvePath(CWD, 'provisioning', filePath);
  const contents = await promises.readFile(path, 'utf8');
  return parseYml(contents);
};

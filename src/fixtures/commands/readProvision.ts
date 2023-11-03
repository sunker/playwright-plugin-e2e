import { promises } from 'fs';
import { resolve as resolvePath } from 'path';
import { parse as parseYml } from 'yaml';
import { TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../types';
import { PlaywrightCombinedArgs } from './types';
import { ReadProvisionArgs } from '../../types';

type ReadProvisionCommand = TestFixture<
  <T = any>(args: ReadProvisionArgs) => Promise<T>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

export const readProvisionCommand: ReadProvisionCommand = async ({}, use) => {
  await use(async ({ filePath }) => {
    const resolvedPath = resolvePath(process.cwd(), 'provisioning', filePath);
    const contents = await promises.readFile(resolvedPath, 'utf8');
    return parseYml(contents);
  });
};

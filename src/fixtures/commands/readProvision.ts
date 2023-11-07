import { TestFixture } from '@playwright/test';
import { promises } from 'fs';
import { resolve as resolvePath } from 'path';
import { parse as parseYml } from 'yaml';
import { PluginFixture, PluginOptions } from '../../api';
import { ReadProvisionArgs } from '../../types';
import { PlaywrightCombinedArgs } from '../types';

/**
 * Fixture command that reads a the yaml file for a provisioned dashboard
 * or data source and returns it as json.
 */
type ReadProvisionCommand = TestFixture<
  <T = any>(args: ReadProvisionArgs) => Promise<T>,
  PluginFixture & PluginOptions & PlaywrightCombinedArgs
>;

const readProvision: ReadProvisionCommand = async ({}, use) => {
  await use(async ({ filePath }) => {
    const resolvedPath = resolvePath(process.cwd(), 'provisioning', filePath);
    const contents = await promises.readFile(resolvedPath, 'utf8');
    return parseYml(contents);
  });
};

export default readProvision;

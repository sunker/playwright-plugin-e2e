import { TestFixture } from '@playwright/test';
import { PluginFixture, PluginOptions } from '../api';
import { PanelEditPage } from '../models';
import { PlaywrightCombinedArgs } from './types';

type EmptyPanelEditPageFixture = TestFixture<PanelEditPage, PluginFixture & PluginOptions & PlaywrightCombinedArgs>;

const emptyPanelEditPage: EmptyPanelEditPageFixture = async ({ emptyDashboardPage }, use) => {
  const panelEditPage = await emptyDashboardPage.addPanel();
  await use(panelEditPage);
};

export default emptyPanelEditPage;

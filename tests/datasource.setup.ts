import { test as setup, expect } from '@playwright/test';
import randomstring from 'randomstring';

// setup('datasource', async ({ request }) => {
//   const name = `prometheus-${randomstring.generate()}`;
//   const createDsReq = await request.post('/api/datasources', {
//     data: {
//       name,
//       type: 'prometheus',
//       access: 'proxy',
//       isDefault: false,
//     },
//   });
//   expect(createDsReq.ok()).toBeTruthy();

//   // load ds by name
//   const getDsReq = await this.request.get(`/api/datasources/name/${name}`);
//   expect(getDsReq.ok()).toBeTruthy();
//   this.datasourceJson = await getDsReq.json();
// });

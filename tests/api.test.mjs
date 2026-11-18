import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

async function loadApi({ session = { access_token: 'test-token' }, fetch, url = 'http://localhost:3000' }) {
  const source = await readFile(new URL('../src/lib/api.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports, process: { env: { EXPO_PUBLIC_API_URL: url } },
    Error, Promise, AbortController, setTimeout, clearTimeout, fetch,
    require: () => ({ getSupabase: () => ({ auth: { getSession: async () => ({ data: { session }, error: null }) } }) }),
  });
  return module.exports;
}

test('data requests use the Node API with a bearer token', async () => {
  let request;
  const api = await loadApi({ fetch: async (url, options) => { request = { url, options }; return { status: 201, ok: true, json: async () => ({ id: 'trip' }) }; } });
  assert.equal((await api.apiRequest('/api/trips', 'POST', { title: 'Summer' })).id, 'trip');
  assert.equal(request.url, 'http://localhost:3000/api/trips');
  assert.equal(request.options.headers.Authorization, 'Bearer test-token');
  assert.equal(request.options.body, JSON.stringify({ title: 'Summer' }));
});
test('signed-out users cannot send data requests', async () => {
  const api = await loadApi({ session: null, fetch: () => assert.fail('Must not send a request') });
  await assert.rejects(api.apiRequest('/api/trips'), (error) => error.status === 401);
});
test('delete handles empty responses and HTTP errors remain actionable', async () => {
  const api = await loadApi({ fetch: async () => ({ status: 204, ok: true, json: () => assert.fail('No JSON body on 204') }) });
  assert.equal(await api.apiRequest('/api/trips/id', 'DELETE'), undefined);
  const failed = await loadApi({ fetch: async () => ({ status: 404, ok: false, json: async () => ({ error: 'Trip not found.' }) }) });
  await assert.rejects(failed.apiRequest('/api/trips/id'), (error) => error.status === 404 && error.message === 'Trip not found.');
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Load the actual auth modules while replacing only their external client.
// No native runtime, test account, network requests, or new dependencies needed.
async function loadModule(path, dependencies = {}) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports, Error, Promise,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: path });
  return module.exports;
}

const { watchAuthSession } = await loadModule('../src/lib/auth-session.ts');
const flush = () => new Promise((resolve) => setImmediate(resolve));

function sessionFixture() {
  let listener;
  let resolve;
  let reject;
  let unsubscribed = false;
  const initial = new Promise((res, rej) => { resolve = res; reject = rej; });
  const states = [];
  const stop = watchAuthSession({
    onAuthStateChange(callback) {
      listener = callback;
      return { data: { subscription: { unsubscribe: () => { unsubscribed = true; } } } };
    },
    getSession: () => initial,
  }, (state) => states.push(state));
  return { states, stop, emit: (...args) => listener(...args), resolve, reject, isUnsubscribed: () => unsubscribed };
}

test('restores a saved session and finishes loading', async () => {
  const fixture = sessionFixture();
  const session = { user: { id: 'alice' } };
  fixture.resolve({ data: { session }, error: null });
  await flush();
  assert.equal(fixture.states[0].session, session);
  assert.equal(fixture.states[0].isLoading, false);
  assert.equal(fixture.states[0].error, null);
  fixture.stop();
});

test('INITIAL_SESSION cannot hide a restore error', async () => {
  const fixture = sessionFixture();
  const error = new Error('Storage failed');
  fixture.emit('INITIAL_SESSION', null);
  assert.equal(fixture.states.length, 0);
  fixture.resolve({ data: { session: null }, error });
  await flush();
  assert.equal(fixture.states[0].error, error);
  assert.equal(fixture.states[0].session, null);
  fixture.emit('INITIAL_SESSION', null);
  assert.equal(fixture.states.length, 1);
  fixture.stop();
});

test('a signed-in event wins over an older session read', async () => {
  const fixture = sessionFixture();
  const session = { user: { id: 'alice' } };
  fixture.emit('SIGNED_IN', session);
  fixture.resolve({ data: { session: null }, error: null });
  await flush();
  assert.equal(fixture.states.length, 1);
  assert.equal(fixture.states[0].session, session);
  fixture.stop();
});

test('a late restoration failure cannot overwrite a newer login', async () => {
  const fixture = sessionFixture();
  const session = { user: { id: 'alice' } };
  fixture.emit('SIGNED_IN', session);
  fixture.reject(new Error('Old request failed'));
  await flush();
  assert.equal(fixture.states.length, 1);
  assert.equal(fixture.states[0].error, null);
  fixture.stop();
});

test('refresh and sign-out events update the session', async () => {
  const fixture = sessionFixture();
  const refreshed = { user: { id: 'alice' }, access_token: 'test-only-token' };
  fixture.emit('TOKEN_REFRESHED', refreshed);
  fixture.emit('SIGNED_OUT', null);
  fixture.resolve({ data: { session: refreshed }, error: null });
  await flush();
  assert.equal(fixture.states[0].session, refreshed);
  assert.equal(fixture.states[1].session, null);
  assert.equal(fixture.states.length, 2);
  fixture.stop();
});

test('unmount unsubscribes and suppresses pending results and events', async () => {
  const fixture = sessionFixture();
  fixture.stop();
  fixture.emit('SIGNED_IN', { user: { id: 'alice' } });
  fixture.resolve({ data: { session: null }, error: null });
  await flush();
  assert.equal(fixture.isUnsubscribed(), true);
  assert.equal(fixture.states.length, 0);
});

test('a rejected session read ends loading with a recoverable error', async () => {
  const fixture = sessionFixture();
  const error = new Error('Unable to read storage');
  fixture.reject(error);
  await flush();
  assert.equal(fixture.states[0].isLoading, false);
  assert.equal(fixture.states[0].error, error);
  fixture.stop();
});

test('auth services send trimmed email and the original password', async () => {
  const requests = [];
  const data = { session: { user: { id: 'alice' } } };
  const client = { auth: {
    signInWithPassword: async (input) => { requests.push(input); return { data, error: null }; },
    signUp: async (input) => { requests.push(input); return { data: { session: null }, error: null }; },
    signOut: async () => ({ error: null }),
  } };
  const auth = await loadModule('../src/services/auth.ts', { '@/lib/supabase': { getSupabase: () => client } });
  assert.equal(await auth.signIn('  alice@example.com ', ' secret '), data);
  assert.equal(requests[0].email, 'alice@example.com');
  assert.equal(requests[0].password, ' secret ');
  assert.equal((await auth.signUp('  alice@example.com ', ' secret ')).session, null);
  assert.equal(requests[1].email, 'alice@example.com');
  assert.equal(requests[1].password, ' secret ');
  await auth.signOut();
});

test('auth services propagate rejected credentials and sign-out errors', async () => {
  const error = new Error('Auth request failed');
  const failure = async () => ({ data: null, error });
  const auth = await loadModule('../src/services/auth.ts', {
    '@/lib/supabase': { getSupabase: () => ({ auth: { signInWithPassword: failure, signUp: failure, signOut: failure } }) },
  });
  await assert.rejects(auth.signIn('alice@example.com', 'wrong'), (cause) => cause === error);
  await assert.rejects(auth.signUp('alice@example.com', 'weak'), (cause) => cause === error);
  await assert.rejects(auth.signOut(), (cause) => cause === error);
});

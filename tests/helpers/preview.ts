import { build, preview } from 'astro';
import { repositoryRoot } from '../../scripts/local.ts';

export async function startPreview() {
  await build({ root: repositoryRoot, logLevel: 'error' });
  const server = await preview({
    root: repositoryRoot,
    server: { host: '127.0.0.1', port: 0 },
    logLevel: 'error',
  });
  const base = process.env['BASE_PATH'] ?? '/favicon-forge';
  return {
    url: `http://127.0.0.1:${String(server.port)}${base.replace(/\/$/, '')}/`,
    stop: () => server.stop(),
  };
}

import assert from 'node:assert/strict';
import test from 'node:test';
import { main } from '../../src/index.js';
import { default as graphqlCodegen } from '../../src/plugins/graphql-codegen/index.js';
import { resolve, join } from '../../src/util/path.js';
import baseArguments from '../helpers/baseArguments.js';
import baseCounters from '../helpers/baseCounters.js';
import { buildOptions } from '../helpers/index.js';

const cwd = resolve('fixtures/plugins/graphql-codegen');
const options = buildOptions(cwd);

test('Find dependencies in graphql-codegen configuration (json)', async () => {
  const configFilePath = join(cwd, 'package.json');
  const dependencies = await graphqlCodegen.findDependencies(configFilePath, options);
  assert.deepEqual(dependencies, ['@graphql-codegen/client-preset']);
});

test('Find dependencies in graphql-codegen configuration (codegen.ts)', async () => {
  const configFilePath = join(cwd, 'codegen.ts');
  const dependencies = await graphqlCodegen.findDependencies(configFilePath, options);
  assert.deepEqual(dependencies, [
    '@graphql-codegen/near-operation-file-preset',
    '@graphql-codegen/schema-ast',
    '@graphql-codegen/introspection',
    '@graphql-codegen/typescript',
    '@graphql-codegen/typescript-operations',
    '@graphql-codegen/typescript-urql',
    '@graphql-codegen/typescript-operations',
    '@graphql-codegen/typescript-msw',
  ]);
});

test('Find dependencies in graphql-codegen configuration (codegen.yaml)', async () => {
  const configFilePath = join(cwd, 'codegen.yaml');
  const dependencies = await graphqlCodegen.findDependencies(configFilePath, options);
  assert.deepEqual(dependencies, [
    '@graphql-codegen/typescript',
    '@graphql-codegen/typescript-operations',
    '@graphql-codegen/typed-document-node',
    'entry:./codegen/UserErrorsPlugin.cjs',
    '@graphql-codegen/typescript',
    '@graphql-codegen/typescript-resolvers',
    'entry:./codegen/UserErrorsPlugin.cjs',
    'entry:./codegen/GraphQLResolverBuilderPlugin.cjs',
  ]);
});

test('Find dependencies in graphql-codegen configuration (codegen.ts function)', async () => {
  const { issues, counters } = await main({
    ...baseArguments,
    cwd,
  });

  assert(issues.unlisted['codegen.ts']['@graphql-codegen/near-operation-file-preset']);
  assert(issues.unlisted['codegen.ts']['@graphql-codegen/schema-ast']);
  assert(issues.unlisted['codegen.ts']['@graphql-codegen/introspection']);
  assert(issues.unlisted['codegen.ts']['@graphql-codegen/typescript']);
  assert(issues.unlisted['codegen.ts']['@graphql-codegen/typescript-operations']);
  assert(issues.unlisted['codegen.ts']['@graphql-codegen/typescript-urql']);
  assert(issues.unlisted['codegen.ts']['@graphql-codegen/typescript-msw']);

  // TODO split in separate fixtures/dirs
  assert(issues.unlisted['codegen.yaml']['@graphql-codegen/typescript']);
  assert(issues.unlisted['codegen.yaml']['@graphql-codegen/typescript-operations']);
  assert(issues.unlisted['codegen.yaml']['@graphql-codegen/typed-document-node']);
  assert(issues.unlisted['codegen.yaml']['@graphql-codegen/typescript-resolvers']);
  assert(issues.unlisted['package.json']['@graphql-codegen/client-preset']);

  assert.deepEqual(counters, {
    ...baseCounters,
    unlisted: 12,
    devDependencies: 1,
    processed: 1,
    total: 1,
  });
});

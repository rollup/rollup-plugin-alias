import test from 'ava';
import path from 'path';
import { rollup } from 'rollup';
import alias from '../dist/rollup-plugin-alias';
import slash from 'slash';

const normalizeId = id => slash(id);

test(t => {
  t.is(typeof alias, 'function');
});

test(t => {
  const result = alias();
  t.is(typeof result, 'object');
  t.is(typeof result.resolveId, 'function');
});

test(t => {
  const result = alias({});
  t.is(typeof result, 'object');
  t.is(typeof result.resolveId, 'function');
});

test('Simple aliasing', t => {
  const result = alias({
    foo: 'bar',
    pony: 'paradise',
    './local': 'global',
  });

  const resolved = result.resolveId('foo', path.resolve('/src/importer.js'));
  const resolved2 = result.resolveId('pony', path.resolve('/src/importer.js'));
  const resolved3 = result.resolveId('./local', path.resolve('/src/importer.js'));

  t.is(resolved, 'bar');
  t.is(resolved2, 'paradise');
  t.is(resolved3, 'global');
});

test('Will not confuse modules with similar names', t => {
  const result = alias({
    foo: 'bar',
    './foo': 'bar',
  });

  const resolved = result.resolveId('foo2', path.resolve('/src/importer.js'));
  const resolved2 = result.resolveId('./fooze/bar', path.resolve('/src/importer.js'));
  const resolved3 = result.resolveId('./someFile.foo', path.resolve('/src/importer.js'));

  t.is(resolved, null);
  t.is(resolved2, null);
  t.is(resolved3, null);
});

test('Local aliasing with POSIX path', t => {
  const result = alias({
    foo: './bar',
    pony: './par/a/di/se',
  });

  const resolved = result.resolveId('foo', path.resolve('/src/importer.js'));
  const resolved2 = result.resolveId('foo/baz', path.resolve('/src/importer.js'));
  const resolved3 = result.resolveId('foo/baz.js', path.resolve('/src/importer.js'));
  const resolved4 = result.resolveId('pony', path.resolve('/src/highly/nested/importer.js'));

  t.is(resolved, normalizeId(path.resolve('/src/bar.js')));
  t.is(resolved2, normalizeId(path.resolve('/src/bar/baz.js')));
  t.is(resolved3, normalizeId(path.resolve('/src/bar/baz.js')));
  t.is(resolved4, normalizeId(path.resolve('/src/highly/nested/par/a/di/se.js')));
});

test('Local aliasing with Windows path', t => {
  const result = alias({
    foo: '.\\bar',
    pony: '.\\par\\a\\di\\se',
  });

  const resolved = result.resolveId('foo', path.resolve('/src/importer.js'));
  const resolved2 = result.resolveId('foo/baz', path.resolve('/src/importer.js'));
  const resolved3 = result.resolveId('foo/baz.js', path.resolve('/src/importer.js'));
  const resolved4 = result.resolveId('pony', path.resolve('/src/highly/nested/importer.js'));

  t.is(resolved, normalizeId(path.resolve('/src/bar.js')));
  t.is(resolved2, normalizeId(path.resolve('/src/bar/baz.js')));
  t.is(resolved3, normalizeId(path.resolve('/src/bar/baz.js')));
  t.is(resolved4, normalizeId(path.resolve('/src/highly/nested/par/a/di/se.js')));
});

test('Absolute local aliasing', t => {
  const result = alias({
    foo: path.resolve('/bar'),
    pony: path.resolve('/par/a/di/se.js'),
  });

  const resolved = result.resolveId('foo', path.resolve('/src/importer.js'));
  const resolved2 = result.resolveId('foo/baz', path.resolve('/src/importer.js'));
  const resolved3 = result.resolveId('foo/baz.js', path.resolve('/src/importer.js'));
  const resolved4 = result.resolveId('pony', path.resolve('/src/highly/nested/importer.js'));

  t.is(resolved, normalizeId(path.resolve('/bar.js')));
  t.is(resolved2, normalizeId(path.resolve('/bar/baz.js')));
  t.is(resolved3, normalizeId(path.resolve('/bar/baz.js')));
  t.is(resolved4, normalizeId(path.resolve('/par/a/di/se.js')));
});

test('Test for the resolve property', t => {
  const result = alias({
    ember: './folder/hipster',
    resolve: ['.js', '.jsx'],
  });

  const resolved = result.resolveId('ember', path.resolve(__dirname, './files/index.js'));

  t.is(resolved, normalizeId(path.resolve(__dirname, './files/folder/hipster.jsx')));
});

test(t => {
  const result = alias({
    resolve: 'i/am/a/file',
  });

  const resolved = result.resolveId('resolve', path.resolve('/src/import.js'));

  t.is(resolved, 'i/am/a/file');
});

test(t => {
  const result = alias({
    resolve: './i/am/a/local/file',
  });

  const resolved = result.resolveId('resolve', path.resolve(__dirname, './files/index.js'));

  t.is(resolved, normalizeId(path.resolve(__dirname, './files/i/am/a/local/file.js')));
});

// Tests in Rollup
test(t =>
  rollup({
    entry: './files/index.js',
    plugins: [alias({
      fancyNumber: './aliasMe',
      './anotherFancyNumber': './localAliasMe',
      numberFolder: './folder',
      './numberFolder': './folder',
    })],
  }).then(stats => {
    t.is(stats.modules[0].id, normalizeId(path.resolve('./files/nonAliased.js')));
    t.is(stats.modules[1].id, normalizeId(path.resolve('./files/aliasMe.js')));
    t.is(stats.modules[2].id, normalizeId(path.resolve('./files/localAliasMe.js')));
    t.is(stats.modules[3].id, normalizeId(path.resolve('./files/folder/anotherNumber.js')));
    t.is(stats.modules[4].id, normalizeId(path.resolve('./files/index.js')));
    t.is(stats.modules.length, 5);
  })
);

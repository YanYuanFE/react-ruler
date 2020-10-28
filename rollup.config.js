import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/components/ruler/index.js',
    external: ['react', 'react-dom'],
    output: [{
        name: 'Ruler',
        format: 'es',
        file: 'es/index.js',
        globals: {
            react: 'React',
        },
    }, {
        name: 'Ruler',
        format: 'umd',
        file: 'lib/index.js',
        globals: {
            react: 'React',
        },
    }],
    plugins: [
        resolve(),
        babel({
            exclude: '**/node_modules/**',
            runtimeHelpers: true
        }),
        commonjs(),
        postcss({
            extract: true,
            extensions: ['.less']
        })
    ]
}

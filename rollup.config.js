import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';

export default {
    moduleName: 'Ruler',
    input: 'src/components/ruler/index.js',
    external: ['react', 'react-dom', 'prop-types'],
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes',
    },
    output: [{
        name: 'Ruler',
        format: 'es',
        file: 'es/index.js'
    }, {
        name: 'Ruler',
        format: 'umd',
        file: 'lib/index.js'
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
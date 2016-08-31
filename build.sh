# browserify ./components/vote-form.jsx -o ./public/js/bundle.js -t [ babelify --presets [ es2015 react ] ]
watchify ./lib/components/index.jsx -o ./public/js/bundle.js -t [ babelify --presets [ es2015 react ] ] --verbose

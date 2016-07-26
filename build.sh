# browserify ./components/vote-form.jsx -o ./public/js/bundle.js -t [ babelify --presets [ es2015 react ] ]
watchify ./app/components/index.jsx -o ./app/public/js/bundle.js -t [ babelify --presets [ es2015 react ] ] --verbose

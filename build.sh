# browserify ./components/vote-form.jsx -o ./public/js/bundle.js -t [ babelify --presets [ es2015 react ] ]
watchify ./components/vote-iframe.jsx -o ./public/js/bundle.js -t [ babelify --presets [ es2015 react ] ] --verbose

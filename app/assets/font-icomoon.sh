#!/bin/sh

case "$1" in
	"s") #only show icons in currently build
		echo "Your icons in this build:"
		cat ./fonts/icomoon/demo.html | grep 'icon icon-*' ;;
	*)
		echo "Preparing font asset from icomoon..."
		echo "\nYour icons in this build:"
		cat ./fonts/icomoon/demo.html | grep 'icon icon-*'

		echo "\nIf you want to change font set, please go to icomoon.io, import selection.json file and download zip package again."

		rm -rf ../../mockup/css/fonts
		rm -rf ../../public/css/fonts

		rm ../../mockup/css/icomoon-font.css
		rm ../../public/css/icomoon-font.css

		mkdir ../../mockup/css/fonts
		mkdir ../../public/css/fonts

		cp ./fonts/icomoon/style.css ../../mockup/css/icomoon-font.css
		cp ./fonts/icomoon/style.css ../../public/css/icomoon-font.css


		cp ./fonts/icomoon/fonts/* ../../mockup/css/fonts
		cp ./fonts/icomoon/fonts/* ../../public/css/fonts

esac

# rm -rf ./fonts/icomoon

./node_modules/.bin/biome.exe lint --write
./node_modules/.bin/biome.exe format --write
git commit -am "Format & Lint Code - format.ps1 w/ biome - $(date)"
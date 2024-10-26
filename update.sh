git fetch --all
git reset --hard origin/main
bun install
pm2 flush 0
pm2 restart 0
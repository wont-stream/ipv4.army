---
title: Vitepress and Rolldown
---

Soooooo, I noticed I had some sluggish builds on my VPS while building etc, so I did a quick google search, and found they have [experimental support](https://vite.dev/guide/rolldown) for [Rolldown](https://github.com/rolldown/rolldown). I figured, why not give it a shot?

I ran `bun docs:build` before making any changes, and got a build time of `4.35s` on my computer, and `8.12s` on my VPS.

So, I added the override to my `package.json`:

```json
{
	"overrides": {
		"vite": "npm:rolldown-vite@latest"
	}
}
```

And then I ran `bun install` to make sure it was installed, and then I ran `bun docs:build` to build my site.

`1.37s` on my computer, and `4.45s` on my VPS.

May not seem like a lot, but when I restart my container to update my site, that's still a good chunk of downtime saved.
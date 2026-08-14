// Cloudflare Workers environment bindings
// DB is the D1 database binding declared in wrangler.jsonc
interface CloudflareEnv {
  DB: D1Database;
}

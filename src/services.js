export const SERVICES = [
  { id: "openwebui", name: "Open WebUI", subdomain: "openwebui", port: 7000, desc: "Chat with local and hosted AI models from a browser, including shared conversations and user accounts." },
  { id: "comfyui", name: "ComfyUI", subdomain: "comfyui", port: 7001, desc: "Build image-generation workflows visually with nodes, models, prompts, and reusable pipelines." },
  { id: "openclaw", name: "OpenClaw", subdomain: "openclaw", port: 7002, desc: "Run a self-hosted AI assistant that can coordinate tasks across messaging and automation channels." },
  { id: "actualbudget", name: "Actual Budget", subdomain: "actualbudget", port: 8000, desc: "Track spending, budgets, accounts, and syncable household finance data in a local-first app." },
  { id: "audiobookshelf", name: "Audiobookshelf", subdomain: "audiobookshelf", port: 8001, desc: "Host audiobooks and podcasts with library browsing, listening progress, and mobile app support." },
  { id: "memos", name: "Memos", subdomain: "memos", port: 8002, desc: "Capture quick thoughts, notes, and ideas in a lightweight, markdown-supported memo system." },
  { id: "linkwarden", name: "Linkwarden", subdomain: "linkwarden", port: 8003, desc: "Save, organize, and share bookmarks and links with tags, collections, and collaborative access." },
  { id: "excalidraw", name: "Excalidraw", subdomain: "excalidraw", port: 8004, desc: "Sketch diagrams, wireframes, and whiteboard ideas in a collaborative hand-drawn style canvas." },
  { id: "ferdium", name: "Ferdium", subdomain: "ferdium", port: 8005, desc: "Collect web-based chat, email, and workspace apps into one managed desktop-style hub." },
  { id: "forgejo", name: "Forgejo", subdomain: "forgejo", port: 8006, desc: "Host Git repositories with pull requests, issues, package publishing, and project collaboration tools." },
  { id: "librephoto", name: "LibrePhotos", subdomain: "librephoto", port: 8007, desc: "Organize photo libraries with albums, timelines, search, face recognition, and automatic tagging." },
  { id: "jellyfin", name: "Jellyfin", subdomain: "jellyfin", port: 8008, desc: "Stream movies, shows, music, and other media from your own server to supported devices." },
  { id: "kavita", name: "Kavita", subdomain: "kavita", port: 8009, desc: "Read and manage manga, comics, ebooks, and serial libraries through a web reader." },
  { id: "navidrome", name: "Navidrome", subdomain: "navidrome", port: 8010, desc: "Stream a personal music library through the web or any Subsonic-compatible music client." },
  { id: "nextcloud", name: "Nextcloud", subdomain: "nextcloud", port: 8011, desc: "Sync and share files, calendars, contacts, notes, and collaboration apps from your own cloud." },
  { id: "paperless", name: "paperless-ngx", subdomain: "paperless", port: 8012, desc: "Archive scanned and uploaded documents with OCR, tags, correspondents, and full-text search." },
  { id: "bentopdf", name: "Bento PDF", subdomain: "bentopdf", port: 8013, desc: "Edit, split, merge, and prepare PDFs locally in the browser without uploading documents." },
  { id: "vaultwarden", name: "Vaultwarden", subdomain: "vaultwarden", port: 8014, desc: "Store passwords, passkeys, and secrets in a lightweight server compatible with Bitwarden clients." },
  { id: "trilium", name: "Trilium", subdomain: "trilium", port: 8015, desc: "Build a hierarchical knowledge base with rich text notes, scripting, and cross-referencing in a self-hosted app." },
  { id: "freshrss", name: "FreshRSS", subdomain: "freshrss", port: 8017, desc: "Aggregate and read RSS/Atom feeds with labels, filters, and multi-user support from a self-hosted reader." },
];

export const DOMAIN_SUFFIX = ".home.dx4956s.dev";

export function serviceDomainUrl(subdomain) {
  return `https://${subdomain}${DOMAIN_SUFFIX}`;
}



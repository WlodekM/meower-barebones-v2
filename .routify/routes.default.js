

export default {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes/_module.svelte",
    "dir": "src/routes",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "asyncModule": () => import('../src/routes/_module.svelte'),
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default_credits_svelte",
      "name": "credits",
      "file": {
        "path": "src/routes/credits.svelte",
        "dir": "src/routes",
        "base": "credits.svelte",
        "ext": ".svelte",
        "name": "credits"
      },
      "asyncModule": () => import('../src/routes/credits.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_home_svelte",
      "name": "home",
      "file": {
        "path": "src/routes/home.svelte",
        "dir": "src/routes",
        "base": "home.svelte",
        "ext": ".svelte",
        "name": "home"
      },
      "asyncModule": () => import('../src/routes/home.svelte'),
      "children": []
    },
    {
      "meta": {
        "isDefault": true
      },
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "asyncModule": () => import('../src/routes/index.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_login_svelte",
      "name": "login",
      "file": {
        "path": "src/routes/login.svelte",
        "dir": "src/routes",
        "base": "login.svelte",
        "ext": ".svelte",
        "name": "login"
      },
      "asyncModule": () => import('../src/routes/login.svelte'),
      "children": []
    },
    {
      "meta": {
        "dynamic": true,
        "dynamicSpread": true,
        "order": false,
        "inline": false
      },
      "name": "[...404]",
      "file": {
        "path": ".routify/components/[...404].svelte",
        "dir": ".routify/components",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('./components/[...404].svelte'),
      "children": []
    }
  ]
}
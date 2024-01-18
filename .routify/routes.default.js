

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
      "id": "_default_chats",
      "name": "chats",
      "module": false,
      "file": {
        "path": "src/routes/chats",
        "dir": "src/routes",
        "base": "chats",
        "ext": "",
        "name": "chats"
      },
      "children": [
        {
          "meta": {
            "dynamic": true,
            "order": false
          },
          "id": "_default_chats__chatid__svelte",
          "name": "[chatid]",
          "file": {
            "path": "src/routes/chats/[chatid].svelte",
            "dir": "src/routes/chats",
            "base": "[chatid].svelte",
            "ext": ".svelte",
            "name": "[chatid]"
          },
          "asyncModule": () => import('../src/routes/chats/[chatid].svelte'),
          "children": []
        },
        {
          "meta": {
            "isDefault": true
          },
          "id": "_default_chats_index_svelte",
          "name": "index",
          "file": {
            "path": "src/routes/chats/index.svelte",
            "dir": "src/routes/chats",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "asyncModule": () => import('../src/routes/chats/index.svelte'),
          "children": []
        }
      ]
    },
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
      "meta": {},
      "id": "_default_logout_svelte",
      "name": "logout",
      "file": {
        "path": "src/routes/logout.svelte",
        "dir": "src/routes",
        "base": "logout.svelte",
        "ext": ".svelte",
        "name": "logout"
      },
      "asyncModule": () => import('../src/routes/logout.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_users",
      "name": "users",
      "module": false,
      "file": {
        "path": "src/routes/users",
        "dir": "src/routes",
        "base": "users",
        "ext": "",
        "name": "users"
      },
      "children": [
        {
          "meta": {
            "dynamic": true,
            "order": false
          },
          "id": "_default_users__username__svelte",
          "name": "[username]",
          "file": {
            "path": "src/routes/users/[username].svelte",
            "dir": "src/routes/users",
            "base": "[username].svelte",
            "ext": ".svelte",
            "name": "[username]"
          },
          "asyncModule": () => import('../src/routes/users/[username].svelte'),
          "children": []
        }
      ]
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
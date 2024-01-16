import App from './App.svelte'

new App({
    target: document.body,
    // hydrate: import.meta.env.ROUTIFY_SSR_DISABLE, //hydration causes error on build
})

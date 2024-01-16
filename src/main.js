import App from './App.svelte'

new App({
    target: document.body,
    hydrate: import.meta.env.ROUTIFY_SSR_ENABLE, //hydration causes error on build but is needed for propper build
})

<script>
    import { Router, createRouter } from '@roxi/routify'
    import { Base64 } from './lib/b64.js'
    import routes from '../.routify/routes.default.js'
    export const router = createRouter({ routes })
    //@ts-ignore
    window.mixins = []

    if(localStorage.getItem("plugin")) {
        try {
            eval(Base64._utf8_decode(localStorage.getItem("plugin")))
        } catch (error) {
            console.error("Error when loading plugin(s)", error)
        }
    }
</script>

<Router {router} />

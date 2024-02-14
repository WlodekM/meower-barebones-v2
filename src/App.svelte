<script>
    import { Router, createRouter } from '@roxi/routify'
    import routes from '../.routify/routes.default.js'
    export const router = createRouter({ routes })
    //@ts-ignore
    window.mixins = []
</script>

<Router {router} />

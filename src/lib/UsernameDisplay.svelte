<script>
    import { ulist } from "@/lib/stores.js";
    export let member;
    export let showOnline = true
</script>
<a href="/users/{member}">
    <span style="color: {showOnline ? $ulist?.includes(member) ? "limegreen" : "gray" : "inherit"};">{member}</span>
</a>
<script>
    import { ulist } from "@/lib/stores.js";
    export let member;
</script>
<span style="color: {$ulist?.includes(member) ? "limegreen" : "gray"};">{member}</span>
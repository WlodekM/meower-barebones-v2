<script>
    import { goto } from "@roxi/routify"
    import { isLoggedIn, isGuest, user, authHeader, chats } from "@/lib/stores.js"
    import { linkUrl, apiUrl } from "@/lib/urls.js";
    let username, token
    let status = ""
    let passwordShown = false
    $: type = passwordShown ? 'text' : 'token'
    async function doLogin(username, token, cb) {
        status = "Logging in"
        localStorage.setItem("meower_savedusername", username);
        localStorage.setItem("meower_savedtoken", token);
        $authHeader = {
            username: username,
            token: token
        }
        let res = await fetch(`${apiUrl}/users/${username}`,
        {
            headers: $authHeader,
        })
        const json = await res.json() ?? {
            name: null,
            flags: 0,
            permissions: 0,
            unread_inbox: false,
            theme: "orange",
            mode: true,
            sfx: true,
            bgm: false,
            bgm_song: 2,
            debug: false,
            hide_blocked_users: false,
            favorited_chats: [],
            embeds_enabled: true,
            pfp_data: 1,
            quote: "",
            ban: {
                state: "None",
                expires: 0,
                reason: "",
            },
            xss: false,
            whitelist_enabled: true,
            layout: {css: ""}
        }
        if(!json.name && json._id) {
            json.name = json._id
        }
        function isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        if(isJsonString(json.layout)) {
            json.layout = JSON.parse(json.layout)
        } else {
            json.layout = {css: ""}
        }
        $user = json
    
        const resp = await fetch(`${apiUrl}/chats?autoget=1`, {
            headers: $authHeader,
        });
        const json2 = await resp.json();
        chats.set(json2.autoget);
        //@ts-ignore
        if (window.mixins) {
            //@ts-ignore
            if (!window.mixins) window.mixins = []
            //@ts-ignore
            window.mixins.forEach(mixin => {
                if(mixin.type == "onLogin") {
                    mixin.function()
                }
            });
        }
        cb()
    }
</script>

<div class="center-vert" style="height: 100vh;">
    <div class="container center" style="max-width: 400px;">
        <div class="title">
            Login using token
        </div>
        <form class="form left" style="width: 100%;" id="loginForm" on:submit={async (e)=>{
            e.preventDefault();
            if (!username) return
            $isGuest = !token
            $isLoggedIn = true
            if (!$isGuest) {
                doLogin(username, token, function() {
                    status = ""
                    $goto("/")
                })
            } else {
                status = "Guests users are no longer supported"
                return
            }
        }}>
            <div class="form-section">
                <span>
                    Username:
                </span>
                <input type="text" name="username" id="username" bind:value={username}>
            </div>
            <div class="form-section">
                <span>
                    Token:
                </span>
                <input { type } name="token" id="token" on:input={(event)=>{
                    //@ts-ignore
                    token = event.target.value
                    }}>
            </div>
            <div class="form-section">
                <span style="text-align: left!important;">
                    Show token
                </span>
                <input type="checkbox" name="Show token" id="showpass" bind:checked={passwordShown}>
            </div>
            <input type="submit" value="Log in"> or <button on:click={$goto("/signup")} disabled title="Currently unavailable">Sign up</button>
            <br>
            {#key status}
                {status}
            {/key}
        </form>
    </div>
</div>
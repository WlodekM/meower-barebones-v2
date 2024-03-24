<script>
    import { sendCmd, link, connected, meowerRequest } from "@/lib/clm"
    import { linkUrl } from "@/lib/urls.js";
    import { goto } from "@roxi/routify"
    import { isLoggedIn, isGuest, user, authHeader } from "@/lib/stores.js"
    import { onMount } from "svelte"
    let username, password
    let status = ""
    let passwordShown = false
    $: type = passwordShown ? 'text' : 'password'
    async function doLogin(username, password, cb) {
        status = "Logging in"
        localStorage.setItem("meower_savedusername", username);
        localStorage.setItem("meower_savedpassword", password);
        try {
            await meowerRequest({
            "cmd": "direct",
            "val": {
                cmd: "authpswd",
                val: {
                    "username": username,
                    "pswd": password,
                },
            }
        })
        } catch (statusCode) {
            switch (statusCode) {
                case "E:103 | ID not found":
                    status = "Invalid username!";
                    return;
                case "E:025 | Deleted":
                    status = "This account has been deleted!";
                    return;
                case "I:011 | Invalid Password":
                    status = "Invalid password!";
                    return;
                case "E:018 | Account Banned":
                    status = "";
                    return;
                case "E:019 | Illegal characters detected":
                    status =
                        "Usernames must not have spaces or other special characters!";
                    return;
                case "E:106 | Too many requests":
                    status = "Too many requests! Please try again later.";
                    return;
                default:
                    status = `Uncaught  error!`
            }
        }
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
        let res = await fetch(`https://api.meower.org/users/${username}`,
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
        cb()
    }
    onMount(()=>{
        if(link.ws.CLOSED || link.ws.CONNECTING) {
            link.once("connected", ()=>{
                if (
                    localStorage.getItem("meower_savedusername") &&
                    localStorage.getItem("meower_savedpassword")
                ) {
                    doLogin(localStorage.getItem("meower_savedusername"), localStorage.getItem("meower_savedpassword"), function() {
                        $isLoggedIn = true
                        status = ""
                        $goto("/")
                    })
                }
            })
        } else {
            if (
                localStorage.getItem("meower_savedusername") &&
                localStorage.getItem("meower_savedpassword")
            ) {
                doLogin(localStorage.getItem("meower_savedusername"), localStorage.getItem("meower_savedpassword"), function() {
                    $isLoggedIn = true
                    status = ""
                    $goto("/")
                })
            }
        }
    })
</script>

<div class="center-vert" style="height: 100vh;">
    <div class="container center" style="max-width: 400px;">
        <div class="title">
            Login
        </div>
        <form class="form left" style="width: 100%;" id="loginForm" on:submit={async (e)=>{
            e.preventDefault();
            if (!username) return
            $isGuest = !password
            $isLoggedIn = true
            if (!$isGuest) {
                doLogin(username, password, function() {
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
                    Password <i>(optional)</i>:
                </span>
                <input { type } name="password" id="password" on:input={(event)=>{
                    //@ts-ignore
                    password = event.target.value
                    }}>
            </div>
            <div class="form-section">
                <span style="text-align: left!important;">
                    Show password
                </span>
                <input type="checkbox" name="Show password" id="showpass" bind:checked={passwordShown}>
            </div>
            <input type="submit" value="Log in"> or <button on:click={$goto("/signup")} disabled title="Currently unavailable">Sign up</button>
            <br>
            {#key status}
                {status}
            {/key}
        </form>
    </div>
</div>
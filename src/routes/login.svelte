<script>
    import { sendCmd } from "@/lib/clm"
    import { goto } from "@roxi/routify"
    import { isLoggedIn, isGuest, user } from "@/lib/stores.js"
    let username, password
    let passwordShown = false
    $: type = passwordShown ? 'text' : 'password'
</script>

<div class="center-vert" style="height: 100vh;">
    <div class="container center" style="max-width: 400px;">
        <div class="title">
            Login
        </div>
        <form class="form left" style="width: 100%;" id="loginForm" on:submit={async (e)=>{
            e.preventDefault();
            if (!username) return
            // let res = await fetch("https://api.meower.org/users/${username}")
            // const json = res.json() ?? {}
            // $user = json
            $isGuest = !password
            $isLoggedIn = true
            if (!$isGuest) {
                sendCmd("authpswd", {
                    "username": username,
                    "pswd": password,
                })
                $goto("/")
            } else {
                $isLoggedIn = true
                $goto("/")
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
            <input type="submit" value="Log in">
        </form>
    </div>
</div>
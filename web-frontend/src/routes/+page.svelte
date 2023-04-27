<script>
    import News from '$component/News.svelte'
    import Links from "$component/Links.svelte";
    import Header from "$component/Header.svelte";
</script>


<Header>MassBank Europe</Header>
<div></div>
<div class="pure-g">
    <div class="pure-u-1-2"><img class="pure-img" id="logo" src="images/logo.svg"></div>
    <div class="pure-u-1-2">
        <div class="pure-g">
            <div class="pure-u-1-5"></div>
            <div class="pure-u-3-5 link"><a class="pure-menu-link" href="/search">&gt;&gt; Search Spectra</a></div>
        </div>
        <div class="pure-g">
            <div class="pure-u-2-5"></div>
            <div class="pure-u-2-5 link"><a class="pure-menu-link" href="/about">&gt;&gt; Learn More</a></div>
        </div>
    </div>
</div>

<News></News>
<Links></Links>


<style>
    #logo {
        padding: 1em;
    }

    .link {
        margin: 0.5em;
        padding: 0.1em 1em;
        background: lightsalmon;
    }
</style>

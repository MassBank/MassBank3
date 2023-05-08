<script>
    import MainNav from '$component/MainNav.svelte'
    import MainFoot from "$component/MainFoot.svelte"
    import Logos from "$component/Logos.svelte";
    import Header from "$lib/components/Header.svelte";
    import { page } from '$app/stores';
    import 'purecss';
    import '../app.css'
</script>
<div class="head">
    <MainNav></MainNav>
    <Header>{$page.data.title}</Header>
</div>
<div class="main"><slot></slot></div>
<div class="foot">
<MainFoot></MainFoot>
<Logos></Logos>
</div>

<style>
    .head, .foot{
        width: 100%;
        background: #eeeeee;
        padding: 10px 0;
    }
    .head{
        position: sticky;
        top: 0;
    }
    .foot{
        position: fixed;
        bottom: 0;
    }

</style>

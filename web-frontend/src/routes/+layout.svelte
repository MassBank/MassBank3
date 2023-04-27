<script>
    import MainNav from '$component/MainNav.svelte'
    import MainFoot from "$component/MainFoot.svelte"
    import Logos from "$component/Logos.svelte";
    import Header from "$lib/components/Header.svelte";
    import 'purecss';
    import '../app.css'
</script>
<MainNav></MainNav>

<slot></slot>

<hr>
<MainFoot></MainFoot>
<Logos></Logos>

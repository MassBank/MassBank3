<script>
    export let group;
    export let val;
    let values= []
</script>

<div class="filteroption">
<label>
    <input type=checkbox bind:group={values} name={group} value={val}>
    <slot />
</label>
</div>

<style>
    .filteroption {
        font-size: 0.8em;
        padding: 0 0.5em;
    }
</style>
<script>
    import Header from "$lib/components/Header.svelte";
    import FilterButton from "$component/FilterBox.svelte";
    /** @type {import('./$types').PageData} */
    export let data;
    async function getFilters(base) {
        let resp = await fetch(base+"/v1/filter/browse")
        let data = await resp.json()
        console.log(data)
        return data
    }
    $: base = data.baseurl;
</script>


<Header>Record Index</Header>

<div class="pure-g">
    <div class="pure-u-1-5">
    {#await getFilters(base)}
        <p class="loading">loading...</p>
    {:then filters}
        <div class="card">
        <h2>Filters</h2>

        <h3>Contributor</h3>
        <h3>Instrument Type</h3>
            {#each filters.instrument_type as t}
                <FilterButton group="insttype" val={t.value}>{t.value} ({t.count})</FilterButton>
            {/each}
        <h3>MS Type</h3>
            {#each filters.ms_type as t}
                <FilterButton group="mstype" val={t.value}>{t.value} ({t.count})</FilterButton>
            {/each}
        <h3>Ion Mode</h3>
            {#each filters.ion_mode as t}
                <FilterButton group="ionmode" val={t.value}>{t.value} ({t.count})</FilterButton>
            {/each}
        </div>

    {/await}
    </div>
    <div class="pure-u-4-5">
        <h2>Results</h2>
    </div>
</div>


<style>
    h2 {
        margin: 0;
        padding: 0.2em;
        font-weight: 600;
    }
    h3 {
        padding: 0.3em;
        margin: 0;
    }
    .card {
        border: darkgrey;
        border-style: solid;
        margin: 0.5em;
    }
</style>
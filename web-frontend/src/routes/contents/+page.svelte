<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import FilterButton from "$component/FilterBox.svelte";
    import ShortRecordSummary from "$component/ShortRecordSummary.svelte";
    import Pagination from "$component/Pagination.svelte";

    /** @type {import('./$types').PageData} */
    export let data: any;
    let base: string;
    let page: bigint = 1;
    let pages: bigint = 10;
    async function getFilters(base) {
        let resp = await fetch(base + "/v1/filter/browse");
        let jsonData = await resp.json();
        if (resp.ok) {
            return jsonData
        } else {
            console.log(jsonData);
            throw new Error("Could not load filters.")
        }

    }

    async function getResults(page) {
        let url = new URL("/v1/records",base)
        url.searchParams.append('page',page.toString())
        contribuors.forEach(element => url.searchParams.append('contributor',element))
        msType.forEach(element => url.searchParams.append('ms_type',element))
        instrumentType.forEach(element => url.searchParams.append('instrument_type',element))
        ionMode.forEach(element => url.searchParams.append('ion-mode',element))

        console.log(url)
        let resp = await fetch(url)
        let jsonData = await  resp.json();
        if(resp.ok) {
            console.log(JSON.stringify(jsonData))
            return jsonData

        } else {
            console.log(jsonData)
            throw new Error("Could not get results")
        }
    }

    let contribuors = [];
    let msType = [];
    let instrumentType = [];
    let ionMode = [];
    $: base = data.baseurl
</script>
{base}
{contribuors}
<div class="pure-g">
    <div class="pure-u-1-5">
        {#await getFilters(base)}
            <div class="info">loading filters...</div>
        {:then filters}
            <div class="card">
                <h2>Filters</h2>
                <h3>Contributor</h3>
                <FilterButton bind:result={contribuors} group="cont" values={filters.contributor}></FilterButton>
                <h3>Instrument Type</h3>
                <FilterButton bind:result={instrumentType} group="itype" values={filters.instrument_type}></FilterButton>
                <h3>MS Type</h3>
                <FilterButton bind:result={msType} group="mstype" values={filters.ms_type}></FilterButton>
                <h3>Ion Mode</h3>
                <FilterButton bind:result={ionMode} group="imode" values={filters.ion_mode}></FilterButton>
            </div>
        {:catch error}
            <div class="error">Error during Filter loading</div>
        {/await}
    </div>
    <div class="pure-u-4-5">
        <h2>Results</h2>
        {#key ionMode,msType,contribuors,instrumentType}
        {#await getResults(page)}
            <div class="info">Loading results...</div>
            {:then records}
            <Pagination bind:currentPage={page} pages={pages}>
            {#each records.data as record}
                <ShortRecordSummary record="{record}"></ShortRecordSummary>
            {/each}
            </Pagination>
        {:catch error}
            <div class="error">Error while loading results</div>
        {/await}
        {/key}
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
        border: solid #a9a9a9;
        margin: 0.5em;
    }

    .record-name {
        font-weight: bold;
        font-size: 1.5em;
    }

</style>

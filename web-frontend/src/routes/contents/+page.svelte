<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import FilterButton from "$component/FilterBox.svelte";
    import ShortRecordSummary from "$component/ShortRecordSummary.svelte";
    import Pagination from "$component/Pagination.svelte";

    /** @type {import('./$types').PageData} */
    export let data: any;
    let base: string;
    let cur_page: number = 1;
    let pages: number = 10;
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
        url.searchParams.append('instrument_type',instrumentType.join())
        url.searchParams.append('ms_type',msType.join())
        url.searchParams.append('ion-mode',ionMode.join())
        url.searchParams.append('contributor',contributors.join())

        console.log(url)
        let resp = await fetch(url)
        let jsonData = await  resp.json();
        if(resp.ok) {
            console.log(JSON.stringify(jsonData))
            pages = Math.floor(Number(jsonData.metadata.result_count)/20+1)
            if (cur_page>pages) {
                cur_page=1
            }
            return jsonData

        } else {
            console.log(jsonData)
            throw new Error("Could not get results")
        }
    }

    let contributors = [];
    let msType = [];
    let instrumentType = [];
    let ionMode = [];
    $: base = data.baseurl
</script>
<div class="pure-g">
    <div class="pure-u-1-5">
        {#await getFilters(base)}
            <div class="info">loading filters...</div>
        {:then filters}
            <div class="card">
                <h2>Filters</h2>
                <h3>Contributor</h3>
                <FilterButton bind:result={contributors} group="cont" values={filters.contributor}></FilterButton>
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
        {#key ionMode,msType,contributors,instrumentType}
        {#await getResults(cur_page)}
            <div class="info">Loading results...</div>
            {:then records}
            <Pagination bind:currentPage={cur_page} pages={pages}>
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

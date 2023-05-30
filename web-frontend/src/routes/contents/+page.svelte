<script lang="ts">
    import FilterButton from "$component/FilterBox.svelte";
    import ShortRecordSummary from "$component/ShortRecordSummary.svelte";
    import Pagination from "$component/Pagination.svelte";
    import {Pie} from "svelte-chartjs";

    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale,
        Colors
    } from 'chart.js';

    /** @type {import('./$typesunknownPageData} */
    export let data: any;
    let base: string;
    let curPage = 1;
    let pages = 10;

    let chartData = {
        contributorsData: {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        },
        InstrumentType: {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        },
        msType: {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        },

    }

    async function getFilters() {
        let url = new URL("/v1/filter/browse",base)
        url.searchParams.append('instrument_type',instrumentType.join())
        url.searchParams.append('ms_type',msType.join())
        url.searchParams.append('ion-mode',ionMode.join())
        url.searchParams.append('contributor',contributors.join())
        let resp = await fetch(url);
        let jsonData = await resp.json();
        if (resp.ok) {
            chartData.contributorsData.labels = []
            chartData.contributorsData.datasets[0].data = []
            for (const co of jsonData.contributor) {
                chartData.contributorsData.labels.push(co.value)
                chartData.contributorsData.datasets[0].data.push(co.count)
            }
            chartData.msType.labels = []
            chartData.msType.datasets[0].data = []
            for (const co of jsonData.ms_type) {
                chartData.msType.labels.push(co.value)
                chartData.msType.datasets[0].data.push(co.count)
            }
            chartData.InstrumentType.labels = []
            chartData.InstrumentType.datasets[0].data = []
            for (const co of jsonData.instrument_type) {
                chartData.InstrumentType.labels.push(co.value)
                chartData.InstrumentType.datasets[0].data.push(co.count)
            }
            chartData = chartData
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
        let resp = await fetch(url)
        let jsonData = await  resp.json();
        if(resp.ok) {
            console.log(JSON.stringify(jsonData))
            pages = Math.floor(Number(jsonData.metadata.result_count)/20+1)
            if (curPage>pages) {
                curPage=1
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

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, Colors);

    $: base = data.baseurl
</script>
<div class="pure-g">
    <div class="pure-u-1-5">
        {#await getFilters()}
            <div class="info">loading filters...</div>
        {:then filters}
            <div class="card">
                <h2>Filters</h2>
                <h3>Instrument Type</h3>
                <FilterButton bind:result={instrumentType} group="itype" values={filters.instrument_type}></FilterButton>
                <h3>MS Type</h3>
                <FilterButton bind:result={msType} group="mstype" values={filters.ms_type}></FilterButton>
                <h3>Ion Mode</h3>
                <FilterButton bind:result={ionMode} group="imode" values={filters.ion_mode}></FilterButton>
                <h3>Contributor</h3>
                <FilterButton bind:result={contributors} group="cont" values={filters.contributor}></FilterButton>
            </div>
        {:catch error}
            <div class="error">Error during Filter loading</div>
        {/await}
    </div>
    <div class="pure-u-3-5">
        <h2>Results</h2>
        {#key ionMode,msType,contributors,instrumentType}
        {#await getResults(curPage)}
            <div class="info">Loading results...</div>
            {:then records}
            <Pagination bind:currentPage={curPage} pages={pages}>
            {#each records.data as record}
                <ShortRecordSummary record="{record}"></ShortRecordSummary>
            {/each}
            </Pagination>
        {:catch error}
            <div class="error">Error while loading results</div>
        {/await}
        {/key}
    </div>
    <div class="pure-u-1-5">
         {#await getFilters()}
             <div class="info">loading filters...</div>
         {:then filters}
             <div class="card">
                 <b>MassBank Version: </b>{filters.metadata.version}<br>
                 <br>
                 <b>Compounds: </b>{filters.metadata.compound_count}<br>
                 <b>Isomers: </b>{filters.metadata.isomer_count}<br>
                 <b>Spectra: </b>{filters.metadata.spectra_count}<br>
                 <br>
                 <Pie data={chartData.contributorsData} ></Pie>
                 <Pie data={chartData.InstrumentType} ></Pie>
                 <Pie data={chartData.msType} ></Pie>

             </div>
         {/await}
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

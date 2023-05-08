<script lang="ts">
    /** @type {import('./$types').PageData} */
    export let data;

    let base:string;
    let acc: string
    async function getRecord(id) {
        let resp = await fetch(base+"/v1/records/"+id)
        let jsonData = await  resp.json();
        if(resp.ok) {
            console.log(JSON.stringify(jsonData))
            return jsonData

        } else {
            console.log(jsonData)
            throw new Error("Could not get results")
        }
    }

    $: base = data.baseurl;
    $: acc = data.accession;
</script>

<h1>{data.accession}</h1>
{#await getRecord(acc)}
    <div class="info">loading record...</div>
{:then record}
    <pre>{JSON.stringify(record,null,2)}</pre>
{:catch error}
    <div class="error">Error during Filter loading</div>
{/await}

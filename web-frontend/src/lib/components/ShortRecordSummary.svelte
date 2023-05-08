<script lang="ts">
    export let record: any;
</script>
<div class="card short-record">
                <div class="record-name">{record.name}</div>
                <div>{record.formula}</div>
                <div>{record.smiles}</div>
                <div>{record.mass}</div>
                    <div class="spectra">{record.spectra.length} Spectra :</div>
                        {#each record.spectra as spectrum}
                            <a href="/record/{spectrum.id}"><div>{spectrum.id} {spectrum.title}</div></a>
                    {/each}
                </div>

<style>
    .card {
        border: solid #a9a9a9;
        margin: 0.5em;
    }

    .record-name {
        font-weight: bold;
        font-size: 1.5em;
    }
</style>

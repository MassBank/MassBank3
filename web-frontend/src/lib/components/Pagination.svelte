<script lang="ts">
    export let currentPage: bigint=1;
    export let pages: bigint=1;
    export let size: bigint = 4;
    function setPage(page) {
        currentPage = page;
    }
</script>

<div class="pagination">
        <button disabled={currentPage==1} class="page-link-btn" on:click={() => setPage(1)}>1</button>
        <button disabled={currentPage<2} class="page-link-btn" on:click={() => setPage(currentPage-1)}>previous</button>
    <span class:hide={currentPage-size<2}>...</span>
    {#each Array(size).fill().map((element,index) => index+(currentPage-size)) as p}
        <button disabled={p<1 || p>pages} class="page-link-btn page-label-btn" on:click={() => setPage(p)}> {p > pages || p<1 ? '-' : p} </button>
    {/each}
    <span class="current-page">{currentPage}</span>
    {#each Array(size).fill().map((element,index) => index+(currentPage+1)) as p}
        <button disabled={p > pages || p<1} class="page-link-btn page-label-btn" on:click={() => setPage(p)}>{p > pages || p<1 ? '-' : p} </button>
    {/each}
    <span class:hide={currentPage+size>=pages}>...</span>
        <button disabled={currentPage>=pages} class="page-link-btn" on:click={() => setPage(currentPage+1)}>next</button>
        <button disabled={currentPage>=pages} class="page-link-btn" on:click={() => setPage(pages)}>{pages}</button>
</div>
<slot></slot>

<style>
    .pagination {
        padding: 1em;
    }
    .current-page {
        font-size: 1.2em;
        font-weight: bold;
        width: 4em;
        display: inline-block;
        text-align: center;
    }

    .page-link-btn {
        font-size: 0.9em;
        padding: 5px;
    }

    .page-label-btn {
        width: 4em;
    }

    .hide {
        color: lightgrey;
    }
</style>

<script>
    const load = (async () => {
        const response =  await fetch('/api/autoRefresh/logs')
        const data = await response.json()
        return data
    })()
</script>

<div>
{#await load}
    <p>Loading...</p>
{:then logs}
    <table>
        <tr>
            <th>Date</th>
            <th>Test</th>
            <th>Result</th>
        </tr>
    {#each logs.reverse() as { date, name, result }}
        <tr>
            <td>{(new Date(date)).toISOString().split('T')[0]}</td>
            <td>{name}</td>
            <td>{#if result === 1}✅{:else}❌{/if}</td>
        </tr>
    {/each}
    </table>
{:catch error}
    <p>An error occurred!</p>
{/await}
</div>

<style>
    * {
        text-align: center;
    }
    
    table {
        border-collapse: collapse;
        margin: auto;
    }

    table, th, td {
        border: 1px solid black
    }

    th, td {
        padding: 0.5em;
    }
</style>

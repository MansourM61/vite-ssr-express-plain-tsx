export async function setupProxyFetcher(buttonElement: HTMLButtonElement) {
    buttonElement.addEventListener('click', async () => {
        alert('Check the console for the fetched Data.')

        const res = await fetch('/api?page=1')

        if (!res.ok) {
            console.error('Cannot get the data!')
        } else {
            try {
                const data = await res.json()

                console.info(JSON.stringify(data, null, 2))
            } catch {
                console.error('Cannot get the JSON!')
            }
        }
    })
}

export async function setupFetcher(
    buttonElement: HTMLButtonElement,
    listElement: HTMLUListElement
) {
    buttonElement.addEventListener('click', async () => {
        const res = await fetch('/end-point')

        if (!res.ok) {
            console.error('Cannot get the data!')
        } else {
            try {
                const data = (await res.json()) as {
                    message: string
                    timeStamp: number
                }

                const fragment = document.createDocumentFragment()
                const li = document.createElement('li')
                const dataDate = new Date(data.timeStamp)
                li.textContent = data.message + ' @ ' + dataDate
                li.classList.add('text-white')
                fragment.appendChild(li)

                listElement.appendChild(fragment)
            } catch {
                console.error('Cannot get the JSON!')
            }
        }
    })
}

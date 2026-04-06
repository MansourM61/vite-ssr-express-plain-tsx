import Comp from '@components/Comp'
import { setupCounter } from '@components/counter'
import { setupFetcher } from '@lib/fetch-data'
import { setupProxyFetcher } from '@lib/proxy-fetch'

setupCounter(document.querySelector('#counter') as HTMLButtonElement)

setupFetcher(
    document.querySelector('#fetch-data') as HTMLButtonElement,
    document.querySelector('#list-data') as HTMLUListElement
)

setupProxyFetcher(document.querySelector('#proxy-fetch') as HTMLButtonElement)

document.querySelector<HTMLDivElement>('#jsx')!.appendChild(Comp)

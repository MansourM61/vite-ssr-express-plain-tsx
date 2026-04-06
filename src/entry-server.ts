export function render(_url: string) {
    const html = /*html*/ `
    <section class="flex flex-col grow gap-6.25 place-content-center place-items-center ">
        <h1 class="text-5xl text-amber-100 mt-10">Vite Build Tool</h1>
        <button class="bg-gray-700 py-1 px-2 rounded-lg border-2 border-blue-600 text-gray-300" id="counter" type="button" class="counter"></button>

        <div id="jsx"></div>

        <div class="flex justify-center mt-5">
            <button
                type="button"
                class="w-fit bg-olive-500 rounded-lg p-2"
                id="proxy-fetch"
            >
                Proxy Fetch
            </button>
        </div>

        <div class="flex justify-center mt-5">
            <div
                class="flex flex-col mt-5 gap-3 items-center border-2 border-amber-400 rounded-xl p-5"
            >
                <button
                    type="button"
                    class="w-fit bg-pink-400 rounded-lg p-2"
                    id="fetch-data"
                >
                    Fetch data
                </button>

                <fieldset>
                    <legend class="text-gray-400">Data</legend>
                    <ul id="list-data"></ul>
                </fieldset>
            </div>
        </div>

    </section>
  `
    return { html }
}

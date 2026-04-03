export function render(_url: string) {
    const html = /*html*/ `
    <section class="flex flex-col grow gap-6.25 place-content-center place-items-center ">
        <h1 class="text-5xl text-amber-100 mt-10">Vite Build Tool</h1>
        <button class="bg-gray-700 py-1 px-2 rounded-lg border-2 border-blue-600 text-gray-300" id="counter" type="button" class="counter"></button>
    </section>
  `
    return { html }
}

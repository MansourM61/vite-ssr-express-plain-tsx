function Ping({ blurt }: { blurt: string }) {
    return <div>{blurt} </div>
}

var el = <Ping blurt="☄️"></Ping>

// var div: HTMLElement
var Comp = (
    <div className="flex flex-col mt-5 gap-3 items-center">
        <div id="foo" className="text-2xl text-amber-500 text-center">
            Hello JSX! {el}
        </div>
        <button
            type="button"
            className="w-fit bg-sky-800 rounded-lg p-2"
            onClick={() => {
                alert('👉 JSX Event 👈')
            }}
        >
            Open the popup
        </button>
    </div>
)

export default Comp

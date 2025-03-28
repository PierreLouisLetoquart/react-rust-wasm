# React + WASM 🦀

This project is a minimal React.js app bundled with Vite and using Rust compiled into WASM. It features a Dijkstra's algorithm implementation ([source code](https://github.com/PierreLouisLetoquart/dijkstra-wasm)) to efficiently compute the shortest path of a graph and display it.

https://github.com/user-attachments/assets/f4ab1a34-c48a-4485-bdd8-7c3ea9729177

## Usage 🛠️

Clone the repository:

```bash
git clone git@github.com:PierreLouisLetoquart/react-rust-wasm.git dijgraph
```

Install dependencies:

```bash
cd dijgraph
bun install
```

> [!NOTE]
> You can also use `pnpm` or any other package manager. Just replace `bun` with your choice.

Start the dev server using bun:

```bash
bun run dev
# OR
bun run build
bun run preview
```

You can now access the app at `http://localhost:5173` and drop the example graph file [`data.csv`](./src/assets/data.csv) to see the shortest path between two nodes.

> [!NOTE]
> To modify the Rust code used for Dijkstra's implementation and get more info on the WASM building process, check out [this repository](https://github.com/PierreLouisLetoquart/dijkstra-wasm).

## Data Source Format 📊

To create your own graph and use it in the app, make sure it's formatted as follows:

```
nbrOfNodes
nodeId,x,y
nodeId,x,y
nodeId,x,y
...
nbrOfEdges
sourceId,targetId,weight
sourceId,targetId,weight
...
```

> [!WARNING]
> The ids must be integers.

## Contribute 🤝

This is a super simplified and unoptimized piece of code, so feel free to submit issues or PRs if you’d like. 🙌

> [!CAUTION]
> I've encountered a weird bug on Firefox (Zen-browser) and am currently exploring the issue. 🔍

## Refs

The upload component is taken and adapted from [Aceternity](https://ui.aceternity.com/components/file-upload)

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Play, Pause, RotateCcw, Code, ChevronRight } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

type AlgoKind = 'bubble' | 'quick' | 'merge' | 'binary-search' | 'bfs' | 'dfs' | 'dijkstra';

interface AlgoInfo {
  id: AlgoKind;
  name: string;
  description: string;
  category: string;
  bestCase: string;
  avgCase: string;
  worstCase: string;
  space: string;
}

const ALGORITHMS: AlgoInfo[] = [
  { id: 'bubble', name: 'Bubble Sort', description: 'Compara pares adyacentes y los intercambia si están en desorden. Repite hasta que no haya intercambios.', category: 'Ordenamiento', bestCase: 'O(n)', avgCase: 'O(n²)', worstCase: 'O(n²)', space: 'O(1)' },
  { id: 'quick', name: 'Quick Sort', description: 'Selecciona un pivote y particiona el array en menores y mayores, luego ordena recursivamente.', category: 'Ordenamiento', bestCase: 'O(n log n)', avgCase: 'O(n log n)', worstCase: 'O(n²)', space: 'O(log n)' },
  { id: 'merge', name: 'Merge Sort', description: 'Divide el array en mitades, ordena cada mitad y las fusiona en orden.', category: 'Ordenamiento', bestCase: 'O(n log n)', avgCase: 'O(n log n)', worstCase: 'O(n log n)', space: 'O(n)' },
  { id: 'binary-search', name: 'Binary Search', description: 'Busca en un array ordenado eliminando la mitad del espacio de búsqueda en cada paso.', category: 'Búsqueda', bestCase: 'O(1)', avgCase: 'O(log n)', worstCase: 'O(log n)', space: 'O(1)' },
  { id: 'bfs', name: 'BFS', description: 'Recorrido en anchura: explora todos los vecinos de un nodo antes de avanzar al siguiente nivel.', category: 'Grafos', bestCase: 'O(V+E)', avgCase: 'O(V+E)', worstCase: 'O(V+E)', space: 'O(V)' },
  { id: 'dfs', name: 'DFS', description: 'Recorrido en profundidad: explora tan lejos como sea posible por cada rama antes de retroceder.', category: 'Grafos', bestCase: 'O(V+E)', avgCase: 'O(V+E)', worstCase: 'O(V+E)', space: 'O(V)' },
  { id: 'dijkstra', name: 'Dijkstra', description: 'Encuentra el camino más corto desde un nodo fuente a todos los demás en un grafo con pesos no negativos.', category: 'Grafos', bestCase: 'O(V²)', avgCase: 'O(V²)', worstCase: 'O(V²)', space: 'O(V)' },
];

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

function useSortingAlgo(
  sortFn: (arr: number[], setArr: (a: number[]) => void, setHighlight: (h: number[]) => void, setSorted: (s: number[]) => void) => Generator
) {
  const [array, setArray] = useState<number[]>(() => generateArray(20));
  const [highlight, setHighlight] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const genRef = useRef<Generator | null>(null);
  const runningRef = useRef(false);

  function reset() {
    setRunning(false);
    runningRef.current = false;
    const newArr = generateArray(20);
    setArray(newArr);
    setHighlight([]);
    setSorted([]);
    genRef.current = null;
  }

  async function run() {
    if (running) {
      setRunning(false);
      runningRef.current = false;
      return;
    }
    setRunning(true);
    runningRef.current = true;
    const arr = [...array];
    const gen = sortFn(arr, (a) => setArray([...a]), (h) => setHighlight([...h]), (s) => setSorted([...s]));
    genRef.current = gen;

    let step = gen.next();
    while (!step.done) {
      if (!runningRef.current) break;
      await new Promise((r) => setTimeout(r, 200 - speed * 1.8));
      step = gen.next();
    }
    setRunning(false);
    runningRef.current = false;
  }

  return { array, highlight, sorted, running, speed, setSpeed, run, reset };
}

function* bubbleSortGen(arr: number[], setArr: (a: number[]) => void, setHighlight: (h: number[]) => void, setSorted: (s: number[]) => void): Generator {
  const a = [...arr];
  const n = a.length;
  const sortedIdx: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      setHighlight([j, j + 1]);
      yield;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        setArr([...a]);
        yield;
      }
    }
    sortedIdx.push(n - i - 1);
    setSorted([...sortedIdx]);
  }
  sortedIdx.push(0);
  setSorted([...sortedIdx]);
  setHighlight([]);
}

function* quickSortGen(arr: number[], setArr: (a: number[]) => void, setHighlight: (h: number[]) => void, setSorted: (s: number[]) => void): Generator {
  const a = [...arr];
  const sortedSet = new Set<number>();

  function* partition(lo: number, hi: number): Generator<void, number, unknown> {
    const pivot = a[hi];
    setHighlight([hi]);
    yield;
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      setHighlight([j, hi]);
      yield;
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        setArr([...a]);
        yield;
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    setArr([...a]);
    sortedSet.add(i + 1);
    setSorted([...sortedSet]);
    yield;
    return i + 1;
  }

  function* qsort(lo: number, hi: number): Generator {
    if (lo < hi) {
      const pi: number = yield* partition(lo, hi);
      yield* qsort(lo, pi - 1);
      yield* qsort(pi + 1, hi);
    } else if (lo === hi) {
      sortedSet.add(lo);
      setSorted([...sortedSet]);
    }
  }

  yield* qsort(0, a.length - 1);
  setHighlight([]);
}

function* mergeSortGen(arr: number[], setArr: (a: number[]) => void, setHighlight: (h: number[]) => void, setSorted: (s: number[]) => void): Generator {
  const a = [...arr];

  function* merge(lo: number, mid: number, hi: number): Generator {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      setHighlight([lo + i, mid + 1 + j]);
      yield;
      if (left[i] <= right[j]) {
        a[k] = left[i]; i++;
      } else {
        a[k] = right[j]; j++;
      }
      setArr([...a]);
      yield;
      k++;
    }
    while (i < left.length) { a[k] = left[i]; i++; k++; setArr([...a]); yield; }
    while (j < right.length) { a[k] = right[j]; j++; k++; setArr([...a]); yield; }
  }

  function* msort(lo: number, hi: number): Generator {
    if (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      yield* msort(lo, mid);
      yield* msort(mid + 1, hi);
      yield* merge(lo, mid, hi);
    }
  }

  yield* msort(0, a.length - 1);
  setSorted(Array.from({ length: a.length }, (_, i) => i));
  setHighlight([]);
}

function SortVisualizer({ sortGen }: { sortGen: typeof bubbleSortGen }) {
  const { array, highlight, sorted, running, speed, setSpeed, run, reset } = useSortingAlgo(sortGen);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={run}>
          {running ? <><Pause className="w-4 h-4 mr-1" />Pausar</> : <><Play className="w-4 h-4 mr-1" />Iniciar</>}
        </Button>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" />Reset</Button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#94a3b8]">Velocidad</span>
          <input
            type="range" min="1" max="100" value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-24 accent-[#00bcd4]"
          />
        </div>
      </div>
      <div className="flex items-end gap-1 h-64 p-4 rounded-xl bg-[#111827] border border-[#1e293b]">
        {array.map((val, i) => (
          <motion.div
            key={i}
            layout
            className="flex-1 rounded-t-sm transition-all duration-150"
            style={{
              height: `${(val / 100) * 100}%`,
              background: sorted.includes(i)
                ? '#22c55e'
                : highlight.includes(i)
                ? '#00bcd4'
                : '#1e293b',
              boxShadow: highlight.includes(i) ? '0 0 10px rgba(0,188,212,0.3)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BinarySearchVisualizer() {
  const [array] = useState<number[]>(() => Array.from({ length: 20 }, (_, i) => (i + 1) * 5));
  const [target, setTarget] = useState(50);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(19);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(-1);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);

  async function run() {
    setRunning(true);
    setFound(-1);
    setSteps([]);
    let l = 0, h = array.length - 1;
    setLo(l);
    setHi(h);

    while (l <= h) {
      const m = Math.floor((l + h) / 2);
      setMid(m);
      setSteps((s) => [...s, `mid=[${m}]=${array[m]}, lo=${l}, hi=${h}`]);
      await new Promise((r) => setTimeout(r, 600));

      if (array[m] === target) {
        setFound(m);
        setSteps((s) => [...s, `Encontrado en posición ${m}`]);
        break;
      } else if (array[m] < target) {
        l = m + 1;
        setLo(l);
      } else {
        h = m - 1;
        setHi(h);
      }
    }
    if (found === -1 && l > h) setSteps((s) => [...s, 'No encontrado']);
    setRunning(false);
  }

  function reset() {
    setLo(0); setHi(19); setMid(-1); setFound(-1); setRunning(false); setSteps([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
          className="input-field w-28" placeholder="Buscar"
        />
        <Button size="sm" onClick={run} disabled={running}>
          <Play className="w-4 h-4 mr-1" />Buscar
        </Button>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="flex gap-1 p-4 rounded-xl bg-[#111827] border border-[#1e293b] overflow-x-auto">
        {array.map((val, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-10 h-16 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-300 ${
              i === found ? 'bg-[#22c55e] text-white' : i === mid ? 'bg-[#00bcd4] text-white' : i >= lo && i <= hi ? 'bg-[#1e293b] text-[#F5F5F5]' : 'bg-[#111827] text-[#94a3b8]'
            }`}
          >
            <span>{val}</span>
            <span className="text-[8px] opacity-60">[{i}]</span>
          </div>
        ))}
      </div>
      {steps.length > 0 && (
        <div className="card p-4 space-y-1 max-h-32 overflow-y-auto">
          {steps.map((step, i) => (
            <p key={i} className="text-xs text-[#94a3b8] font-mono">{step}</p>
          ))}
        </div>
      )}
    </div>
  );
}

interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  content?: string;
}

interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

const GRAPH_NODES: GraphNode[] = [
  { id: 0, x: 300, y: 40, label: 'A', content: 'Nodo A — Entrada: información inicial del grafo.' },
  { id: 1, x: 150, y: 120, label: 'B', content: 'Nodo B — Contiene registro B (ej: valor=12).' },
  { id: 2, x: 450, y: 120, label: 'C', content: 'Nodo C — Contiene registro C (ej: valor=7).' },
  { id: 3, x: 80, y: 220, label: 'D', content: 'Nodo D — Contiene registro D (ej: valor=20).' },
  { id: 4, x: 250, y: 220, label: 'E', content: 'Nodo E — Contiene registro E (ej: valor=3).' },
  { id: 5, x: 420, y: 220, label: 'F', content: 'Nodo F — Contiene registro F (ej: valor=9).' },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
  { from: 1, to: 3, weight: 5 }, { from: 1, to: 4, weight: 1 },
  { from: 2, to: 4, weight: 3 }, { from: 2, to: 5, weight: 6 },
  { from: 3, to: 4, weight: 7 }, { from: 4, to: 5, weight: 2 },
];

function GraphVisualizer({ mode }: { mode: 'bfs' | 'dfs' | 'dijkstra' }) {
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState(-1);
  const [running, setRunning] = useState(false);
  const [distances, setDistances] = useState<Record<number, number>>({});
  const [steps, setSteps] = useState<string[]>([]);

  const adjList: Record<number, number[]> = {};
  GRAPH_NODES.forEach((n) => { adjList[n.id] = []; });
  GRAPH_EDGES.forEach((e) => {
    adjList[e.from].push(e.to);
    adjList[e.to].push(e.from);
  });

  const [selected, setSelected] = useState(-1);

  async function runBFS() {
    setRunning(true);
    setVisited([]);
    setSteps([]);
    const visitedSet = new Set<number>();
    const queue = [0];
    visitedSet.add(0);
    const visitOrder: number[] = [0];

    while (queue.length > 0) {
      const node = queue.shift()!;
      setCurrent(node);
      setSelected(node);
      setVisited([...visitOrder]);
      setSteps((s) => [...s, `Visitando nodo ${GRAPH_NODES[node].label}`]);
      await new Promise((r) => setTimeout(r, 600));

      for (const neighbor of adjList[node]) {
        if (!visitedSet.has(neighbor)) {
          visitedSet.add(neighbor);
          queue.push(neighbor);
          visitOrder.push(neighbor);
        }
      }
    }
    setCurrent(-1);
    setRunning(false);
  }

  async function runDFS() {
    setRunning(true);
    setVisited([]);
    setSteps([]);
    const visitedSet = new Set<number>();
    const visitOrder: number[] = [];

    async function dfs(node: number) {
      visitedSet.add(node);
      visitOrder.push(node);
      setCurrent(node);
      setSelected(node);
      setVisited([...visitOrder]);
      setSteps((s) => [...s, `Visitando nodo ${GRAPH_NODES[node].label}`]);
      await new Promise((r) => setTimeout(r, 600));

      for (const neighbor of adjList[node]) {
        if (!visitedSet.has(neighbor)) {
          await dfs(neighbor);
        }
      }
    }

    await dfs(0);
    setCurrent(-1);
    setRunning(false);
  }

  async function runDijkstra() {
    setRunning(true);
    setVisited([]);
    setDistances({});
    setSteps([]);
    const dist: Record<number, number> = {};
    const visitedSet = new Set<number>();
    GRAPH_NODES.forEach((n) => { dist[n.id] = Infinity; });
    dist[0] = 0;
    setDistances({ ...dist });

    while (visitedSet.size < GRAPH_NODES.length) {
      let minNode = -1;
      let minDist = Infinity;
      for (const n of GRAPH_NODES) {
        if (!visitedSet.has(n.id) && dist[n.id] < minDist) {
          minDist = dist[n.id];
          minNode = n.id;
        }
      }
      if (minNode === -1) break;

      visitedSet.add(minNode);
      setCurrent(minNode);
      setSelected(minNode);
      setVisited([...visitedSet]);
      setSteps((s) => [...s, `Nodo ${GRAPH_NODES[minNode].label}: distancia = ${dist[minNode]}`]);
      await new Promise((r) => setTimeout(r, 600));

      for (const edge of GRAPH_EDGES) {
        const neighbor = edge.from === minNode ? edge.to : edge.to === minNode ? edge.from : -1;
        if (neighbor !== -1 && !visitedSet.has(neighbor)) {
          const newDist = dist[minNode] + (edge.weight || 1);
          if (newDist < dist[neighbor]) {
            dist[neighbor] = newDist;
            setDistances({ ...dist });
          }
        }
      }
    }
    setCurrent(-1);
    setRunning(false);
  }

  function run() {
    if (mode === 'bfs') runBFS();
    else if (mode === 'dfs') runDFS();
    else runDijkstra();
  }

  function reset() {
    setVisited([]); setCurrent(-1); setRunning(false); setDistances({}); setSteps([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button size="sm" onClick={run} disabled={running}>
          <Play className="w-4 h-4 mr-1" />{running ? 'Ejecutando...' : 'Iniciar'}
        </Button>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden">
        <svg width="100%" height="280" viewBox="0 0 530 280">
          {GRAPH_EDGES.map((edge, i) => {
            const from = GRAPH_NODES[edge.from];
            const to = GRAPH_NODES[edge.to];
            const isVisited = visited.includes(edge.from) && visited.includes(edge.to);
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isVisited ? '#00bcd4' : '#1e293b'} strokeWidth="2" className="transition-all duration-300" />
                {edge.weight && (
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} textAnchor="middle" fill="#94a3b8" fontSize="11">
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}
          {GRAPH_NODES.map((node) => {
            const isCurrent = node.id === current;
            const isVisited = visited.includes(node.id);
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="22"
                  onClick={() => setSelected(node.id)}
                  style={{ cursor: 'pointer' }}
                  fill={isCurrent ? '#00bcd4' : isVisited ? '#0ea5a4' : '#1e293b'}
                  stroke={isCurrent ? '#00bcd4' : isVisited ? '#0ea5a4' : '#1e293b'}
                  strokeWidth="2" className="transition-all duration-300" />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                  {node.label}
                </text>
                {mode === 'dijkstra' && distances[node.id] !== undefined && (
                  <text x={node.x} y={node.y + 38} textAnchor="middle" fill="#94a3b8" fontSize="10">
                    d={distances[node.id] === Infinity ? '∞' : distances[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {steps.length > 0 && (
        <div className="card p-4 space-y-1 max-h-32 overflow-y-auto">
          {steps.map((step, i) => (
            <p key={i} className="text-xs text-[#94a3b8] font-mono">{step}</p>
          ))}
        </div>
      )}
      {selected !== -1 && (
        <div className="card p-4">
          <h4 className="text-sm font-semibold text-[#F5F5F5] mb-2">Detalle nodo {GRAPH_NODES[selected].label}</h4>
          <p className="text-xs text-[#94a3b8] mb-2">ID: {GRAPH_NODES[selected].id}</p>
          <p className="text-sm text-[#F5F5F5] mb-2">{GRAPH_NODES[selected].content}</p>
          <p className="text-xs text-[#94a3b8] mb-2">Vecinos:</p>
          <div className="flex flex-wrap gap-2">
            {adjList[selected].map((nid) => (
              <span key={nid} className="px-2 py-1 rounded bg-[#111827] text-[12px] text-[#94a3b8]">{GRAPH_NODES[nid].label} (id {nid})</span>
            ))}
          </div>
          {mode === 'dijkstra' && distances[selected] !== undefined && (
            <p className="text-xs text-[#94a3b8] mt-3">Distancia calculada: {distances[selected] === Infinity ? '∞' : distances[selected]}</p>
          )}
        </div>
      )}
    </div>
  );
}

function AlgoVisualizer({ algo }: { algo: AlgoKind }) {
  switch (algo) {
    case 'bubble': return <SortVisualizer sortGen={bubbleSortGen} />;
    case 'quick': return <SortVisualizer sortGen={quickSortGen} />;
    case 'merge': return <SortVisualizer sortGen={mergeSortGen} />;
    case 'binary-search': return <BinarySearchVisualizer />;
    case 'bfs': return <GraphVisualizer mode="bfs" />;
    case 'dfs': return <GraphVisualizer mode="dfs" />;
    case 'dijkstra': return <GraphVisualizer mode="dijkstra" />;
    default: return null;
  }
}

export default function AlgorithmsPage() {
  const [active, setActive] = useState<AlgoKind>('bubble');
  const info = ALGORITHMS.find((a) => a.id === active)!;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-6 h-6 text-[#00bcd4]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
              Algoritmos <span className="gradient-text">interactivos</span>
            </h1>
          </div>
          <p className="text-[#94a3b8]">Visualiza algoritmos paso a paso en tiempo real</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setActive(algo.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === algo.id
                  ? 'bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/30'
                  : 'bg-[#111827] text-[#94a3b8] border border-[#1e293b] hover:border-[#00bcd4]/30 hover:text-[#00bcd4]'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-2">{info.name}</h2>
              <p className="text-sm text-[#94a3b8] mb-6">{info.description}</p>
              <AlgoVisualizer algo={active} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#00bcd4]" /> Complejidad
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#94a3b8]">Mejor caso</span>
                  <Badge variant="success">{info.bestCase}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#94a3b8]">Promedio</span>
                  <Badge variant="primary">{info.avgCase}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#94a3b8]">Peor caso</span>
                  <Badge variant="danger">{info.worstCase}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#94a3b8]">Espacio</span>
                  <Badge variant="primary">{info.space}</Badge>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Categoría</h3>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <ChevronRight className="w-3 h-3 text-[#00bcd4]" />
                {info.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

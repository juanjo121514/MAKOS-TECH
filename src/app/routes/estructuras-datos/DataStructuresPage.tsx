import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Code, RotateCcw, Plus, Trash2, Search, ChevronRight } from 'lucide-react';
import { Button, Input, Badge } from '../../../components/ui';

type DSKind = 'stack' | 'queue' | 'linked-list' | 'doubly-linked' | 'binary-tree' | 'hash-table' | 'heap';

interface DSInfo {
  id: DSKind;
  name: string;
  description: string;
  operations: string[];
  bigO: Record<string, string>;
}

const DATA_STRUCTURES: DSInfo[] = [
  { id: 'stack', name: 'Pila (Stack)', description: 'Estructura LIFO: el último en entrar es el primero en salir.', operations: ['Push', 'Pop', 'Peek', 'isEmpty'], bigO: { Push: 'O(1)', Pop: 'O(1)', Peek: 'O(1)', Search: 'O(n)' } },
  { id: 'queue', name: 'Cola (Queue)', description: 'Estructura FIFO: el primero en entrar es el primero en salir.', operations: ['Enqueue', 'Dequeue', 'Front', 'isEmpty'], bigO: { Enqueue: 'O(1)', Dequeue: 'O(1)', Front: 'O(1)', Search: 'O(n)' } },
  { id: 'linked-list', name: 'Lista Enlazada', description: 'Nodos conectados secuencialmente con punteros.', operations: ['Insert Head', 'Insert Tail', 'Delete', 'Search'], bigO: { 'Insert Head': 'O(1)', 'Insert Tail': 'O(n)', Delete: 'O(n)', Search: 'O(n)' } },
  { id: 'doubly-linked', name: 'Lista Doblemente Enlazada', description: 'Nodos con punteros al siguiente y anterior.', operations: ['Insert Head', 'Insert Tail', 'Delete', 'Search'], bigO: { 'Insert Head': 'O(1)', 'Insert Tail': 'O(1)', Delete: 'O(n)', Search: 'O(n)' } },
  { id: 'binary-tree', name: 'Árbol Binario', description: 'Cada nodo tiene máximo dos hijos. Para búsqueda: BST.', operations: ['Insert', 'Delete', 'Search', 'Traverse'], bigO: { Insert: 'O(log n)', Delete: 'O(log n)', Search: 'O(log n)', Traverse: 'O(n)' } },
  { id: 'hash-table', name: 'Hash Table', description: 'Mapeo clave-valor con acceso directo por hash.', operations: ['Insert', 'Delete', 'Search', 'Resize'], bigO: { Insert: 'O(1)', Delete: 'O(1)', Search: 'O(1)', Resize: 'O(n)' } },
  { id: 'heap', name: 'Heap (Min/Max)', description: 'Árbol completo donde el padre es menor/mayor que sus hijos.', operations: ['Insert', 'Extract Min', 'Peek', 'Heapify'], bigO: { Insert: 'O(log n)', 'Extract Min': 'O(log n)', Peek: 'O(1)', Heapify: 'O(n)' } },
];

function StackVisualizer() {
  const [items, setItems] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [highlight, setHighlight] = useState(-1);

  function push() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems([val, ...items]);
    setHighlight(0);
    setInput('');
    setTimeout(() => setHighlight(-1), 500);
  }

  function pop() {
    if (items.length === 0) return;
    setHighlight(0);
    setTimeout(() => {
      setItems(items.slice(1));
      setHighlight(-1);
    }, 300);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Valor" className="w-32" />
        <Button size="sm" onClick={push}><Plus className="w-4 h-4 mr-1" />Push</Button>
        <Button size="sm" variant="danger" onClick={pop}><Trash2 className="w-4 h-4 mr-1" />Pop</Button>
        <Button size="sm" variant="ghost" onClick={() => setItems([])}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="flex flex-col-reverse items-center gap-2 min-h-[200px] p-4 rounded-xl bg-[#111827] border border-[#1e293b]">
        {items.length === 0 ? (
          <p className="text-[#94a3b8] text-sm">Pila vacía</p>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={`${i}-${item}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-32 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                i === highlight ? 'bg-[#00bcd4] text-white glow-sm' : 'bg-[#1e293b] text-[#F5F5F5]'
              }`}
            >
              {item}
              {i === 0 && <span className="ml-2 text-[10px] opacity-60">TOP</span>}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function QueueVisualizer() {
  const [items, setItems] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [highlight, setHighlight] = useState(-1);

  function enqueue() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems([...items, val]);
    setHighlight(items.length);
    setInput('');
    setTimeout(() => setHighlight(-1), 500);
  }

  function dequeue() {
    if (items.length === 0) return;
    setHighlight(0);
    setTimeout(() => {
      setItems(items.slice(1));
      setHighlight(-1);
    }, 300);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Valor" className="w-32" />
        <Button size="sm" onClick={enqueue}><Plus className="w-4 h-4 mr-1" />Enqueue</Button>
        <Button size="sm" variant="danger" onClick={dequeue}><Trash2 className="w-4 h-4 mr-1" />Dequeue</Button>
        <Button size="sm" variant="ghost" onClick={() => setItems([])}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="flex items-center gap-2 min-h-[200px] p-4 rounded-xl bg-[#111827] border border-[#1e293b] overflow-x-auto">
        {items.length === 0 ? (
          <p className="text-[#94a3b8] text-sm">Cola vacía</p>
        ) : (
          <>
            <span className="text-[10px] text-[#00bcd4] font-bold mr-1">FRONT</span>
            {items.map((item, i) => (
              <motion.div
                key={`${i}-${item}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  i === highlight ? 'bg-[#00bcd4] text-white glow-sm' : 'bg-[#1e293b] text-[#F5F5F5]'
                }`}>
                  {item}
                </div>
                {i < items.length - 1 && <ChevronRight className="w-4 h-4 text-[#94a3b8]" />}
              </motion.div>
            ))}
            <span className="text-[10px] text-[#ef4444] font-bold ml-1">REAR</span>
          </>
        )}
      </div>
    </div>
  );
}

function LinkedListVisualizer() {
  const [items, setItems] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [found, setFound] = useState(-1);

  function insertHead() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems([val, ...items]);
    setInput('');
  }

  function insertTail() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems([...items, val]);
    setInput('');
  }

  function deleteItem() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems(items.filter((v) => v !== val));
    setInput('');
  }

  function search() {
    const val = parseInt(searchVal);
    const idx = items.indexOf(val);
    setFound(idx);
    setTimeout(() => setFound(-1), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Valor" className="w-28" />
        <Button size="sm" onClick={insertHead}>Insert Head</Button>
        <Button size="sm" onClick={insertTail}>Insert Tail</Button>
        <Button size="sm" variant="danger" onClick={deleteItem}>Delete</Button>
        <Button size="sm" variant="ghost" onClick={() => setItems([])}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="flex items-center gap-2">
        <Input type="number" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Buscar" className="w-28" />
        <Button size="sm" variant="secondary" onClick={search}><Search className="w-4 h-4 mr-1" />Search</Button>
      </div>
      <div className="flex items-center gap-2 min-h-[200px] p-4 rounded-xl bg-[#111827] border border-[#1e293b] overflow-x-auto">
        {items.length === 0 ? (
          <p className="text-[#94a3b8] text-sm">Lista vacía</p>
        ) : (
          <>
            <span className="text-[10px] text-[#00bcd4] font-bold mr-1">HEAD</span>
            {items.map((item, i) => (
              <motion.div
                key={`${i}-${item}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  i === found ? 'bg-[#22c55e] text-white glow-sm' : 'bg-[#1e293b] text-[#F5F5F5]'
                }`}>
                  {item}
                </div>
                {i < items.length - 1 && (
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-[#00bcd4]" />
                  </div>
                )}
              </motion.div>
            ))}
            <span className="text-[10px] text-[#ef4444] font-bold ml-1">NULL</span>
          </>
        )}
      </div>
    </div>
  );
}

function DoublyLinkedListVisualizer() {
  const [items, setItems] = useState<number[]>([]);
  const [input, setInput] = useState('');

  function insertHead() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems([val, ...items]);
    setInput('');
  }

  function insertTail() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems([...items, val]);
    setInput('');
  }

  function deleteItem() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setItems(items.filter((v) => v !== val));
    setInput('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Valor" className="w-28" />
        <Button size="sm" onClick={insertHead}>Insert Head</Button>
        <Button size="sm" onClick={insertTail}>Insert Tail</Button>
        <Button size="sm" variant="danger" onClick={deleteItem}>Delete</Button>
        <Button size="sm" variant="ghost" onClick={() => setItems([])}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="flex items-center gap-1 min-h-[200px] p-4 rounded-xl bg-[#111827] border border-[#1e293b] overflow-x-auto">
        {items.length === 0 ? (
          <p className="text-[#94a3b8] text-sm">Lista vacía</p>
        ) : (
          <>
            <span className="text-[10px] text-[#00bcd4] font-bold mr-2">HEAD</span>
            {items.map((item, i) => (
              <motion.div
                key={`${i}-${item}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1"
              >
                <div className="w-20 h-16 rounded-lg bg-[#1e293b] flex items-center justify-center text-sm font-medium text-[#F5F5F5] border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] mr-1">&larr;</span>
                  {item}
                  <span className="text-[10px] text-[#94a3b8] ml-1">&rarr;</span>
                </div>
              </motion.div>
            ))}
            <span className="text-[10px] text-[#ef4444] font-bold ml-2">NULL</span>
          </>
        )}
      </div>
    </div>
  );
}

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { value: val, left: null, right: null };
  if (val < root.value) root.left = insertBST(root.left, val);
  else root.right = insertBST(root.right, val);
  return root;
}

function BinaryTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [input, setInput] = useState('');
  const [traversal, setTraversal] = useState<number[]>([]);
  const [highlightVal, setHighlightVal] = useState(-1);

  function insert() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setRoot(insertBST(root ? { ...root } : null, val));
    setInput('');
  }

  function inorder(node: TreeNode | null): number[] {
    if (!node) return [];
    return [...inorder(node.left), node.value, ...inorder(node.right)];
  }

  function preorder(node: TreeNode | null): number[] {
    if (!node) return [];
    return [node.value, ...preorder(node.left), ...preorder(node.right)];
  }

  function postorder(node: TreeNode | null): number[] {
    if (!node) return [];
    return [...postorder(node.left), ...postorder(node.right), node.value];
  }

  async function animateTraversal(order: number[]) {
    setTraversal(order);
    for (const val of order) {
      setHighlightVal(val);
      await new Promise((r) => setTimeout(r, 500));
    }
    setHighlightVal(-1);
  }

  function renderTree(node: TreeNode | null, x: number, y: number, spread: number): React.ReactNode {
    if (!node) return null;
    const isHighlighted = node.value === highlightVal;
    return (
      <g>
        {node.left && (
          <line x1={x} y1={y} x2={x - spread} y2={y + 60} stroke="#1e293b" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={x} y1={y} x2={x + spread} y2={y + 60} stroke="#1e293b" strokeWidth="2" />
        )}
        <circle
          cx={x} cy={y} r="20"
          fill={isHighlighted ? '#00bcd4' : '#1e293b'}
          stroke={isHighlighted ? '#00bcd4' : '#1e293b'}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text x={x} y={y + 5} textAnchor="middle" fill={isHighlighted ? '#fff' : '#F5F5F5'} fontSize="12" fontWeight="bold">
          {node.value}
        </text>
        {renderTree(node.left, x - spread, y + 60, spread / 2)}
        {renderTree(node.right, x + spread, y + 60, spread / 2)}
      </g>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Valor" className="w-28" />
        <Button size="sm" onClick={insert}><Plus className="w-4 h-4 mr-1" />Insert</Button>
        <Button size="sm" variant="secondary" onClick={() => { if (root) animateTraversal(inorder(root)); }}>Inorder</Button>
        <Button size="sm" variant="secondary" onClick={() => { if (root) animateTraversal(preorder(root)); }}>Preorder</Button>
        <Button size="sm" variant="secondary" onClick={() => { if (root) animateTraversal(postorder(root)); }}>Postorder</Button>
        <Button size="sm" variant="ghost" onClick={() => { setRoot(null); setTraversal([]); }}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      {traversal.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#94a3b8]">Recorrido:</span>
          {traversal.map((v, i) => (
            <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium ${v === highlightVal ? 'bg-[#00bcd4] text-white' : 'bg-[#1e293b] text-[#F5F5F5]'}`}>
              {v}
            </span>
          ))}
        </div>
      )}
      <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden">
        <svg width="100%" height="300" viewBox="0 0 600 300">
          {root && renderTree(root, 300, 40, 120)}
          {!root && <text x="300" y="150" textAnchor="middle" fill="#94a3b8" fontSize="14">Inserta nodos para visualizar</text>}
        </svg>
      </div>
    </div>
  );
}

function HashTableVisualizer() {
  const [table, setTable] = useState<(null | { key: string; value: number })[]>(Array(8).fill(null));
  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(-1);

  function hash(key: string, size: number): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % size;
    return Math.abs(hash);
  }

  function insert() {
    if (!keyInput.trim()) return;
    const newTable = [...table];
    let idx = hash(keyInput, newTable.length);
    let attempts = 0;
    while (newTable[idx] !== null && attempts < newTable.length) {
      idx = (idx + 1) % newTable.length;
      attempts++;
    }
    newTable[idx] = { key: keyInput, value: parseInt(valInput) || 0 };
    setTable(newTable);
    setHighlightIdx(idx);
    setKeyInput('');
    setValInput('');
    setTimeout(() => setHighlightIdx(-1), 500);
  }

  function remove() {
    const newTable = [...table];
    let idx = hash(keyInput, newTable.length);
    let attempts = 0;
    while (newTable[idx] !== null && newTable[idx]?.key !== keyInput && attempts < newTable.length) {
      idx = (idx + 1) % newTable.length;
      attempts++;
    }
    if (newTable[idx]?.key === keyInput) {
      newTable[idx] = null;
      setTable(newTable);
    }
    setKeyInput('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="Clave" className="w-28" />
        <Input type="number" value={valInput} onChange={(e) => setValInput(e.target.value)} placeholder="Valor" className="w-28" />
        <Button size="sm" onClick={insert}><Plus className="w-4 h-4 mr-1" />Insert</Button>
        <Button size="sm" variant="danger" onClick={remove}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
        <Button size="sm" variant="ghost" onClick={() => setTable(Array(8).fill(null))}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {table.map((slot, i) => (
          <motion.div
            key={i}
            className={`rounded-lg p-3 text-center min-h-[80px] flex flex-col items-center justify-center transition-all ${
              i === highlightIdx ? 'bg-[#00bcd4]/20 border border-[#00bcd4]/50' : 'bg-[#111827] border border-[#1e293b]'
            }`}
          >
            <span className="text-[10px] text-[#94a3b8] mb-1">[{i}]</span>
            {slot ? (
              <>
                <span className="text-xs font-medium text-[#F5F5F5]">{slot.key}</span>
                <span className="text-[10px] text-[#00bcd4]">{slot.value}</span>
              </>
            ) : (
              <span className="text-[10px] text-[#1e293b]">empty</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HeapVisualizer() {
  const [items, setItems] = useState<number[]>([]);
  const [input, setInput] = useState('');

  function insert() {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const newItems = [...items, val];
    let i = newItems.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (newItems[parent] > newItems[i]) {
        [newItems[parent], newItems[i]] = [newItems[i], newItems[parent]];
        i = parent;
      } else break;
    }
    setItems(newItems);
    setInput('');
  }

  function extractMin() {
    if (items.length === 0) return;
    const newItems = [...items];
    newItems[0] = newItems[newItems.length - 1];
    newItems.pop();
    let i = 0;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < newItems.length && newItems[left] < newItems[smallest]) smallest = left;
      if (right < newItems.length && newItems[right] < newItems[smallest]) smallest = right;
      if (smallest !== i) {
        [newItems[i], newItems[smallest]] = [newItems[smallest], newItems[i]];
        i = smallest;
      } else break;
    }
    setItems(newItems);
  }

  function renderHeap() {
    if (items.length === 0) return <p className="text-[#94a3b8] text-sm">Heap vacío</p>;
    const levels: number[][] = [];
    let idx = 0;
    let levelSize = 1;
    while (idx < items.length) {
      levels.push(items.slice(idx, idx + levelSize));
      idx += levelSize;
      levelSize *= 2;
    }
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        {levels.map((level, li) => (
          <div key={li} className="flex items-center gap-4">
            {level.map((val, vi) => (
              <motion.div
                key={`${li}-${vi}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                  li === 0 ? 'bg-[#00bcd4] text-white' : 'bg-[#1e293b] text-[#F5F5F5]'
                }`}
              >
                {val}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Valor" className="w-28" />
        <Button size="sm" onClick={insert}><Plus className="w-4 h-4 mr-1" />Insert</Button>
        <Button size="sm" variant="danger" onClick={extractMin}>Extract Min</Button>
        <Button size="sm" variant="ghost" onClick={() => setItems([])}><RotateCcw className="w-4 h-4" /></Button>
      </div>
      <div className="rounded-xl bg-[#111827] border border-[#1e293b] p-4 min-h-[200px]">
        {renderHeap()}
      </div>
    </div>
  );
}

const VISUALIZERS: Record<DSKind, React.ComponentType> = {
  stack: StackVisualizer,
  queue: QueueVisualizer,
  'linked-list': LinkedListVisualizer,
  'doubly-linked': DoublyLinkedListVisualizer,
  'binary-tree': BinaryTreeVisualizer,
  'hash-table': HashTableVisualizer,
  heap: HeapVisualizer,
};

const CODE_SNIPPETS: Record<DSKind, string> = {
  stack: `function push() {
  const val = parseInt(input);
  if (isNaN(val)) return;
  setItems([val, ...items]);
  setHighlight(0);
  setInput('');
  setTimeout(() => setHighlight(-1), 500);
}

function pop() {
  if (items.length === 0) return;
  setHighlight(0);
  setTimeout(() => {
    setItems(items.slice(1));
    setHighlight(-1);
  }, 300);
}
`,

  queue: `function enqueue() {
  const val = parseInt(input);
  if (isNaN(val)) return;
  setItems([...items, val]);
  setHighlight(items.length);
  setInput('');
  setTimeout(() => setHighlight(-1), 500);
}

function dequeue() {
  if (items.length === 0) return;
  setHighlight(0);
  setTimeout(() => {
    setItems(items.slice(1));
    setHighlight(-1);
  }, 300);
}
`,

  'binary-tree': `function insertBST(root, val) {
  if (!root) return { value: val, left: null, right: null };
  if (val < root.value) root.left = insertBST(root.left, val);
  else root.right = insertBST(root.right, val);
  return root;
}

function inorder(node) {
  if (!node) return [];
  return [...inorder(node.left), node.value, ...inorder(node.right)];
}
`,

  'linked-list': `function insertHead() { setItems([val, ...items]); }
function insertTail() { setItems([...items, val]); }
function deleteItem() { setItems(items.filter(v => v !== val)); }
`,

  'doubly-linked': `// Similar API to linked list but with both directions in UI
`,

  'hash-table': `function hash(key, size) { let hash = 0; for (let i=0;i<key.length;i++) hash = (hash*31 + key.charCodeAt(i)) % size; return Math.abs(hash); }
function insert() { /* probing and insert */ }
`,

  heap: `function insert() { /* push then sift-up to maintain heap property */ }
function extractMin() { /* remove root and heapify down */ }
`,
};

export default function DataStructuresPage() {
  const [active, setActive] = useState<DSKind>('stack');
  const info = DATA_STRUCTURES.find((d) => d.id === active)!;
  const Visualizer = VISUALIZERS[active];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-[#00bcd4]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
              Estructuras de <span className="gradient-text">Datos</span>
            </h1>
          </div>
          <p className="text-[#94a3b8]">Visualizadores interactivos para aprender estructuras de datos</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-10">
          {DATA_STRUCTURES.map((ds) => (
            <div key={ds.id} className="card p-5 border border-[#1e293b] bg-[#0f1720]/80">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-[#F5F5F5]">{ds.name}</h3>
                <Badge variant="success" className="text-xs uppercase tracking-[0.2em]">
                  {ds.id.replace('-', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-[#94a3b8] mb-4">{ds.description}</p>
              <div className="flex flex-wrap gap-2">
                {ds.operations.map((op) => (
                  <Badge key={op} variant="primary" className="text-[11px] py-1 px-2">
                    {op}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {DATA_STRUCTURES.map((ds) => (
            <button
              key={ds.id}
              onClick={() => setActive(ds.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === ds.id
                  ? 'bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/30'
                  : 'bg-[#111827] text-[#94a3b8] border border-[#1e293b] hover:border-[#00bcd4]/30 hover:text-[#00bcd4]'
              }`}
            >
              {ds.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-2">{info.name}</h2>
              <p className="text-sm text-[#94a3b8] mb-6">{info.description}</p>
              <Visualizer />
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#00bcd4]" /> Complejidad Big O
              </h3>
              <div className="space-y-2">
                {Object.entries(info.bigO).map(([op, complexity]) => (
                  <div key={op} className="flex items-center justify-between text-sm">
                    <span className="text-[#94a3b8]">{op}</span>
                    <Badge variant={complexity.includes('1') ? 'success' : 'primary'}>{complexity}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Operaciones</h3>
              <div className="space-y-1.5">
                {info.operations.map((op) => (
                  <div key={op} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <ChevronRight className="w-3 h-3 text-[#00bcd4]" />
                    {op}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#00bcd4]" /> Código (implementación)
              </h3>
              <div className="text-xs text-[#94a3b8] font-mono">
                <pre className="whitespace-pre-wrap max-h-48 overflow-auto p-3 rounded bg-[#080a0c]">{CODE_SNIPPETS[active]}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

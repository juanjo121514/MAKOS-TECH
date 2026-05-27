import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Maximize2, Network, Play, RotateCcw, Route, X } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';
import { getCatalogProducts } from '../../../lib/localCatalog';
import { MOCK_CATEGORIES } from '../../../constants/mockData';

type TreeNode = {
  id: string;
  label: string;
  children: TreeNode[];
};

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type GraphEdge = {
  from: string;
  to: string;
  label: string;
};

const GRAPH_NODES: GraphNode[] = [
  { id: 'supplier', label: 'Proveedor', x: 80, y: 120 },
  { id: 'warehouse', label: 'Bodega', x: 270, y: 70 },
  { id: 'store', label: 'MakosTech', x: 460, y: 120 },
  { id: 'delivery', label: 'Envio', x: 270, y: 220 },
  { id: 'customer', label: 'Cliente', x: 460, y: 260 },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: 'supplier', to: 'warehouse', label: 'abastece' },
  { from: 'warehouse', to: 'store', label: 'publica stock' },
  { from: 'store', to: 'delivery', label: 'despacha' },
  { from: 'delivery', to: 'customer', label: 'entrega' },
  { from: 'store', to: 'customer', label: 'soporte' },
];

function buildCatalogTree(): TreeNode {
  const products = getCatalogProducts();
  return {
    id: 'catalog',
    label: 'Catalogo MakosTech',
    children: MOCK_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.name,
      children: products
        .filter((product) => product.category?.slug === category.slug)
        .slice(0, 4)
        .map((product) => ({
          id: product.id,
          label: product.name,
          children: [],
        })),
    })),
  };
}

function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]) {
  const list: Record<string, string[]> = {};
  nodes.forEach((node) => {
    list[node.id] = [];
  });
  edges.forEach((edge) => {
    list[edge.from].push(edge.to);
  });
  return list;
}

function getNodeLevel(id: string) {
  if (id === 'catalog') return 0;
  if (id.startsWith('cat-')) return 1;
  return 2;
}

function renderTree(node: TreeNode, x: number, y: number, width: number): React.ReactNode {
  const nextY = y + 92;
  const children = node.children;
  const childGap = width / Math.max(children.length, 1);
  const level = getNodeLevel(node.id);
  const fill = level === 0 ? '#00bcd4' : level === 1 ? '#0ea5a4' : '#1e293b';

  return (
    <g key={node.id}>
      {children.map((child, index) => {
        const childX = x - width / 2 + childGap * index + childGap / 2;
        return (
          <g key={`${node.id}-${child.id}`}>
            <line x1={x} y1={y + 20} x2={childX} y2={nextY - 20} stroke="#1e293b" strokeWidth="2" />
            {renderTree(child, childX, nextY, child.children.length > 0 ? childGap : 90)}
          </g>
        );
      })}
      <rect x={x - 62} y={y - 20} width="124" height="40" rx="8" fill={fill} stroke="#164e63" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
        {node.label.length > 18 ? `${node.label.slice(0, 18)}...` : node.label}
      </text>
    </g>
  );
}

export default function NetworkPage() {
  const [visited, setVisited] = useState<string[]>([]);
  const [treeFullscreen, setTreeFullscreen] = useState(false);
  const catalogTree = useMemo(() => buildCatalogTree(), []);
  const adjacencyList = useMemo(() => buildAdjacencyList(GRAPH_NODES, GRAPH_EDGES), []);

  async function runTraversal() {
    const queue = ['supplier'];
    const seen = new Set<string>();
    const order: string[] = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (!node || seen.has(node)) continue;
      seen.add(node);
      order.push(node);
      setVisited([...order]);
      await new Promise((resolve) => setTimeout(resolve, 450));
      adjacencyList[node].forEach((neighbor) => {
        if (!seen.has(neighbor)) queue.push(neighbor);
      });
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-[#00bcd4]" />
            </div>
            <h1 className="text-3xl font-bold text-[#F5F5F5]">Red logistica</h1>
          </div>
          <p className="text-[#94a3b8] max-w-2xl">
            Evidencia de uso de arboles y grafos dentro del ecommerce: jerarquia del catalogo y recorrido del flujo comercial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-[#F5F5F5] flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-[#00bcd4]" />
                  Arbol del catalogo
                </h2>
                <p className="mt-2 text-sm text-[#94a3b8]">
                  La raiz es el catalogo, sus hijos son categorias y las hojas son productos.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Tree</Badge>
                <Button size="sm" variant="ghost" onClick={() => setTreeFullscreen(true)}>
                  <Maximize2 className="w-4 h-4 mr-1" />
                  Ampliar
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-x-auto">
              <svg width="920" height="420" viewBox="0 0 920 420">
                {renderTree(catalogTree, 460, 42, 840)}
              </svg>
            </div>
          </section>

          <section className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-[#F5F5F5] flex items-center gap-2">
                  <Route className="w-5 h-5 text-[#00bcd4]" />
                  Grafo de operacion
                </h2>
                <p className="mt-2 text-sm text-[#94a3b8]">
                  Los nodos representan actores del negocio y las aristas muestran relaciones del flujo de venta.
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={runTraversal}>
                  <Play className="w-4 h-4 mr-1" />
                  Recorrer
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setVisited([])}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden mb-4">
              <svg width="100%" height="340" viewBox="0 0 540 340">
                {GRAPH_EDGES.map((edge) => {
                  const from = GRAPH_NODES.find((node) => node.id === edge.from)!;
                  const to = GRAPH_NODES.find((node) => node.id === edge.to)!;
                  const active = visited.includes(edge.from) && visited.includes(edge.to);
                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? '#00bcd4' : '#1e293b'} strokeWidth="3" />
                      <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} textAnchor="middle" fill="#94a3b8" fontSize="10">
                        {edge.label}
                      </text>
                    </g>
                  );
                })}
                {GRAPH_NODES.map((node) => {
                  const active = visited.includes(node.id);
                  return (
                    <g key={node.id}>
                      <circle cx={node.x} cy={node.y} r="30" fill={active ? '#00bcd4' : '#1e293b'} stroke={active ? '#00bcd4' : '#164e63'} strokeWidth="2" />
                      <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(adjacencyList).map(([node, neighbors]) => (
                <div key={node} className="rounded-lg bg-[#111827] border border-[#1e293b] p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#00bcd4]">{node}</p>
                  <p className="text-sm text-[#94a3b8] mt-1">{neighbors.length > 0 ? neighbors.join(', ') : 'sin salidas'}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {treeFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#060a0d]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#1e293b] bg-[#0f1720]">
                <div>
                  <h2 className="text-xl font-semibold text-[#F5F5F5] flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#00bcd4]" />
                    Árbol del catálogo MakosTech
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-1">
                    Jerarquía completa: catálogo, categorías y productos.
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setTreeFullscreen(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cerrar
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="min-w-[1280px] min-h-[720px] rounded-xl bg-[#111827] border border-[#1e293b] flex items-center justify-center">
                  <svg width="1280" height="720" viewBox="0 0 1280 720">
                    {renderTree(catalogTree, 640, 70, 1160)}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

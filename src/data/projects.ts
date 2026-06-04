export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  detail: string;
  github?: string;
  demo?: string;
  site?: string;
  status?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'module-explorer',
    title: 'Module Explorer',
    description: 'Interactive prerequisite graph and completion planner for university modules.',
    tags: ['TypeScript', 'Vite', 'Canvas', 'Data Visualisation'],
    github: 'https://github.com/TheFirstIstari/module-graph',
    site: '/module-explorer/',
    status: 'Live',
    featured: true,
    detail: 'Canvas-based graph explorer generated from module data. It lays out modules by level and term, traces prerequisite trees, highlights unlocked follow-on modules, filters by pathway/search, and includes a planner mode for marking completed modules and seeing eligible next choices.',
  },
  {
    id: 'desimapper',
    title: 'DesiMapper',
    description: '3D DESI DR1 galaxy-survey visualiser: data pipeline, Blender cinematic, and interactive Three.js/WebGL point cloud.',
    tags: ['Python', 'Three.js', 'Blender', 'Astronomy'],
    github: 'https://github.com/TheFirstIstari/DesiMapper',
    site: 'https://desi.tweak.wiki',
    status: 'Live',
    featured: true,
    detail: 'Processes DESI LSS clustering catalogues for BGS, LRG, ELG and QSO tracers. Raw FITS files are fetched, converted to Parquet, projected from RA/Dec/redshift to 3D Cartesian coordinates, then downsampled to ~500k browser points. The cinematic is rendered via Blender Python and exported as MP4.',
  },
  {
    id: 'ihavewatched',
    title: 'IHaveWatched',
    description: 'Collaborative watchparty tracker with real-time boards, TMDB search, TV hierarchy imports, and per-person watch state.',
    tags: ['Next.js', 'Rust', 'SpacetimeDB', 'React'],
    github: 'https://github.com/TheFirstIstari/whathaveiwatched',
    status: 'Active',
    featured: true,
    detail: 'Uses a Rust SpacetimeDB module with Next.js 16 App Router. Boards sync over WebSocket subscriptions, invite links add participants, TMDB route handlers fetch media metadata, and react-konva renders a zoomable node canvas with show → season → episode collapse levels.',
  },
  {
    id: 'traincraft',
    title: 'Traincraft',
    description: 'Minecraft 1.21.1 / NeoForge rewrite of the original Traincraft mod: locomotives, rails, machinery, and 80+ items.',
    tags: ['Java', 'NeoForge', 'Minecraft'],
    github: 'https://github.com/TheFirstIstari/Traincraft',
    status: 'Current',
    featured: true,
    detail: 'Complete rewrite targeting NeoForge 21.1.2. Includes 20 blocks, 80+ items, industrial machinery, oil/petrol systems, steel/copper/curved rails, and drivable rolling stock with fuel-gated acceleration, steam whistle and persistent coupling physics.',
  },
  {
    id: 'slstudio',
    title: 'SL Studio',
    description: 'Local-first forensic document analysis platform for PDFs, images, audio, and DOCX evidence files.',
    tags: ['Tauri', 'Rust', 'SvelteKit', 'LLM', 'Forensics'],
    github: 'https://github.com/TheFirstIstari/sl-studio',
    status: 'Prototype',
    detail: 'Built on Tauri 2 + Rust with a SvelteKit 5 frontend. Fully local-first — runs LLMs on-device via llama.cpp with Metal acceleration, so evidence never leaves the machine and chain-of-custody stays intact. Pipelines cover document analysis, OCR, financial crimes and audio; exports JSON, CSV, PDF and Excel.',
  },
  {
    id: 'fervo',
    title: 'fervo',
    description: 'Draft protocol specification for federated, auditable zero-trust voting in open-source governance.',
    tags: ['Protocol', 'ZK-Proofs', 'Cryptography'],
    status: 'Draft',
    detail: 'Separates voter identity from cast ballot via Semaphore-style Groth16 Merkle membership proofs. Supports public-signed and secret-ballot modes with append-only transparency logs and planned Rust crates for core types, circuits, consensus, tally and verification.',
  },
  {
    id: 'steinline',
    title: 'Project SteinLine',
    description: 'Asymmetric distributed forensic platform: low-power storage nodes feed GPU inference, visualised on an infinite canvas.',
    tags: ['Python', 'CUDA', 'ML', 'Distributed'],
    github: 'https://github.com/TheFirstIstari/Project-SteinLine',
    detail: 'Asymmetric architecture pairs low-power Raspberry Pi 5 storage nodes with RTX 3090/4090 GPU compute. Processes documents, images and video with multimodal ML models, recursive windowing, PDF deconstruction, OCR and audio transcription. Source evidence is mounted strictly read-only to preserve integrity.',
  },
  {
    id: 'trackbound',
    title: 'TrackBound',
    description: 'Flutter app for railway enthusiasts to log, visualise and share train journeys on a bundled rail network.',
    tags: ['Flutter', 'Dart', 'Maps'],
    github: 'https://github.com/TheFirstIstari/TrackBound',
    detail: 'Ships with precomputed rail edges loaded into SQLite. Users toggle travelled segments on the map, reset progress, hard-reset rail data, and receive automatic reseeds when seed fingerprints, counts or schema versions change.',
  },
  {
    id: 'badapplestein',
    title: 'BadAppleStein',
    description: 'Reconstructs high-contrast video by matching frames to closest pages from a PDF library.',
    tags: ['Python', 'C', 'FFmpeg'],
    github: 'https://github.com/TheFirstIstari/BadAppleStein',
    demo: 'https://www.youtube.com/watch?v=Ia1wR8HScm0',
    detail: 'C matching core compiled to a shared object and called from Python. Multiple arrangement scripts choose PDF pages per frame; render scripts assemble quality/speed variants; FFmpeg encodes final video.',
  },
  {
    id: 'ccc-gcc',
    title: 'CCC - GCC Studio',
    description: 'Flask tool that diffs the assembly output of two C compiler backends for the same source snippet.',
    tags: ['Python', 'Flask', 'C'],
    github: 'https://github.com/TheFirstIstari/GCC-CCC-comparison',
    detail: 'Browser form submits C source. The backend compiles it through two different compiler backends, disassembles each binary, and returns side-by-side assembly for studying code-generation and optimisation differences.',
  },
  {
    id: 'benchmarks',
    title: 'Benchmarks',
    description: 'Cross-language benchmark suite for C, C++, Rust, Python and Java with interactive TUI results.',
    tags: ['C', 'Rust', 'Python', 'Benchmarks'],
    github: 'https://github.com/TheFirstIstari/Benchmarks',
    detail: 'Benchmarks 12 categories including matrix ops, sorting, hashing, regex, JSON, file I/O, networking, cryptography and concurrency. Results persist to SQLite and can be explored through graph/table TUI views.',
  },
];

export const featuredProjects = projects.filter(project => project.featured);
export const allTags = [...new Set(projects.flatMap(project => project.tags))];

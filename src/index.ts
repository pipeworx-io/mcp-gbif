/**
 * GBIF MCP — wraps the Global Biodiversity Information Facility API v1 (free, no auth)
 *
 * Tools:
 * - search_species: full-text search across the GBIF species backbone
 * - get_species: retrieve a single species record by its GBIF taxon key
 * - get_occurrences: retrieve occurrence records for a taxon, optionally filtered by country
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.gbif.org/v1';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_species',
    description:
      'Search GBIF species backbone by name or keyword. Returns matched taxa with rank, status, and classification.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Species name or keyword (e.g., "Homo sapiens", "oak")' },
        limit: { type: 'number', description: 'Maximum results to return (1-100, default 20)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_species',
    description:
      'Get full taxonomic details for a GBIF species by its integer taxon key. Use search_species first to find the key.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        key: { type: 'number', description: 'GBIF taxon key (integer)' },
      },
      required: ['key'],
    },
  },
  {
    name: 'get_occurrences',
    description:
      'Retrieve georeferenced occurrence records for a taxon. Optionally filter by ISO 3166-1 alpha-2 country code.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        key: { type: 'number', description: 'GBIF taxon key (integer)' },
        limit: { type: 'number', description: 'Maximum records to return (1-300, default 20)' },
        country: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code to filter occurrences (e.g., "US", "DE")',
        },
      },
      required: ['key'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_species':
      return searchSpecies(args.query as string, (args.limit as number) ?? 20);
    case 'get_species':
      return getSpecies(args.key as number);
    case 'get_occurrences':
      return getOccurrences(
        args.key as number,
        (args.limit as number) ?? 20,
        args.country as string | undefined,
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchSpecies(query: string, limit: number) {
  const params = new URLSearchParams({ q: query, limit: String(Math.min(100, Math.max(1, limit))) });
  const res = await fetch(`${BASE_URL}/species/search?${params}`);
  if (!res.ok) throw new Error(`GBIF error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    results?: {
      key: number;
      scientificName?: string;
      canonicalName?: string;
      rank?: string;
      status?: string;
      kingdom?: string;
      phylum?: string;
      class?: string;
      order?: string;
      family?: string;
      genus?: string;
      species?: string;
      numDescendants?: number;
    }[];
    count?: number;
    endOfRecords?: boolean;
  };

  return {
    count: data.count ?? 0,
    end_of_records: data.endOfRecords ?? true,
    results: (data.results ?? []).map((r) => ({
      key: r.key,
      scientific_name: r.scientificName ?? null,
      canonical_name: r.canonicalName ?? null,
      rank: r.rank ?? null,
      status: r.status ?? null,
      kingdom: r.kingdom ?? null,
      phylum: r.phylum ?? null,
      class: r.class ?? null,
      order: r.order ?? null,
      family: r.family ?? null,
      genus: r.genus ?? null,
      species: r.species ?? null,
      num_descendants: r.numDescendants ?? null,
    })),
  };
}

async function getSpecies(key: number) {
  const res = await fetch(`${BASE_URL}/species/${key}`);
  if (!res.ok) throw new Error(`GBIF error: ${res.status} ${res.statusText}`);

  const r = (await res.json()) as {
    key: number;
    scientificName?: string;
    canonicalName?: string;
    rank?: string;
    taxonomicStatus?: string;
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
    species?: string;
    authorship?: string;
    nameType?: string;
    numDescendants?: number;
    numOccurrences?: number;
    habitats?: string[];
    extinct?: boolean;
    marine?: boolean;
    freshwater?: boolean;
    terrestrial?: boolean;
  };

  return {
    key: r.key,
    scientific_name: r.scientificName ?? null,
    canonical_name: r.canonicalName ?? null,
    rank: r.rank ?? null,
    taxonomic_status: r.taxonomicStatus ?? null,
    authorship: r.authorship ?? null,
    name_type: r.nameType ?? null,
    kingdom: r.kingdom ?? null,
    phylum: r.phylum ?? null,
    class: r.class ?? null,
    order: r.order ?? null,
    family: r.family ?? null,
    genus: r.genus ?? null,
    species: r.species ?? null,
    num_descendants: r.numDescendants ?? null,
    num_occurrences: r.numOccurrences ?? null,
    extinct: r.extinct ?? null,
    marine: r.marine ?? null,
    freshwater: r.freshwater ?? null,
    terrestrial: r.terrestrial ?? null,
    habitats: r.habitats ?? [],
  };
}

async function getOccurrences(key: number, limit: number, country?: string) {
  const params = new URLSearchParams({
    taxonKey: String(key),
    limit: String(Math.min(300, Math.max(1, limit))),
  });
  if (country) params.set('country', country);

  const res = await fetch(`${BASE_URL}/occurrence/search?${params}`);
  if (!res.ok) throw new Error(`GBIF error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    results?: {
      key: number;
      scientificName?: string;
      decimalLatitude?: number;
      decimalLongitude?: number;
      country?: string;
      stateProvince?: string;
      locality?: string;
      eventDate?: string;
      basisOfRecord?: string;
      institutionCode?: string;
      collectionCode?: string;
      catalogNumber?: string;
    }[];
    count?: number;
    endOfRecords?: boolean;
  };

  return {
    total: data.count ?? 0,
    end_of_records: data.endOfRecords ?? true,
    occurrences: (data.results ?? []).map((o) => ({
      key: o.key,
      scientific_name: o.scientificName ?? null,
      latitude: o.decimalLatitude ?? null,
      longitude: o.decimalLongitude ?? null,
      country: o.country ?? null,
      state_province: o.stateProvince ?? null,
      locality: o.locality ?? null,
      event_date: o.eventDate ?? null,
      basis_of_record: o.basisOfRecord ?? null,
      institution: o.institutionCode ?? null,
      collection: o.collectionCode ?? null,
      catalog_number: o.catalogNumber ?? null,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;

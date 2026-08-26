# mcp-gbif

GBIF MCP — wraps the Global Biodiversity Information Facility API v1 (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_species` | Search for species by common or scientific name. Returns matched taxa with rank, classification status, and taxonomic hierarchy. Use get_species with the taxon key for full details. |
| `get_species` | Get complete taxonomic classification for a species (kingdom through subspecies). Requires taxon key from search_species. Returns all ranks and accepted name status. |
| `get_occurrences` | Get georeferenced observation records for a species with coordinates, dates, and sources. Pass either `name` (a scientific name like "Danaus plexippus" — resolved automatically) or a numeric GBIF backbone `key`. Filter by country code (e.g., 'US', 'BR', 'AU') to narrow results geographically. |
| `occurrences_near` | Find species occurrence records NEAR a location (latitude/longitude + radius). PREFER for "what species/wildlife are found near here", "what birds/plants occur around these coordinates", "is <species> recorded near this spot". Optionally filter by a GBIF taxon key (from search_species) to a group or species — e.g. 212 = birds, 6 = plants, 359 = mammals. Returns georeferenced records with species name, date, locality, and source. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "gbif": {
      "url": "https://gateway.pipeworx.io/gbif/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/gbif/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Gbif data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

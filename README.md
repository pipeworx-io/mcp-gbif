# mcp-gbif

GBIF MCP — wraps the Global Biodiversity Information Facility API v1 (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Gbif data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

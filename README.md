# mcp-gbif

MCP server for biodiversity data via the [Global Biodiversity Information Facility (GBIF) API](https://www.gbif.org/developer/summary). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `search_species` | Search GBIF species backbone by name or keyword |
| `get_species` | Get full taxonomic details for a species by taxon key |
| `get_occurrences` | Retrieve georeferenced occurrence records for a taxon |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "gbif_search_species",
      "arguments": { "query": "Homo sapiens" }
    },
    "id": 1
  }'
```

## License

MIT

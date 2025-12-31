# Index System

This directory contains the indexing and search system for Infinity Matrix.

## Purpose

The Index System provides:
- Fast document search
- Content indexing
- Knowledge discovery
- Cross-referencing

## Features

### Document Indexing
- Automatic indexing of all documentation
- Markdown file parsing
- Metadata extraction
- Full-text search capabilities

### Search Functionality
- Keyword search
- Fuzzy matching
- Context-aware results
- Relevance ranking

### Cross-Referencing
- Automatic link detection
- Related content suggestions
- Dependency mapping
- Knowledge graph generation

## Architecture

```
index_system/
├── README.md           # This file
├── indexer/           # Document indexing
├── search/            # Search engine
├── analyzer/          # Content analysis
└── data/              # Index storage
```

## Index Structure

### Document Index
```json
{
  "documents": [
    {
      "id": "unique-id",
      "path": "docs/sops/system-overview.md",
      "title": "System Overview SOP",
      "type": "sop",
      "content": "indexed content",
      "keywords": ["system", "overview", "architecture"],
      "links": ["related-doc-id"],
      "last_updated": "2024-12-30T00:00:00Z"
    }
  ]
}
```

## Usage

### Building the Index

```bash
# Build complete index
python index_system/indexer/build_index.py

# Rebuild specific directory
python index_system/indexer/build_index.py --path docs/sops/

# Update index incrementally
python index_system/indexer/update_index.py
```

### Searching

```bash
# Search for documents
python index_system/search/search.py "tracking system"

# Search with filters
python index_system/search/search.py "workflow" --type sop

# Get related documents
python index_system/search/related.py docs/sops/system-overview.md
```

## Automatic Updates

The index is automatically updated:
- When documentation changes
- On SOP generation
- During workflow runs
- Via scheduled maintenance

## Search API

### Python API
```python
from index_system import search

# Basic search
results = search.query("tracking")

# Advanced search
results = search.query(
    text="tracking",
    doc_type="sop",
    max_results=10
)

# Get related docs
related = search.related("docs/sops/system-overview.md")
```

### Command Line
```bash
# Quick search
./index_system/search.sh "tracking"

# JSON output
./index_system/search.sh "tracking" --json
```

## Integration

### Dashboard Integration
- Search box on admin dashboard
- Quick document access
- Related content suggestions

### Workflow Integration
- Update index on document changes
- Validate cross-references
- Detect broken links

### Knowledge Base Integration
- Automatic linking in Knowledge Library
- Topic clustering
- Content recommendations

## Performance

### Indexing
- Full index build: ~30 seconds (typical repo)
- Incremental update: <5 seconds
- Real-time search: <100ms

### Storage
- Index size: ~10% of document size
- Compressed storage
- Efficient data structures

## Configuration

### index_config.json
```json
{
  "paths": [
    "docs/",
    "infinity_library/",
    ".github/workflows/"
  ],
  "file_types": [".md", ".yml", ".yaml"],
  "exclude": ["node_modules", ".git"],
  "update_frequency": "on_change"
}
```

## Maintenance

### Regular Tasks
- Rebuild index weekly
- Validate links monthly
- Optimize storage quarterly
- Update algorithms as needed

### Troubleshooting
- Clear index cache
- Rebuild from scratch
- Check file permissions
- Validate configuration

## Future Enhancements

### Planned Features
- Semantic search
- ML-based relevance
- Natural language queries
- Visual knowledge graph

### Research Areas
- Vector embeddings
- Neural search
- Context understanding
- Auto-summarization

## References

- [System Architecture](../infinity_library/architecture/README.md)
- [Knowledge Library](../infinity_library/README.md)
- [Implementation Guides](../infinity_library/guides/README.md)

---

**Auto-tracked by Infinity Matrix System**

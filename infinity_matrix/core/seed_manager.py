"""Seed manager for industry seeds and data sources."""

import os
from pathlib import Path
from typing import Dict, List, Optional
import yaml

from infinity_matrix.models import (
    Industry,
    IndustryType,
    DataSource,
    SourceType,
    SeedUrl,
)


class SeedManager:
    """Manages industry seeds and data source configurations."""
    
    def __init__(self, config_dir: str = "config"):
        """Initialize seed manager."""
        self.config_dir = Path(config_dir)
        self.industries_dir = self.config_dir / "industries"
        self.sources_dir = self.config_dir / "sources"
        
        self._industries: Dict[str, Industry] = {}
        self._sources: Dict[str, DataSource] = {}
        self._seeds: Dict[str, List[SeedUrl]] = {}
        
        self._load_all()
    
    def _load_all(self):
        """Load all configurations."""
        self._load_industries()
        self._load_sources()
        self._load_seeds()
    
    def _load_industries(self):
        """Load industry configurations."""
        if not self.industries_dir.exists():
            return
        
        for config_file in self.industries_dir.glob("*.yaml"):
            with open(config_file, 'r') as f:
                data = yaml.safe_load(f)
                if data:
                    industry = Industry(**data)
                    self._industries[industry.id] = industry
    
    def _load_sources(self):
        """Load data source configurations."""
        if not self.sources_dir.exists():
            return
        
        for config_file in self.sources_dir.glob("*.yaml"):
            with open(config_file, 'r') as f:
                data = yaml.safe_load(f)
                if data and isinstance(data, list):
                    for source_data in data:
                        source = DataSource(**source_data)
                        self._sources[source.id] = source
    
    def _load_seeds(self):
        """Load seed URLs from industry configurations."""
        for industry_id, industry in self._industries.items():
            seeds_key = f"{industry_id}_seeds"
            config_file = self.industries_dir / f"{industry_id}.yaml"
            
            if config_file.exists():
                with open(config_file, 'r') as f:
                    data = yaml.safe_load(f)
                    if data and "seeds" in data:
                        seeds = []
                        for seed_data in data["seeds"]:
                            seed = SeedUrl(
                                industry_id=industry_id,
                                **seed_data
                            )
                            seeds.append(seed)
                        self._seeds[industry_id] = seeds
    
    def get_industry(self, industry_id: str) -> Optional[Industry]:
        """Get industry by ID."""
        return self._industries.get(industry_id)
    
    def get_all_industries(self) -> List[Industry]:
        """Get all industries."""
        return list(self._industries.values())
    
    def get_enabled_industries(self) -> List[Industry]:
        """Get all enabled industries."""
        return [ind for ind in self._industries.values() if ind.enabled]
    
    def get_source(self, source_id: str) -> Optional[DataSource]:
        """Get data source by ID."""
        return self._sources.get(source_id)
    
    def get_sources_by_industry(self, industry_id: str) -> List[DataSource]:
        """Get all data sources for an industry."""
        return [
            src for src in self._sources.values()
            if src.industry_id == industry_id and src.enabled
        ]
    
    def get_seeds_by_industry(self, industry_id: str) -> List[SeedUrl]:
        """Get seed URLs for an industry."""
        return self._seeds.get(industry_id, [])
    
    def add_seed(self, seed: SeedUrl):
        """Add a seed URL."""
        if seed.industry_id not in self._seeds:
            self._seeds[seed.industry_id] = []
        self._seeds[seed.industry_id].append(seed)
    
    def get_all_seeds(self) -> List[SeedUrl]:
        """Get all seed URLs."""
        all_seeds = []
        for seeds in self._seeds.values():
            all_seeds.extend(seeds)
        return all_seeds

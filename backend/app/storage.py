from pathlib import Path
from typing import Any
import json

from .config import settings


class LocalStorage:
    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        self.assets = self.root / "assets"
        self.scenes = self.root / "scenes"
        self.motions = self.root / "motions"
        self.exports = self.root / "exports"

    def ensure(self) -> None:
        for path in [self.assets, self.scenes, self.motions, self.exports]:
            path.mkdir(parents=True, exist_ok=True)

    def read_json(self, path: Path, fallback: Any) -> Any:
        if not path.exists():
            return fallback

        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)

    def write_json(self, path: Path, payload: Any) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2)


storage = LocalStorage(settings.storage_root)

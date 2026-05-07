from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    storage_root: Path = Path("..")
    renderer_command: str = "npm --workspace renderer run render"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="STUDIO_",
        extra="ignore",
    )


settings = Settings()

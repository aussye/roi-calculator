#!/usr/bin/env python3
"""
Generate visual assets for the ROI Calculator using Nano Banana (Gemini image generation).
Generates a premium header graphic and icon set in SLE brand colors.
"""

import base64
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

# Load env from multi-model-orchestrator (has the same API key)
SKILL_DIR = Path(__file__).parent.parent.parent.parent / ".claude" / "skills" / "recreate-thumbnails"
load_dotenv(SKILL_DIR / ".env")

API_KEY = os.getenv("NANO_BANANA_API_KEY")
if not API_KEY:
    # Fallback: try multi-model-orchestrator .env
    SKILL_DIR2 = Path(__file__).parent.parent.parent.parent / ".claude" / "skills" / "multi-model-orchestrator"
    load_dotenv(SKILL_DIR2 / ".env")
    API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("ERROR: No API key found (checked NANO_BANANA_API_KEY and GEMINI_API_KEY)", file=sys.stderr)
    sys.exit(1)

MODEL = "gemini-3-pro-image-preview"
OUTPUT_DIR = Path(__file__).parent.parent / "public"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

client = genai.Client(api_key=API_KEY)


def generate_image(prompt: str, filename: str, width: int = 1200, height: int = 400) -> bool:
    """Generate a single image asset."""
    print(f"\nGenerating: {filename}...")

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )

        if response.candidates and response.candidates[0].content:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    data = part.inline_data.data
                    if data:
                        img_bytes = base64.b64decode(data) if isinstance(data, str) else data
                        img = Image.open(io.BytesIO(img_bytes))
                        # Resize to target dimensions
                        img = img.resize((width, height), Image.Resampling.LANCZOS)
                        output_path = OUTPUT_DIR / filename
                        img.save(output_path, "PNG", optimize=True)
                        print(f"  Saved: {output_path}")
                        return True
                elif hasattr(part, 'text') and part.text:
                    print(f"  Model note: {part.text[:200]}")

        print(f"  No image generated for {filename}")
        return False

    except Exception as e:
        print(f"  Error: {e}")
        return False


def main():
    # Generate header background graphic — wide banner with electrical/growth theme
    header_prompt = """Create a wide panoramic abstract header graphic for a professional business calculator tool.

Style: Modern, clean, premium SaaS aesthetic. Minimal and sleek.
Colors: Use a gradient flowing from teal (#3fb3d4) to dark blue (#2980b9) with subtle white highlights.
Elements: Abstract geometric circuit-board lines and nodes subtly transitioning into an upward growth chart/arrow shape. Very subtle, elegant, not busy.
Format: Wide horizontal banner (3:1 ratio). The graphic should work as a background behind white/light text.
NO TEXT in the image. Pure graphic/pattern only.
The image should feel professional, trustworthy, and growth-oriented — suitable for an electrical services business."""

    # Generate a decorative graphic for the ROI summary section
    roi_prompt = """Create a small square icon/illustration showing business growth.

Style: Modern flat illustration, clean lines, minimal.
Colors: Teal (#3fb3d4) as primary, dark blue (#2980b9) as secondary, with a pop of green (#22c55e) for the upward trend.
Elements: An upward-trending arrow or chart line with dollar signs, representing revenue growth. Clean, professional, not cartoonish.
Background: Transparent or very light (#f9fafb).
NO TEXT. Pure visual icon/illustration.
Size: Square format, suitable for use at 200x200px."""

    results = []
    results.append(generate_image(header_prompt, "header-bg.png", 1200, 400))
    results.append(generate_image(roi_prompt, "roi-growth.png", 400, 400))

    success = sum(1 for r in results if r)
    print(f"\nDone: {success}/{len(results)} images generated successfully")


if __name__ == "__main__":
    main()

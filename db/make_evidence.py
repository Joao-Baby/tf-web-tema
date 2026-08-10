"""Converte os prints do Prisma Studio (webp) em PNGs para o README."""
from PIL import Image

files = {
    "/tmp/overview.webp": "evidencia_prisma_overview",
    "/tmp/produtos.webp": "evidencia_prisma_produtos",
    "/tmp/grade.webp": "evidencia_prisma_grade",
}

for src, base in files.items():
    img = Image.open(src).convert("RGB")
    # Recortar área central relevante (remove marcações do overlay de debug se houver nas bordas)
    img.save(f"/home/ubuntu/tico-de-gente/db/{base}.png")
    print(f"{base}.png -> {img.size}")

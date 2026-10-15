// Optional SVG -> PNG rasterisation for chat clients that only render images. Uses `sharp` (already a project
// dependency); if it is unavailable the caller gets a clear error and can fall back to the SVG/HTML output.

export async function svgToPng(svg, { width } = {}) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch (err) {
    const e = new Error('PNG output needs the "sharp" package, which could not be loaded');
    e.code = 'PNG_UNAVAILABLE';
    e.cause = err;
    throw e;
  }
  const img = sharp(Buffer.from(svg), { density: 144 });
  return (width ? img.resize({ width }) : img).png({ compressionLevel: 9 }).toBuffer();
}

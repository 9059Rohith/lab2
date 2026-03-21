import './AssetShowcase.css';

const assetModules = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default'
});

const assetItems = Object.entries(assetModules)
  .map(([path, src]) => {
    const fileName = path.split('/').pop() || 'asset';
    const title = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      src,
      fileName,
      title
    };
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName));

function AssetShowcase() {
  return (
    <section className="asset-showcase" aria-label="Visual learning assets">
      <h2 className="asset-showcase-title">Visual Discovery Gallery</h2>
      <p className="asset-showcase-subtitle">
        Every artwork from our learning library is included to keep the experience rich and engaging.
      </p>
      <div className="asset-rail" role="list">
        <div className="asset-rail-track">
          {assetItems.map((asset) => (
            <figure className="asset-card" key={asset.fileName} role="listitem">
              <img src={asset.src} alt={asset.title} loading="lazy" />
              <figcaption>{asset.title}</figcaption>
            </figure>
          ))}
          {assetItems.map((asset) => (
            <figure className="asset-card" key={`${asset.fileName}-duplicate`} role="listitem" aria-hidden="true">
              <img src={asset.src} alt="" loading="lazy" />
              <figcaption>{asset.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AssetShowcase;

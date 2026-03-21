import { useMemo } from 'react';
import { ASSET_FILES } from '../data/assetsData';

export default function FloatingAssets() {
  const config = useMemo(
    () =>
      ASSET_FILES.map((name, index) => ({
        name,
        x: (index * 11) % 95,
        y: (index * 7) % 88,
        size: 42 + ((index * 5) % 55),
        duration: 18 + (index % 9),
        delay: (index % 12) * -1.1,
        opacity: 0.14 + ((index % 4) * 0.06)
      })),
    []
  );

  return (
    <div className="global-float-layer" aria-hidden="true">
      {config.map((item) => (
        <img
          key={item.name}
          className="global-float-item"
          src={`/image/${encodeURIComponent(item.name)}`}
          alt=""
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            opacity: item.opacity
          }}
        />
      ))}
    </div>
  );
}

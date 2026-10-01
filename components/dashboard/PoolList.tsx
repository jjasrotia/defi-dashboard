import { ArrowUpRight, Droplets, MoreHorizontal } from "lucide-react";

export const pools = [
  { pair: "ETH / USDC", protocol: "Uniswap V3", tvl: "$842.6M", apy: "8.42%", tags: ["ETH", "USDC"] },
  { pair: "stETH / ETH", protocol: "Curve", tvl: "$624.8M", apy: "7.81%", tags: ["stETH", "ETH"] },
  { pair: "WBTC / ETH", protocol: "Uniswap V3", tvl: "$418.2M", apy: "5.63%", tags: ["WBTC", "ETH"] },
  { pair: "USDC / DAI", protocol: "Curve", tvl: "$291.4M", apy: "4.92%", tags: ["USDC", "DAI"] },
];

export default function PoolList({ query = "" }: { query?: string }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePools = pools.filter((pool) =>
    `${pool.pair} ${pool.protocol} ${pool.tags.join(" ")}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <div className="panel data-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Discover</p><h2>Top pools</h2></div>
        <button aria-label="Pool options" className="icon-button panel-more" type="button"><MoreHorizontal size={19} /></button>
      </div>
      <div className="pool-list">
        {visiblePools.map((pool) => (
          <a className="pool-row" href="#pools" key={pool.pair}>
            <span className={`pool-token-stack pool-tone-${pools.indexOf(pool)}`}>
              <span>{pool.tags[0].slice(0, 1)}</span><span>{pool.tags[1].slice(0, 1)}</span>
            </span>
            <span className="pool-identity"><strong>{pool.pair}</strong><small>{pool.protocol} <span>·</span> TVL {pool.tvl}</small></span>
            <span className="pool-apy"><strong>{pool.apy}</strong><small>APY</small></span>
          </a>
        ))}
        {visiblePools.length === 0 && <p className="empty-search-result">No pools match “{query}”.</p>}
      </div>
      <a className="panel-footer-link" href="#pools">Explore all pools <ArrowUpRight size={15} /></a>
      <div className="pool-note"><Droplets size={14} /> Rates are variable and may change.</div>
    </div>
  );
}
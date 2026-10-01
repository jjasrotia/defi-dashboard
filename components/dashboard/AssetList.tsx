import { ArrowUpRight, MoreHorizontal } from "lucide-react";

export const assets = [
  { symbol: "ETH", name: "Ethereum", amount: "4.28 ETH", price: "$3,526.18", value: "$15,091.05", change: "+2.42%", color: "eth" },
  { symbol: "BTC", name: "Bitcoin", amount: "0.084 BTC", price: "$67,420.00", value: "$5,663.28", change: "+1.18%", color: "btc" },
  { symbol: "USDC", name: "USD Coin", amount: "2,840.50 USDC", price: "$1.00", value: "$2,840.50", change: "0.01%", color: "usdc" },
  { symbol: "UNI", name: "Uniswap", amount: "72.14 UNI", price: "$13.64", value: "$984.39", change: "+5.67%", color: "uni" },
];

export default function AssetList({ query = "" }: { query?: string }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleAssets = assets.filter((asset) =>
    `${asset.symbol} ${asset.name} ${asset.amount}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <div className="panel data-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Holdings</p><h2>Your assets</h2></div>
        <button aria-label="Asset options" className="icon-button panel-more" type="button"><MoreHorizontal size={19} /></button>
      </div>
      <div className="asset-table">
        <div className="table-header asset-row"><span>Asset</span><span>Price</span><span>24h</span><span>Value</span></div>
        {visibleAssets.map((asset) => (
          <div className="asset-row" key={asset.symbol}>
            <div className="asset-identity">
              <span className={`token-icon token-${asset.color}`}>{asset.symbol.slice(0, 1)}</span>
              <span className="asset-name"><strong>{asset.name}</strong><small>{asset.amount}</small></span>
            </div>
            <span className="asset-price">{asset.price}</span>
            <span className={`asset-change${asset.change.startsWith("+") ? " is-positive" : ""}`}>{asset.change}</span>
            <span className="asset-value">{asset.value}</span>
          </div>
        ))}
        {visibleAssets.length === 0 && <p className="empty-search-result">No assets match “{query}”.</p>}
      </div>
      <a className="panel-footer-link" href="#assets">View all assets <ArrowUpRight size={15} /></a>
    </div>
  );
}
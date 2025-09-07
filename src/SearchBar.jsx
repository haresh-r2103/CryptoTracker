import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const CryptoPortfolio = () => {
  const [crypto, setCrypto] = useState("");
  const [info, setInfo] = useState(null);
  const [price, setPrice] = useState(null);
  const [qty, setQty] = useState("");
  const [myStock, setMyStock] = useState([]);
  const [totAsset, settotAsset] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {})
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch coin details
  const getDetails = async () => {
    if (!crypto.trim()) {
      alert("Enter proper crypto name!!");
      return;
    }

    setLoading(true);
    try {
      // 1. Search coin
      const init = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${crypto}`
      );
      const data = await init.json();

      if (data.coins && data.coins.length > 0) {
        const firstCoin = data.coins[0];
        setInfo(firstCoin);

        // 2. Fetch price
        const priceRes = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${firstCoin.id}&vs_currencies=usd&include_24hr_change=true`
        );
        const priceData = await priceRes.json();
        
        setPrice({
          current: priceData[firstCoin.id].usd,
          change: priceData[firstCoin.id].usd_24h_change
        });
      } else {
        setInfo(null);
        setPrice(null);
        alert("No coin found!");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add to portfolio
  const addCrypto = () => {
    if (!info || !price || !qty) {
      alert("Please fetch a coin and enter quantity!");
      return;
    }

    const totalCost = qty * price.current;

    const newEntry = {
      id: info.id,
      name: info.name,
      symbol: info.symbol.toUpperCase(),
      thumb: info.thumb,
      qty: Number(qty),
      price: price.current,
      total: totalCost.toFixed(2),
      purchasePrice: price.current
    };

    // Check if already in portfolio
    const existingIndex = myStock.findIndex(item => item.id === info.id);
    let updatedStock;
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedStock = [...myStock];
      updatedStock[existingIndex] = {
        ...updatedStock[existingIndex],
        qty: Number(updatedStock[existingIndex].qty) + Number(qty),
        total: (Number(updatedStock[existingIndex].total) + totalCost).toFixed(2)
      };
    } else {

        updatedStock = [...myStock, newEntry];
    }

    setMyStock(updatedStock);
    settotAsset(prev => prev + totalCost);
    setQty("");
  };

  const removeCrypto = (id) => {
    const itemToRemove = myStock.find(item => item.id === id);
    if (itemToRemove) {
      settotAsset(prev => prev - Number(itemToRemove.total));
      setMyStock(myStock.filter(item => item.id !== id));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateProfitLoss = (purchasePrice, currentPrice, quantity) => {
    const profitLoss = (currentPrice - purchasePrice) * quantity;
    return {
      value: profitLoss,
      percent: purchasePrice > 0 ? ((currentPrice - purchasePrice) / purchasePrice) * 100 : 0
    };
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      

      <main>
        <section className="section">
          <h2 className="section-title"><i className="fas fa-search"></i> Add Coin to Portfolio</h2>
          <div className="card">
            <div className="search-container">
              <div className="input-group">
                <label htmlFor="coinSearch">Coin Name</label>
                <input
                  type="text"
                  id="coinSearch"
                  placeholder="e.g., Bitcoin"
                  value={crypto}
                  onChange={(e) => setCrypto(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="coinAmount">Amount</label>
                <input
                  type="number"
                  id="coinAmount"
                  placeholder="e.g., 0.5"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary" onClick={getDetails} disabled={loading}>
              {loading ? <div className="loading"></div> : <i className="fas fa-search"></i>}
              {loading ? 'Searching...' : 'Search Coin'}
            </button>
          </div>
        </section>

        {/* Coin Info */}
        {info && (
          <section className="section">
            <h2 className="section-title"><i className="fas fa-chart-line"></i> Coin Information</h2>
            <div className="card coin-info">
              <h3>{info.name} ({info.symbol.toUpperCase()})</h3>
              <img src={info.thumb} alt={info.name} />
              {price !== null && (
                <>
                  <div className="coin-price">
                    {formatCurrency(price.current)} 
                    <span className={`price-change ${price.change >= 0 ? 'positive' : 'negative'}`}>
                      {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
                    </span>
                  </div>
                  <button className="btn btn-success" onClick={addCrypto}>
                    <i className="fas fa-plus"></i> Add to Portfolio
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {/* Portfolio Section */}
        <section className="section portfolio">
          <h2 className="section-title"><i className="fas fa-wallet"></i> Your Portfolio</h2>
          
          {myStock.length > 0 ? (
            <div className="portfolio-grid">
              {myStock.map((item, index) => {
                const profitLoss = calculateProfitLoss(item.purchasePrice, price?.current || item.price, item.qty);
                return (
                  <div className="portfolio-item" key={index}>
                    <div className="portfolio-header">
                      <span className="coin-name">
                        <img src={item.thumb} alt={item.name} className="coin-thumb" />
                        {item.name} ({item.symbol})
                      </span>
                      <span className="coin-amount">{item.qty}</span>
                    </div>
                    <div className="portfolio-details">
                      <div className="detail-item">
                        <span className="detail-label">Current Value</span>
                        <span className="detail-value">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Purchase Price</span>
                        <span className="detail-value">{formatCurrency(item.purchasePrice)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Profit/Loss</span>
                        <span className={`detail-value ${profitLoss.value >= 0 ? 'positive' : 'negative'}`}>
                          {formatCurrency(profitLoss.value)} ({profitLoss.percent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <div className="portfolio-actions">
                      <button className="btn btn-sm btn-danger" onClick={() => removeCrypto(item.id)}>
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card empty-state">
              <i className="fas fa-inbox"></i>
              <h3>Your portfolio is empty</h3>
              <p>Add some coins to get started</p>
            </div>
          )}
        </section>

        {/* Total Assets */}
        <div className="total">
          <span className="total-label">Total Portfolio Value:</span>
          <span className="total-value">{formatCurrency(totAsset)}</span>
        </div>
      </main>
    </div>
  );
};

export default CryptoPortfolio;
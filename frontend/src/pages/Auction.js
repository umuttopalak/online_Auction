import React, { useState } from "react";

const productList = [
  { id: 1, name: "Ürün 1", description: "Açıklama 1", price: 100 },
  { id: 2, name: "Ürün 2", description: "Açıklama 2", price: 200 },
  { id: 3, name: "Ürün 3", description: "Açıklama 3", price: 300 }
];

function Auction() {
  const [bids, setBids] = useState({});

  function handleBid(product, bid) {
    if (bid > product.price) {
      setBids(prevBids => ({ ...prevBids, [product.id]: bid }));
    }
  }

  const products = productList.map(product => (
    <div key={product.id}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Fiyat: {product.price} TL</p>
      <p>Son teklif: {bids[product.id] || "Henüz bir teklif yok"}</p>
      <input
        type="number"
        value={bids[product.id] || product.price}
        onChange={event => handleBid(product, Number(event.target.value))}
      />
      <button onClick={() => handleBid(product, bids[product.id] + 50)}>
        Teklif Ver
      </button>
    </div>
  ));

  return (
    <div>
      <h1>Açık Artırma</h1>
      {products}
    </div>
  );
}

export default Auction;
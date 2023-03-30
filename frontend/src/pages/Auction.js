import React from 'react';
import useWs from '../hooks/useWs';
import { useSignOut, useAuthUser } from 'react-auth-kit'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Auction(props) {


  //  SAYFA YENİLENDİĞİNDE VEYA KAPATILDĞIĞINDA OTOMATİK LOGOUT

  const signOut = useSignOut()
  const { sendMessage, messages } = useWs("ws://localhost:8000/ws");
  const auth = useAuthUser()
  const username_ = auth().username
  const navigate = useNavigate();

  const logOut = () => {
    signOut()
    navigate("/login")
  }


  const handleClick = (productId, productPrice, productLastPrice) => {

    if (productLastPrice === 0) {
      productLastPrice = productPrice;
    }

    const message = {
      type: 'set_bid',
      id: productId,
      username: username_,
      bid: productLastPrice + 50
    }
    const messageJson = JSON.stringify(message)
    sendMessage(messageJson)

  };


  //#region DATABASEDEN PRODUCTSLARI ÇEKME
  //const [products, setProducts] = useState([]);  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await fetch('http://localhost:8000/api/products');
  //     const data = await result.json();
  //     setProducts(data);
  //   };

  //   fetchData();
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 10000); // 10 saniyede bir sorgula

  //   return () => clearInterval(interval);
  // }, []);
  //#endregion

  return (
    <>
      <div className="exit-button"><button className='btn' onClick={() => {
        logOut()
      }}>Log Out</button></div>

      {messages.map((product) => (
        <div id={product.id} className="container py-5 d-flex justify-content-center">
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm" style={{ "border": "0px" }}>
              <img className="card-img-top" src={require('../photos/' + product.id + '.jpg')} alt="bulunamadı" />
              <div className="card-body" style={{ border: "0px !important", borderRadius: "0px !important" }}>
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text"><strong>Son Teklifi Veren:</strong> {product.username === null ? ("Henüz Teklif Verilmedi") : product.username}</p>
                <p className="card-text"><strong>En Yüksek Teklif: </strong>{product.lastprice === 0 ? "Teklif Verilmedi" : `${product.lastprice} TL`}</p>
                <p className="card-text"><strong>Başlangıç Fiyatı: </strong>{product.price}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    {product.username === username_ ? (
                      <p className="btn">TEKLİF VERİLDİ</p>
                    ) : (
                      <button className="btn" type="button" onClick={() => handleClick(product.id, product.price, product.lastprice)}>Teklif Ver</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      ))}
    </>
  )
}


export default Auction;
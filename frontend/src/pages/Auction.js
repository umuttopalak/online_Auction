import React from 'react';
import '../LogRegPage.css'
import useWs from '../hooks/useWs';
import { useAuthUser } from 'react-auth-kit'


function Auction(props) {

  const { sendMessage, messages } = useWs("ws://localhost:8000/ws");

  const auth = useAuthUser()
  const username_ = auth().username

  const handleClick = (productId, productPrice, productLastPrice) => {
    
    if(productLastPrice === 0){
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
    <div className='justify-content-center'>
      {messages.map(product => (
        <section key={product.id} id={product.id}>
          <div className="container py-5">
            <div className="row justify-content-center mb-3">
              <div className="col-md-12 col-xl-10">
                <div className="">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                        <div className="bg-image hover-zoom ripple rounded ripple-surface">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(4).webp" alt='Resim Bulunamadı'
                            className="w-100" />
                          <a href="#!">
                            <div className="hover-overlay">
                              <div className="mask"></div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6 col-xl-6">
                        <br />
                        <h5>Quant trident shirts</h5>
                        <div className="d-flex flex-row">
                          <div className="text-danger mb-1 me-2">
                            <i className="fa fa-star">{product.username}</i>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-horizontal">
                        <br />
                        <div className="d-flex flex-row align-items-center mb-1">
                          <h4 className="mb-1 me-1">{product.lastprice === 0 ? product.price : product.lastprice} TL</h4>
                          <span className="text-nowrap">{product.lastprice === 0 ? ("Teklif Verilmedi") : <>{product.price} TL</>}</span>

                        </div>
                        <h6 className="">Kargo Ücreti Yok</h6>
                        <div className="d-flex flex-column mt-4">
                          <button className="btn" type="button" onClick={() => {
                            handleClick(product.id, product.price , product.lastprice)
                          }}>Teklif Ver</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >
      ))
      }
    </div >

  );

}


export default Auction;
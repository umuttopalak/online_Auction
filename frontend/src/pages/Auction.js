import React, { useState, useEffect } from 'react';
import '../LogRegPage.css'
import useWs from '../hooks/useWs';

function Auction(props) {

  const [products, setProducts] = useState([]);

  const offer = (product) => {

    let _product = {
      'id': product.id,
      'name': product.name,
      'price': product.price,
      'lastprice': product.lastprice,
      'username': props.username
    }
  }

  const { sendMessage } = useWs("ws://localhost:8000/ws");

  const handleClick = () => {
    
    const message = {
      type: 'set_bid',
      id: 1,
      username: props.username,
      bid: lastprice + 50
    }
    const messageJson = JSON.stringify(message)
    sendMessage(messageJson)

  };


  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('http://localhost:8000/api/products');
      const data = await result.json();
      setProducts(data);
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // 10 saniyede bir sorgula

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='justify-content-center'>
      {products.map(product => (
        <section>
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
                          <h4 className="mb-1 me-1">{product.price} TL</h4>
                          <span className="text-nowrap">{product.lastprice === 0 ? ("Teklif Verilmedi") : <>{product.price}</>}</span>
                        </div>
                        <h6 className="">Kargo Ücreti Yok</h6>
                        <div className="d-flex flex-column mt-4">
                          <button className="btn" type="button" onClick={() => {
                            handleClick()
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

  

  return (
    <div>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );

}


export default Auction;
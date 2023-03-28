import React, { useState, useEffect } from 'react';
import '../LogRegPage.css'
function Auction(props) {
  const [products, setProducts] = useState([]);

  const offer = (product) => {

    let _product = {
      'id': product.id,
      'name' : product.name,
      'price' : product.price,
      'lastprice' : product.lastprice,
       'username' :props.username  }
  }

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
          <div class="container py-5">
            <div class="row justify-content-center mb-3">
              <div class="col-md-12 col-xl-10">
                <div class="">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                        <div class="bg-image hover-zoom ripple rounded ripple-surface">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(4).webp" alt='Resim Bulunamadı'
                            class="w-100" />
                          <a href="#!">
                            <div class="hover-overlay">
                              <div class="mask"></div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-6 col-xl-6">
                        <br/>
                        <h5>Quant trident shirts</h5>
                        <div class="d-flex flex-row">
                          <div class="text-danger mb-1 me-2">
                            <i class="fa fa-star">{product.username}</i>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-horizontal">
                        <br/>
                        <div class="d-flex flex-row align-items-center mb-1">
                          <h4 class="mb-1 me-1">{product.price} TL</h4>
                          <span class="text-nowrap">{product.lastprice === 0 ? ("Teklif Verilmedi") : <>{product.price}</>}</span>
                        </div>
                        <h6 class="">Kargo Ücreti Yok</h6>
                        <div class="d-flex flex-column mt-4">
                          <button class="btn" type="button" onClick={() => {
                            offer(product)
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
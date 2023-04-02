import React from 'react';
import useWs from '../hooks/useWs';
import { useSignOut, useAuthUser } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Auction(props) {


  const signOut = useSignOut()
  const { sendMessage, messages } = useWs("ws://localhost:8000/ws");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem('username')


  const logOut = () => {
    signOut()
    navigate("/login")

    const options = {
      url: 'http://localhost:8000/logout',
      method: 'POST',
      headers: { "Authorization": `Bearer ${token}` }
    };

    axios(options)
      .then(response => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
      }).catch((error) => {
        console.log(error)
      })
  }

  

  const handleClick = async (productId, productPrice, productLastPrice) => {

    if (productLastPrice === 0) {
      productLastPrice = productPrice;
    }
    const message = {
      type: 'set_bid',
      id: productId,
      username: localStorage.getItem('username'),
      bid: productLastPrice + 50
    }
    const messageJson = JSON.stringify(message)
    sendMessage(messageJson)
  };

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
                <p className="card-text"><strong>Bidder:</strong> {product.username === null ? ("No Offer") : product.username}</p>
                <p className="card-text"><strong>Bid: </strong>{product.lastprice === 0 ? "No Offer" : `${product.lastprice} TL`}</p>
                <p className="card-text"><strong>Starting Price : </strong>{product.price}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    {product.username === username ? (
                      <p className="btn">Offered</p>
                    ) : (
                      <button className="btn" type="button" onClick={() => handleClick(product.id, product.price, product.lastprice)}>Offer</button>
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
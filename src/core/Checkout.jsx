import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import {
  getBraintreeClientToken,
  processPayment,
  createOrder
} from "./apiCore";
import DropIn from "braintree-web-drop-in-react";
import { emptyCart } from "./cartHelpers";

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: ""
  });

  // get user and token data from local storage
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  // get braintree token from back-end
  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  // total ammount
  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  // handle address
  const handleAddress = event => {
    setData({ ...data, address: event.target.value });
  };

  // showcheckout ui
  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  const deliveryAddress = data.address;

  const buy = () => {
    setData({ ...data, loading: true });
    // send the instance to the server
    let nonce;
    data.instance
      .requestPaymentMethod()
      .then(data => {
        console.log(data);
        nonce = data.nonce;
        // once you have nonce (card type, card number etc) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log("send nonce and total to process:", nonce, getTotal());
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal()
        };

        processPayment(userId, token, paymentData)
          .then(response => {
            setData({ ...data, success: response.success });
            // create order
            const createOrderData = {
              products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress
            };
            createOrder(userId, token, createOrderData)
              .then(response => {
                // empty cart
                emptyCart(() => {
                  console.log("payment success and empty cart");
                  setData({ ...data, loading: false, success: true });
                });
              })
              .catch(error => {
                console.log(error);
                setData({ loading: false });
              });
          })
          .catch(error => {
            setData({ ...data, loading: true });
            console.log(error);
          });
      })
      .catch(error => {
        console.log("dropin error:", error);
        setData({ ...data, error: error.message });
      });
  };

  // show drop in
  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery address: </label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your deliver address here..."
            />
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: { flow: "vault" }
            }}
            onInstance={instance => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  // show payment error
  const showError = error => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  // show loading
  const showLoading = loading => loading && <h2>Loading..</h2>;

  // show payment success
  const showSuccess = success => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thank you! Your payment was successful!
    </div>
  );

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showError(data.error)}
      {showSuccess(data.success)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;

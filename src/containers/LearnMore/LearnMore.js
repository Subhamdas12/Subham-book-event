import React, { useEffect, useState } from "react";
import "./learnMore.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { dataBookSelector } from "../../store/selectors";
import backarrow from "../../assets/back-arrow.png";
import Blockies from "react-blockies";
import {
  buyTicket,
  getTicketRemaining,
  loadAccount,
} from "../../store/interactions";

if (window.performance) {
  if (performance.navigation.type === 1) {
    window.location.replace("/");
  }
}
const LearnMore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const account = useSelector((state) => state.provider.account);
  const provider = useSelector((state) => state.provider.connection);
  const event = useSelector((state) => state.event.contract);
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.provider.balance);
  const ticketRemain = useSelector((state) => state.event.ticketRemain);
  const setPrice = (e, eachAmount) => {
    setTotalAmount(e.target.value * eachAmount);
    setAmountFund(e.target.value);
  };

  let id = location.state.id;
  let indexCard = location.state.indexCard;

  const [amountFund, setAmountFund] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  let orderData = useSelector(dataBookSelector);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      totalAmount < Number(balance) &&
      Number(amountFund) < orderData[indexCard].formattedTicketRemaining
    ) {
      await buyTicket(
        id,
        amountFund,
        totalAmount,
        event,
        account,
        dispatch,
        provider
      );
    } else {
      alert(
        "Please write a ticket lesser then the ticket remaining or write a balance less then your account balance"
      );
    }
    setAmountFund(0);
    loadAccount(provider, dispatch);
    navigate("/");
  };

  useEffect(() => {
    if (account) {
      getTicketRemaining(id, event, dispatch);
    }
  });
  return (
    <div className="container">
      {account ? (
        <form onSubmit={submitHandler}>
          <div className="header">
            <div id="backdiv">
              <Link to="/">
                <img src={backarrow} className="backButton" alt="" />
              </Link>
            </div>
          </div>
          <h1>{orderData[indexCard] && orderData[indexCard].name}</h1>
          <div className="learnMore__firstLayer">
            <div className="learnMore__firstLayer-left">
              <img
                id="funding_image"
                src={orderData[indexCard] && orderData[indexCard].imageURL}
                alt=""
              />
            </div>
            <div className="learnMore__firstLayer-right">
              <div className="learnMore__firstLayer-right_blocks">
                <h3>{orderData[indexCard] && orderData[indexCard].daysLeft}</h3>
                <p>Days Left</p>
              </div>
              <div className="learnMore__firstLayer-right_blocks">
                <h3>{ticketRemain}</h3>
                <p>
                  Sold out of{" "}
                  {orderData[indexCard] &&
                    Number(orderData[indexCard].formattedTicketCount)}
                </p>
              </div>
              <div className="learnMore__firstLayer-right_blocks">
                <h3>{orderData[indexCard].formattedDate}</h3>
                <p>Date</p>
              </div>
            </div>
          </div>
          <div className="learnMore__secondLayer">
            <div className="learnMore__secondLayer-creator">
              <h4>CREATOR</h4>
              <a href="#">
                <Blockies
                  seed={orderData[indexCard] && orderData[indexCard].owner}
                  size={10}
                  scale={3}
                  color="#2187D0"
                  bgColor="#F1F2F9"
                  spotColor="#767F92"
                  className="identicon"
                />
                <h3>{`By ${
                  orderData[indexCard] && orderData[indexCard].owner.slice(0, 5)
                }....${
                  orderData[indexCard] &&
                  orderData[indexCard].owner.slice(38, 42)
                }`}</h3>
              </a>
            </div>
            <div className="learnMore__secondLayer-description">
              <h4>PRICE</h4>
              <p>
                {orderData[indexCard] && orderData[indexCard].priceFormatted}{" "}
                ETH
              </p>
            </div>
          </div>
          <br />
          <br />
          <label htmlFor="target">BUY TICKET</label>
          <br />
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            required
            placeholder="ETH 0.1"
            value={amountFund === 0 ? "" : amountFund}
            onChange={(e) => setPrice(e, orderData[indexCard].priceFormatted)}
          />
          <br />
          <h5>total price is {totalAmount}</h5>
          <br />
          <input type="submit" value="Buy Tickets" />
        </form>
      ) : (
        <h1>Please connect to metamask</h1>
      )}
    </div>
  );
};

export default LearnMore;

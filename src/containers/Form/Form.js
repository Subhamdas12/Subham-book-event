import React, { useState } from "react";
import "./form.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitForm } from "../../store/interactions";
import backarrow from "../../assets/back-arrow.png";
if (window.performance) {
  if (performance.navigation.type === 1) {
    window.location.replace("/");
  }
}
const Form = () => {
  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);
  const dispatch = useDispatch();
  const event = useSelector((state) => state.event.contract);

  const [name, setName] = useState(0);
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [imageURL, setImageURL] = useState(0);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (price < 1000) {
      await submitForm(
        account,
        name,
        price,
        date,
        ticketCount,
        imageURL,
        provider,
        event,
        dispatch
      );
      setName(0);
      setPrice(0);
      setDate(0);
      setTicketCount(0);
      setImageURL(0);
    } else {
      alert("The ticket price should be less then 999");
    }
  };

  return (
    <div className="Form">
      <div>
        {account ? (
          <form onSubmit={submitHandler}>
            <div className="header">
              <div id="backdiv">
                <Link to="/">
                  <img src={backarrow} className="backButton" alt="" />
                </Link>
              </div>
              <h1>Create Event</h1>
            </div>
            <br />
            <label htmlFor="title">Name of event:</label>
            <br />
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Blockchain bootcamp"
              required
              value={name === 0 ? "" : name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="deadline">Date:</label>
            <br />
            <input
              type="date"
              id="deadline"
              name="deadline"
              required
              value={date === 0 ? "" : date}
              onChange={(e) => setDate(e.target.value)}
            />
            <br />
            <label htmlFor="target">Price:</label>
            <br />
            <input
              type="number"
              id="target"
              name="target"
              placeholder="0.1ETH"
              required
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label htmlFor="target">Number of tickets:</label>
            <br />
            <input
              type="number"
              id="target"
              name="target"
              placeholder="100"
              required
              value={ticketCount === 0 ? "" : ticketCount}
              onChange={(e) => setTicketCount(e.target.value)}
            />
            <br />

            <br />
            <label htmlFor="target">Image URL:</label>
            <br />
            <input
              type="text"
              id="imageURL"
              name="imageURL"
              required
              value={imageURL === 0 ? "" : imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
            <br />

            <input type="submit" value="Submit" />
          </form>
        ) : (
          <h1 id="connect_first">Please connect using metamask</h1>
        )}
      </div>
    </div>
  );
};

export default Form;

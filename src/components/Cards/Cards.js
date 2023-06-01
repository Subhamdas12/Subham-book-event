import "./cards.css";
import Blockies from "react-blockies";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Cards = (props) => {
  const account = useSelector((state) => state.provider.account);
  const navigate = useNavigate();
  const learnMoreHandler = () => {
    navigate("/LearnMore", {
      state: { indexCard: props.indexCard, id: props.id },
    });
  };
  return (
    <div className="card">
      <img src={props.imageURL} alt="Sample " />
      <div className="content">
        <div className="card_title">
          <h2 className="card_title">
            {" "}
            {props.name ? props.name.slice(0, 26) : ""}
          </h2>
        </div>
        <div className="card__description">
          {props.ticketRemain
            ? `${props.ticketRemain} left out of ${props.ticketCount}`
            : ""}
        </div>

        <div className="card__middle">
          <div>
            <h3>{props.date}</h3>
            <p>Date</p>
          </div>
          <div>
            <h3>{Number(props.price).toFixed(4)} ETH</h3>
            <p>{`Ticket Price`}</p>
          </div>
        </div>
        <div className="buttonspace">
          {account ? (
            <button onClick={learnMoreHandler}>Learn More</button>
          ) : (
            <h5>Connect to Metamask to LearnMore</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;

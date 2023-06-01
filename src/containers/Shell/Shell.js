import React from "react";
import "./shell.css";
import { Cards, Navbar } from "../../components";
import { useSelector } from "react-redux";
import { dataBookSelector } from "../../store/selectors";
const Shell = () => {
  const orderData = useSelector(dataBookSelector);
  return (
    <div className="shell">
      <Navbar />
      <div className="projectBody">
        {orderData &&
          orderData.map((data, index) => {
            return (
              <Cards
                key={index}
                indexCard={index.toString()}
                id={data.idFormatted}
                name={data.name}
                date={data.formattedDate}
                price={data.priceFormatted}
                imageURL={data.imageURL}
                ticketCount={data.formattedTicketCount}
                ticketRemain={data.formattedTicketRemaining}
                daysLeft={data.daysLeft}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Shell;

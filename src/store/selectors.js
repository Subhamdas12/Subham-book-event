import { ethers } from "ethers";
import { get } from "lodash";
import { createSelector } from "reselect";
const allData = (state) => get(state, "event.allEvents.data");
const events = (state) => get(state, "event.events");
const buyData = (state) => get(state, "event.buyEvents.data");
export const dataBookSelector = createSelector(
  allData,
  buyData,
  (data, buy) => {
    data = decorateOpenData(data);
    buy = decorateBuyData(buy);
    buy = removeDuplicateTickets(buy);
    data = compareAndSetFormattedTicketRemaining(data, buy);
    data = data.sort((a, b) => a.idFormatted - b.idFormatted);
    console.log(buy);
    console.log(data);
    return data;
  }
);
const decorateOpenData = (datas) => {
  return datas.map((data) => {
    data = decorateOrder(data);
    return data;
  });
};
const decorateOrder = (data) => {
  const precision = 100000;
  let priceFormatted = ethers.utils.formatEther(data.price);
  let idFormatted = Math.round(data.id * precision) / precision;
  let formattedTicketCount =
    Math.round(data.ticketCount * precision) / precision;
  let formattedTicketRemaining =
    Math.round(data.ticketRemain * precision) / precision;
  let formattedDate = Math.floor(parseInt(data.date) / 1);
  let todays_date = new Date().getTime();
  todays_date = Math.floor(todays_date / 1000);
  let difference = formattedDate - todays_date;
  let daysLeft = Math.floor(difference / 86400);
  formattedDate = new Date(formattedDate * 1000);
  formattedDate = formattedDate.toLocaleDateString("en-GB");
  return {
    ...data,
    priceFormatted,
    idFormatted,
    formattedTicketCount,
    formattedTicketRemaining,
    formattedDate,
    daysLeft,
  };
};
const decorateBuyData = (datas) => {
  return datas.map((data) => {
    data = decorateBuy(data);
    return data;
  });
};

const decorateBuy = (data) => {
  const precision = 100000;
  let idFormatted = Math.round(data.id * precision) / precision;
  let formattedTicketRemaining =
    Math.round(data.ticketRemain * precision) / precision;
  return {
    ...data,
    idFormatted,
    formattedTicketRemaining,
  };
};

function removeDuplicateTickets(tickets) {
  const ticketMap = {};

  for (const ticket of tickets) {
    const ticketId = ticket.idFormatted;
    const ticketRemaining = ticket.formattedTicketRemaining;

    if (ticketId in ticketMap) {
      if (ticketRemaining < ticketMap[ticketId].formattedTicketRemaining) {
        ticketMap[ticketId] = ticket;
      }
    } else {
      ticketMap[ticketId] = ticket;
    }
  }

  return Object.values(ticketMap);
}
function compareAndSetFormattedTicketRemaining(a, b) {
  // Iterate through each object in 'a' and 'b'
  for (let i = 0; i < a.length; i++) {
    const aObj = a[i];
    const aId = aObj.idFormatted;

    // Find the matching object in 'b' with the same 'idFormatted'
    const bObj = b.find((obj) => obj.idFormatted === aId);

    // Compare and update 'formattedTicketRemaining' if necessary
    if (bObj && bObj.formattedTicketRemaining < aObj.formattedTicketRemaining) {
      aObj.formattedTicketRemaining = bObj.formattedTicketRemaining;
    }
  }

  return a;
}
export const myEventsSelector = createSelector(events, (events) => {
  return events;
});

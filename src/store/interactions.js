import { ethers } from "ethers";
import EVENT_ABI from "../abis/EventContract.json";
export const loadProvider = async (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};

export const loadAccountBalance = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);
  dispatch({ type: "ETHER_BALANCE_LOADED", balance });
};
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });
  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);
  dispatch({ type: "ETHER_BALANCE_LOADED", balance });
};
export const loadEvent = async (provider, address, dispatch) => {
  const event = new ethers.Contract(address, EVENT_ABI, provider);
  dispatch({ type: "EVENT_LOADED", event });
  return event;
};
export const submitForm = async (
  owner,
  name,
  price,
  date,
  ticketCount,
  imageURL,
  provider,
  event,
  dispatch
) => {
  let transaction;
  dispatch({ type: "NEW_FORM_LOADING" });
  try {
    const signer = await provider.getSigner();
    let formattedDate = Math.round(new Date(date).getTime() / 1000);
    console.log(`formatted date ${formattedDate} and input date is ${date}`);
    let formattedPrice = ethers.utils.parseEther(price);
    transaction = await event
      .connect(signer)
      .createEvent(
        owner,
        name,
        formattedDate,
        formattedPrice,
        imageURL,
        ticketCount
      );
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "NEW_FORM_FAIL" });
  }
};

export const buyTicket = async (
  id,
  amount,
  totalAmount,
  event,
  account,
  dispatch,
  provider
) => {
  let transaction;
  dispatch({ type: "BUY_REQUEST_INITIALIZED" });
  try {
    const signer = await provider.getSigner();
    transaction = await event.connect(signer).buyTicket(id, amount, {
      from: account,
      value: ethers.utils.parseEther(totalAmount.toString()),
    });
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "BUY_REQUEST_FAILED" });
  }
};

export const subscribeToEvent = (eventContract, dispatch) => {
  eventContract.on(
    "Event__CreateEvent",
    (
      id,
      owner,
      name,
      date,
      price,
      imageURL,
      ticketCount,
      ticketRemain,
      event
    ) => {
      const eventOrder = event.args;
      dispatch({ type: "NEW_FORM_SUCCESS", eventOrder, event });
    }
  );
  eventContract.on(
    "Event__BuyTicket",
    (id, owner, quantity, totalPrice, ticketRemain, event) => {
      const eventBuy = event.args;
      dispatch({ type: "BUY_REQUEST_SUCCESS", eventBuy, event });
    }
  );
};

export const loadAllData = async (provider, eventContract, dispatch) => {
  const block = await provider.getBlockNumber();
  const eventCreatingStream = await eventContract.queryFilter(
    "Event__CreateEvent",
    0,
    block
  );
  const eventCreating = eventCreatingStream.map((event) => event.args);
  dispatch({ type: "ALL_EVENTS_LOADED", eventCreating });
  const eventBuyStream = await eventContract.queryFilter(
    "Event__BuyTicket",
    0,
    block
  );
  const eventBuyAll = eventBuyStream.map((event) => event.args);
  console.log(eventBuyAll);
  dispatch({ type: "ALL_BUY_LOADED", eventBuyAll });
};
export const getTicketRemaining = async (id, event, dispatch) => {
  let ticketRemaining = await event.getTicketRemain(id);
  const precision = 100000;
  ticketRemaining = Math.round(ticketRemaining * precision) / precision;
  dispatch({ type: "GET_TICKET_REMAIN", ticketRemaining });
};

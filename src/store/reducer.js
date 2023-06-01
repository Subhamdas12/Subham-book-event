export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return { ...state, connection: action.connection };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "ETHER_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };
    default:
      return state;
  }
};

const DEFAULT_EVENT_STATE = {
  loaded: false,
  contract: {},
  transaction: {
    isSuccessful: false,
  },
  allEvents: {
    loaded: false,
    data: [],
  },
  buyEvents: {
    loaded: false,
    data: [],
  },
  events: [],
};
export const event = (state = DEFAULT_EVENT_STATE, action) => {
  let index, data;
  switch (action.type) {
    case "EVENT_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.event,
      };
    case "ALL_EVENTS_LOADED":
      return {
        ...state,
        allEvents: {
          loaded: true,
          data: action.eventCreating,
        },
      };
    case "ALL_BUY_LOADED":
      return {
        ...state,
        buyEvents: {
          loaded: true,
          data: action.eventBuyAll,
        },
      };
    //submitting new form
    case "NEW_FORM_LOADING":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessful: false,
        },
      };
    case "NEW_FORM_SUCCESS":
      index = state.allEvents.data.findIndex(
        (funding) => funding.id.toString() === action.eventOrder.id.toString()
      );
      if (index === -1) {
        data = [...state.allEvents.data, action.eventOrder];
      } else {
        data = state.allEvents.data;
      }
      return {
        ...state,
        allEvents: {
          ...state.allEvents,
          data,
        },
        transaction: {
          isPending: false,
          isSuccessful: true,
        },
        events: [action.event, ...state.events],
      };
    case "NEW_FORM_FAIL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isError: true,
          isSuccessful: false,
        },
      };
    ///buying new ticket
    case "BUY_REQUEST_INITIALIZED":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessful: false,
        },
        transferInProgress: false,
      };

    case "BUY_REQUEST_SUCCESS":
      index = state.buyEvents.data.findIndex(
        (funding) => funding.id.toString() === action.eventBuy.id.toString()
      );
      if (index === -1) {
        data = [...state.buyEvents.data, action.eventBuy];
        console.log("Same not found", data);
      } else {
        data = [...state.buyEvents.data];
        console.log("Same found", data);
      }
      return {
        ...state,
        buyEvents: {
          ...state.buyEvents,
          data,
        },
        transaction: {
          isPending: false,
          isSuccessful: true,
        },
        events: [action.event, ...state.events],
        transferInProgress: true,
      };
    case "BUY_REQUEST_FAILED":
      return {
        ...state,
        transaction: {
          isPending: false,
          isError: true,
          isSuccessful: false,
        },
        transferInProgress: false,
      };
    case "GET_TICKET_REMAIN":
      return {
        ...state,
        ticketRemain: action.ticketRemaining,
      };
    default:
      return state;
  }
};

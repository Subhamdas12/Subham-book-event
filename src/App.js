import { useDispatch } from "react-redux";
import "./App.css";
import { Alert, Navbar } from "./components";
import {
  loadAccount,
  loadAllData,
  loadEvent,
  loadNetwork,
  loadProvider,
  subscribeToEvent,
} from "./store/interactions";
import { useEffect } from "react";
import config from "./config.json";
import { Form, LearnMore, Shell } from "./containers";
import { Route, Routes } from "react-router-dom";
function App() {
  const dispatch = useDispatch();
  const loadBlockchainData = async () => {
    const provider = await loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch);
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
    const event_config = config[chainId].EventContract;
    const event = await loadEvent(provider, event_config.address, dispatch);
    subscribeToEvent(event, dispatch);
    loadAllData(provider, event, dispatch);
  };
  useEffect(() => {
    loadBlockchainData();
  });
  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<Shell />}></Route>
        <Route path="/Form" element={<Form />}></Route>
        <Route path="/LearnMore" element={<LearnMore />}></Route>
      </Routes>
      <Alert />
    </div>
  );
}

export default App;

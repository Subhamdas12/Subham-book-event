import "./navbar.css";
import config from "../../config.json";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import my from "../../assets/bookmyshow-logos-idASFvdnzd.png";
import {
  loadAccount,
  loadAccountBalance,
  loadBalance,
} from "../../store/interactions";
import Blockies from "react-blockies";
import { Link } from "react-router-dom";
const Navbar = () => {
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);
  const chainId = useSelector((state) => state.provider.chainId);
  const balance = useSelector((state) => state.provider.balance);
  const transferInProgress = useSelector(
    (state) => state.event.transferInProgress
  );
  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: e.target.value,
        },
      ],
    });
  };
  const connectionHandler = async () => {
    await loadAccount(provider, dispatch);
  };
  useEffect(() => {
    if (provider && dispatch && account) {
      loadAccountBalance(provider, dispatch);
    }
  }, [transferInProgress]);
  return (
    <div>
      <nav>
        <div className="navbar-title">
          <h3>Subham book</h3>
          <img src={my} className="mylogo" alt="" />
          <h3>event</h3>
        </div>
        <div className="middleSection">
          <select
            className="navbar-select"
            onChange={networkHandler}
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
          >
            <option value="0" disabled>
              Select Network
            </option>
            <option value="0x7A69">Localhost</option>
            <option value="0xaa36a7">Sepolia</option>
          </select>
        </div>
        <div className="navbar-buttons">
          <Link to="/Form">
            <button className="navbar-button">Create a event</button>
          </Link>
          <div className="userDetails">
            {balance ? (
              <p>
                <small>My Balance : </small>
                {Number(balance).toFixed(4)}
              </p>
            ) : (
              <p>
                <small>My Balance : </small>0 ETH
              </p>
            )}
            {account ? (
              <a
                href={
                  config[chainId]
                    ? `${config[chainId].explorerURL}/address/${account}`
                    : `#`
                }
                target="_blank"
                rel="noreferrer"
              >
                {account.slice(0, 5) + "...." + account.slice(38, 42)}
                <Blockies
                  seed={account}
                  size={10}
                  scale={3}
                  color="#2187D0"
                  bgColor="#F1F2F9"
                  spotColor="#767F92"
                  className="identicon"
                />
              </a>
            ) : (
              <button
                className="navbar-button connectButton"
                onClick={connectionHandler}
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

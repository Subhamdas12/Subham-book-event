const { ethers } = require("hardhat");
const config = require("../src/config.json");
const converter = (n) => {
  return ethers.utils.parseEther(n.toString());
};

const wait = (seconds) => {
  const millisecond = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, millisecond));
};
async function main() {
  const accounts = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  console.log(`Using chainId ${chainId} `);
  const event = await ethers.getContractAt(
    "EventContract",
    config[chainId].EventContract.address
  );
  console.log(`The event contract is fetched at ${event.address}`);
  let transaction, result;
  //Making some events
  transaction = await event
    .connect(accounts[0])
    .createEvent(
      accounts[0].address,
      "Fast X",
      1687551480,
      converter(1),
      "https://i.ytimg.com/vi/aOb15GVFZxU/maxresdefault.jpg",
      100
    );
  result = await transaction.wait();
  await wait(1);

  transaction = await event
    .connect(accounts[0])
    .createEvent(
      accounts[0].address,
      "The Kerala Story",
      1687551480,
      converter(1),
      "https://cdn.gulte.com/wp-content/uploads/2023/05/the-kerala-story-review-16832562363x2-1.jpg",
      100
    );
  result = await transaction.wait();
  await wait(1);

  transaction = await event
    .connect(accounts[0])
    .createEvent(
      accounts[0].address,
      "IB71",
      1687551480,
      converter(1),
      "https://i.ytimg.com/vi/-V9tu8rqWIg/maxresdefault.jpg",
      100
    );
  result = await transaction.wait();
  await wait(1);

  transaction = await event
    .connect(accounts[0])
    .createEvent(
      accounts[0].address,
      "The Little Mermaid",
      1687551480,
      converter(1),
      "https://www.rollingstone.com/wp-content/uploads/2023/05/little-mermaid-soundtrack.jpg?w=1024",
      100
    );
  result = await transaction.wait();
  await wait(1);

  transaction = await event
    .connect(accounts[0])
    .createEvent(
      accounts[0].address,
      "Blockchain century bootcamp",
      1687551480,
      converter(1),
      "https://builtin.com/sites/www.builtin.com/files/styles/og/public/2022-09/blockchain.png",
      100
    );
  result = await transaction.wait();
  await wait(1);

  transaction = await event
    .connect(accounts[0])
    .buyTicket(0, 2, { value: converter(2) });
  result = await transaction.wait();
  await wait(1);
  console.log(`Account 0 Bought ticket of id 0 `);
  transaction = await event
    .connect(accounts[1])
    .buyTicket(1, 2, { value: converter(2) });
  result = await transaction.wait();
  await wait(1);
  console.log(`Account 1 Bought ticket of id 0 `);

  transaction = await event
    .connect(accounts[0])
    .buyTicket(2, 2, { value: converter(2) });
  result = await transaction.wait();
  await wait(1);
  console.log(`Account 0 Bought ticket of id 1 `);
  transaction = await event
    .connect(accounts[1])
    .buyTicket(3, 2, { value: converter(2) });
  result = await transaction.wait();
  await wait(1);
  console.log(`Account 1 Bought ticket of id 1 `);

  transaction = await event
    .connect(accounts[0])
    .buyTicket(4, 2, { value: converter(2) });
  result = await transaction.wait();
  await wait(1);
  // console.log(`Account 0 Bought ticket of id 2 `);
  // transaction = await event
  //   .connect(accounts[1])
  //   .buyTicket(5, 2, { value: converter(2) });
  // result = await transaction.wait();
  // await wait(1);
  // console.log(`Account 1 Bought ticket of id 2 `);

  // transaction = await event
  //   .connect(accounts[0])
  //   .buyTicket(3, 2, { value: converter(2) });
  // result = await transaction.wait();
  // await wait(1);
  // console.log(`Account 0 Bought ticket of id 3 `);
  // transaction = await event
  //   .connect(accounts[1])
  //   .buyTicket(3, 2, { value: converter(2) });
  // result = await transaction.wait();
  // await wait(1);
  // console.log(`Account 1 Bought ticket of id 3 `);

  // transaction = await event
  //   .connect(accounts[0])
  //   .buyTicket(4, 2, { value: converter(2) });
  // result = await transaction.wait();
  // await wait(1);
  // console.log(`Account 0 Bought ticket of id 4 `);
  // transaction = await event
  //   .connect(accounts[1])
  //   .buyTicket(4, 2, { value: converter(2) });
  // result = await transaction.wait();
  // await wait(1);
  // console.log(`Account 1 Bought ticket of id 4 `);

  transaction = await event
    .connect(accounts[0])
    .transferTicket(0, 1, accounts[1].address);
  result = await transaction.wait();
  await wait(1);
  console.log(`Account 0 transfered 1 ticket of event 0 to account1 `);

  transaction = await event
    .connect(accounts[1])
    .transferTicket(1, 1, accounts[0].address);
  result = await transaction.wait();
  await wait(1);
  console.log(`Account 1 transfered 1 ticket of event 2 to account0 `);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

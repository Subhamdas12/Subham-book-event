const { expect } = require("chai");
const { ethers } = require("hardhat");
const provider = ethers.getDefaultProvider();
const converter = (n) => {
  return ethers.utils.parseEther(n.toString());
};
describe("EventContract", () => {
  let transactionResponse, transactionReceipt, event, user0, user1, user2;
  beforeEach(async () => {
    const Event = await ethers.getContractFactory("EventContract");
    const accounts = await ethers.getSigners();
    user0 = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    event = await Event.connect(user0).deploy();
  });
  describe("Deployments", () => {
    it("The deployments is correct", async () => {
      expect(await event.address).to.not.equal(0);
    });
  });
  describe("CreateEvent", () => {
    describe("Success", () => {
      beforeEach(async () => {
        transactionResponse = await event
          .connect(user0)
          .createEvent(
            user0.address,
            "CrowdFunding Application introduction",
            1687551480,
            converter(1),
            "IMAGEURL",
            100
          );
        transactionReceipt = await transactionResponse.wait();
      });
      it(" It adds a event in the mapping of s_event ", async () => {
        expect(await event.getEvent(0)).to.not.be.equal(0);
        const [
          id,
          owner,
          name,
          date,
          price,
          imageURL,
          ticketCount,
          ticketRemain,
        ] = await event.getEvent(0);
        expect(id).to.equal(0);
        expect(owner).to.equal(user0.address);
        expect(name).to.equal("CrowdFunding Application introduction");
        expect(date).to.equal(1687551480);
        expect(price).to.equal(converter(1));
        expect(imageURL).to.equal("IMAGEURL");
        expect(ticketCount).to.equal(100);
        expect(ticketRemain).to.equal(100);
      });
      it("It should not be completed", async () => {
        expect(await event.getCompleted(0)).to.equal(false);
      });
      it("It should emit an event CreateEvent", async () => {
        const event = await transactionReceipt.events[0];
        expect(event.event).to.equal("Event__CreateEvent");
        const args = event.args;
        expect(args.id).to.equal(0);
        expect(args.owner).to.equal(user0.address);
        expect(args.name).to.equal("CrowdFunding Application introduction");
        expect(args.price).to.equal(converter(1));
        expect(args.ticketCount).to.equal(100);
        expect(args.ticketRemain).to.equal(100);
      });
    });
    describe("Failure", () => {
      it("It will fail if the date is before the current date", async () => {
        await expect(
          event
            .connect(user0)
            .createEvent(
              user0.address,
              "CrowdFunding Application introduction",
              1684895431,
              converter(1),
              "IMAGEURL",
              100
            )
        ).to.be.revertedWith("The date should be a date in the future");
      });
      it("The ticket quantity should be greater then 0", async () => {
        await expect(
          event
            .connect(user0)
            .createEvent(
              user0.address,
              "CrowdFunding Application introduction",
              1687551480,
              converter(1),
              "IMAGEURL",
              0
            )
        ).to.be.revertedWith("The ticket quantity should be greater then 0");
      });
    });
  });
  describe("BuyTickets", () => {
    describe("Success", () => {
      beforeEach(async () => {
        transactionResponse = await event
          .connect(user0)
          .createEvent(
            user0.address,
            "CrowdFunding Application introduction",
            1687551480,
            converter(1),
            "IMAGEURL",
            100
          );
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await event
          .connect(user1)
          .buyTicket(0, 1, { value: converter(1) });
        transactionReceipt = await transactionResponse.wait();
      });

      it("The amount of ticketRemaining decreased", async () => {
        const [
          id,
          owner,
          name,
          date,
          price,
          imageURL,
          ticketCount,
          ticketRemain,
        ] = await event.getEvent(0);
        expect(id).to.equal(0);
        expect(owner).to.equal(user0.address);
        expect(name).to.equal("CrowdFunding Application introduction");
        expect(date).to.equal(1687551480);
        expect(price).to.equal(converter(1));
        expect(imageURL).to.equal("IMAGEURL");
        expect(ticketCount).to.equal(100);
        expect(ticketRemain).to.equal(99);
      });
      it("It emits a buyTicket event", async () => {
        const event = await transactionReceipt.events[0];
        const args = event.args;
        expect(event.event).to.equal("Event__BuyTicket");
        expect(args.id).to.equal(0);
        expect(args.owner).to.equal(user1.address);
        expect(args.quantity).to.equal(1);
        expect(args.totalPrice).to.equal(converter(1));
      });
    });
    describe("Failure", () => {
      it("The event doesnot exist", async () => {
        await expect(
          event.connect(user0).buyTicket(100, 2, { value: converter(100) })
        ).to.be.revertedWith("Event doesnot exist");
      });
      it("if the ether amount is not equal", async () => {
        transactionResponse = await event
          .connect(user0)
          .createEvent(
            user0.address,
            "CrowdFunding Application introduction",
            1687551480,
            converter(1),
            "IMAGEURL",
            100
          );
        transactionReceipt = await transactionResponse.wait();
        await expect(
          event.connect(user1).buyTicket(0, 2, { value: converter(1000) })
        ).to.be.revertedWith("Ether is not equal");
      });
      it("If the remaining tickets are not more", async () => {
        transactionResponse = await event
          .connect(user0)
          .createEvent(
            user0.address,
            "CrowdFunding Application introduction",
            1687551480,
            converter(1),
            "IMAGEURL",
            2
          );
        transactionReceipt = await transactionResponse.wait();
        await expect(
          event.connect(user1).buyTicket(0, 3, { value: converter(3) })
        ).to.be.revertedWith("Not enough ticket is left");
      });
    });
  });
  describe("TransferTicket", () => {
    describe("Success", () => {
      beforeEach(async () => {
        transactionResponse = await event
          .connect(user0)
          .createEvent(
            user0.address,
            "CrowdFunding Application introduction",
            1687551480,
            converter(1),
            "IMAGEURL",
            100
          );
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await event
          .connect(user1)
          .buyTicket(0, 4, { value: converter(4) });
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await event
          .connect(user1)
          .transferTicket(0, 2, user2.address);
        transactionReceipt = await transactionResponse.wait();
      });
      it("the ticket is transfered to user2", async () => {
        expect(await event.getTicketQuantity(user2.address, 0)).to.equal(2);
      });
      it("The number of tickets decreased of user1", async () => {
        expect(await event.getTicketQuantity(user1.address, 0)).to.equal(2);
      });
      it("Emits a transferticket event", async () => {
        const event = await transactionReceipt.events[0];
        const args = event.args;
        expect(event.event).to.equal("Event__TransferTicket");
        expect(args.id).to.equal(0);
        expect(args.owner).to.equal(user1.address);
        expect(args.receiver).to.equal(user2.address);
        expect(args.quantity).to.equal(2);
        expect(args.totalPrice).to.equal(converter(2));
      });
    });
    describe("Failure", () => {
      it("does not transfer if the amount of ticket asked to transfer is greater then the quantity the owner have", async () => {
        transactionResponse = await event
          .connect(user0)
          .createEvent(
            user0.address,
            "CrowdFunding Application introduction",
            1687551480,
            converter(1),
            "IMAGEURL",
            100
          );
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await event
          .connect(user1)
          .buyTicket(0, 4, { value: converter(4) });
        transactionReceipt = await transactionResponse.wait();
        await expect(
          event.connect(user1).transferTicket(0, 6, user2.address)
        ).to.be.revertedWith("You donot have enough ticets for this event");
      });
    });
  });
});

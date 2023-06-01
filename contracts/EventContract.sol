//SPDX-License-Identifier:Unlicensed
pragma solidity >0.5.0 <=0.9.0;

contract EventContract {
    struct Event {
        uint256 id;
        address owner;
        string name;
        uint256 date;
        uint256 price;
        string imageURL;
        uint256 ticketCount;
        uint256 ticketRemain;
    }
    mapping(uint256 => Event) private s_events;
    mapping(address => mapping(uint256 => uint256)) private s_ticket;
    mapping(uint256 => bool) private s_completed;
    uint256 private s_eventId = 0;

    event Event__CreateEvent(
        uint256 id,
        address owner,
        string name,
        uint256 date,
        uint256 price,
        string imageURL,
        uint256 ticketCount,
        uint256 ticketRemain
    );

    event Event__BuyTicket(
        uint256 id,
        address owner,
        uint256 quantity,
        uint256 totalPrice,
        uint256 ticketRemain
    );
    event Event__TransferTicket(
        uint256 id,
        address owner,
        address receiver,
        uint256 quantity,
        uint256 totalPrice
    );
    event Event__CompletedEvent(uint256 id);

    function createEvent(
        address _owner,
        string memory _name,
        uint256 _date,
        uint256 _price,
        string memory _imageURL,
        uint256 _ticketCount
    ) public returns (uint256) {
        require(
            _date > block.timestamp,
            "The date should be a date in the future"
        );
        require(
            _ticketCount > 0,
            "The ticket quantity should be greater then 0"
        );
        Event storage _event = s_events[s_eventId++];
        _event.id = s_eventId - 1;
        _event.owner = _owner;
        _event.name = _name;
        _event.date = _date;
        _event.price = _price;
        _event.imageURL = _imageURL;
        _event.ticketCount = _ticketCount;
        _event.ticketRemain = _ticketCount;

        emit Event__CreateEvent(
            s_eventId - 1,
            _owner,
            _name,
            _date,
            _price,
            _imageURL,
            _ticketCount,
            _ticketCount
        );
        return s_eventId - 1;
    }

    function buyTicket(uint256 _id, uint256 _quantity) external payable {
        require(s_events[_id].date != 0, "Event doesnot exist");
        require(
            s_events[_id].date > block.timestamp,
            "Event is already occured"
        );
        Event storage _event = s_events[_id];
        uint256 totalPrice = _quantity * _event.price;
        if (block.timestamp >= _event.date) {
            s_completed[_id] = true;
            emit Event__CompletedEvent(_id);
        }
        require(!s_completed[_id], "The event is already completed");
        require(msg.value == totalPrice, "Ether is not equal");
        require(_event.ticketRemain >= _quantity, "Not enough ticket is left");
        _event.ticketRemain -= _quantity;
        s_ticket[msg.sender][_id] += _quantity;
        (bool send, ) = payable(_event.owner).call{value: totalPrice}("");
        require(send, "The transfer is not complete");
        emit Event__BuyTicket(
            _id,
            msg.sender,
            _quantity,
            totalPrice,
            _event.ticketRemain
        );
    }

    function transferTicket(
        uint256 _id,
        uint256 _quantity,
        address _to
    ) external {
        if (block.timestamp >= s_events[_id].date) {
            s_completed[_id] = true;
            emit Event__CompletedEvent(_id);
        }
        require(!s_completed[_id], "The event is already completed");
        require(s_events[_id].date != 0, "Event doesnot exist");
        require(
            s_events[_id].date > block.timestamp,
            "Event has already occured"
        );
        require(
            s_ticket[msg.sender][_id] >= _quantity,
            "You donot have enough ticets for this event"
        );
        s_ticket[msg.sender][_id] -= _quantity;
        s_ticket[_to][_id] += _quantity;
        emit Event__TransferTicket(
            _id,
            msg.sender,
            _to,
            _quantity,
            s_events[_id].price * _quantity
        );
    }

    //Getters functions
    function getEvent(uint256 _id) public view returns (Event memory) {
        return s_events[_id];
    }

    function getTicketQuantity(
        address _address,
        uint256 _id
    ) public view returns (uint256) {
        return s_ticket[_address][_id];
    }

    function getCompleted(uint256 _id) public view returns (bool) {
        return s_completed[_id];
    }

    function getCurrentId() public view returns (uint256) {
        return s_eventId;
    }

    function getTicketRemain(uint256 _id) public view returns (uint256) {
        return s_events[_id].ticketRemain;
    }
}

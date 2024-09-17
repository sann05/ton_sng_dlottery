import "@stdlib/deploy";

message AddParticipant {
    queryId: Int as uint64;

}

contract SnGDLottery with Deployable {
    id: Int as uint32;
    participants_count: Int as uint32;
    participants: map<Int, Address>;

    init(id: Int) {
        self.id = id;
        self.participants_count = 0;
    }

    fun gameStart() {
        // Start the game
        self.participants_count = 0;
        self.participants = emptyMap();
    }

    receive(msg: AddParticipant) {
        require(context().value == ton("1.1"), "Received value must be 1.1 TON");
        self.participants.set(self.participants_count, sender());
        self.participants_count += 1;
        if (self.participants_count == 10) {
            self.gameStart()
        }

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun participantsCount(): Int {
        return self.participants_count;
    }

    get fun participantAddress(index: Int): Address? {
        return self.participants.get(index);
    }

    get fun id(): Int {
        return self.id;
    }

    get fun participants(): map<Int, Address> {
        return self.participants;
    }
}

import "@stdlib/deploy";
import "@stdlib/ownable";


message AddParticipantMessage {
    queryId: Int as uint64;

}

message WithdrawFeesMessage {
    queryId: Int as uint64;

}

contract SnGDLottery with Deployable, Ownable {
    id: Int as uint32;
    owner: Address;
    participants_count: Int as uint32;
    participants: map<Int, Address>;

    init(id: Int, owner: Address) {
        self.id = id;
        self.owner = owner;
        self.participants_count = 0;
    }

    fun popParticipant(key: Int): Address {
        let value: Address? = self.participants.get(key);
        if (value == null) {
            return self.popParticipant(key + 1);
        }

        self.participants.set(key, null);
        return value!!;
    }

    fun sendPrizes(firstWinner: Address, secondWinner: Address, thirdWinner: Address) {
        send(SendParameters{
            to: firstWinner,
            value: ton("1") * 5,
            mode: SendPayGasSeparately,
            body: "Congratulations! You are the first winner of the lottery!".asComment()       
        });

        send(SendParameters{
            to: secondWinner,
            value: ton("1") * 3,
            mode: SendPayGasSeparately,
            body: "Congratulations! You are the second winner of the lottery!".asComment()       
        });

        send(SendParameters{
            to: thirdWinner,
            value: ton("1") * 2, 
            mode: SendPayGasSeparately,
            body: "Congratulations! You are the third winner of the lottery!".asComment()       
        });

    }

    fun chooseWinners() {
        nativeRandomizeLt();
        let firstWinnerIndex: Int = random(0, 10);
        let firstWinner: Address = self.popParticipant(firstWinnerIndex);

        let secondWinnerIndex: Int = random(0, 9);
        let secondWinner: Address = self.popParticipant(secondWinnerIndex);

        let thirdWinnerIndex: Int = random(0, 8);
        let thirdWinner: Address = self.popParticipant(thirdWinnerIndex);
        
        self.sendPrizes(firstWinner, secondWinner, thirdWinner);
    }

    fun gameStart() {
        // Start the game
        self.chooseWinners();
        self.participants_count = 0;
        self.participants = emptyMap();
    }

    receive(msg: AddParticipantMessage) {
        require(context().value == ton("1.1"), "Received value must be 1.1 TON");
        self.participants.set(self.participants_count, sender());
        self.participants_count += 1;
        
        if (self.participants_count > 9) {
            self.gameStart()
        }
    }

    receive(msg: WithdrawFeesMessage) {
        require(sender() == self.owner, "Only owner can withdraw fees");
        let allowedBalance: Int = myBalance() - ton("1") * self.participants_count - ton("0.1");
        require(allowedBalance > 0, "Not enough balance to withdraw");
        send(SendParameters{
            to: self.owner,
            value: allowedBalance,
            body: "Withdrawal".asComment()
        });
        
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

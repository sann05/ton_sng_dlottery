import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { SnGDLottery } from '../wrappers/SnGDLottery';
import '@ton/test-utils';

describe('SnGDLottery', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let snGDLottery: SandboxContract<SnGDLottery>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        snGDLottery = blockchain.openContract(await SnGDLottery.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await snGDLottery.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: snGDLottery.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and snGDLottery are ready to use
    });

    it('should increase number of participants', async () => {
        const increaseTimes = 9;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const participant = await blockchain.treasury('increaser' + i);

            const participantsCountBefore = await snGDLottery.getParticipantsCount();

            console.log('Participants count before increasing', participantsCountBefore);


            const increaseResult = await snGDLottery.send(
                participant.getSender(),
                {
                    value: toNano('1.1'),
                },
                {
                    $$type: 'AddParticipant',
                    queryId: 0n,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: participant.address,
                to: snGDLottery.address,
                success: true,
            });

            const participantsCountAfter = await snGDLottery.getParticipantsCount();
            const participants = await snGDLottery.getParticipants();
            console.log('Participants: ', participants);

            console.log('Participants count after increasing', participantsCountAfter);

            expect(participantsCountAfter).toBe(participantsCountBefore + BigInt(1));
        }
    });

    it('should increase distribute payments to participants', async () => {
        const increaseTimes = 10;
        let increaseResult;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const participant = await blockchain.treasury('increaser' + i);


            increaseResult = await snGDLottery.send(
                participant.getSender(),
                {
                    value: toNano('1.1'),
                },
                {
                    $$type: 'AddParticipant',
                    queryId: 0n,
                }
            );


        }

        const participantsCountAfter = await snGDLottery.getParticipantsCount();
        const participants = await snGDLottery.getParticipants();
        expect(increaseResult!.transactions).toHaveTransaction({
            from: snGDLottery.address,
            value: toNano('5'),
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("Congratulations! You are the first winner of the lottery!").endCell(),
        });

        expect(increaseResult!.transactions).toHaveTransaction({
            from: snGDLottery.address,
            value: toNano('3'),
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("Congratulations! You are the second winner of the lottery!").endCell(),
        });

        expect(increaseResult!.transactions).toHaveTransaction({
            from: snGDLottery.address,
            value: toNano('2'),
            success: true,
            body: beginCell().storeUint(0,32).storeStringTail("Congratulations! You are the third winner of the lottery!").endCell(),
        });
        expect(participants.size).toBe(0);
        expect(participantsCountAfter).toBe(BigInt(0));

    });

    it('should withdraw fees for owner', async () => {
        expect(true).toBe(false);
    });

    // Negative tests

    it('should bounce when the send amount is not equal 1.1 TON', async () => {
        expect(true).toBe(false);
    });

    it('should not withdraw fees for non owner', async () => {
        expect(true).toBe(false);
    });
});

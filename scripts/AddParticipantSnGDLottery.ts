import { Address, toNano } from '@ton/core';
import { SnGDLottery } from '../wrappers/SnGDLottery';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('SnGDLottery address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const snGDLottery = provider.open(SnGDLottery.fromAddress(address));

    const counterBefore = await snGDLottery.getParticipantsCount();

    await snGDLottery.send(
        provider.sender(),
        {
            value: toNano('1.1'),
        },
        {
            $$type: 'AddParticipantMessage',
            queryId: 0n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await snGDLottery.getParticipantsCount();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await snGDLottery.getParticipantsCount();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Participants counter increased successfully!');
}

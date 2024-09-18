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

    await snGDLottery.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'WithdrawFeesMessage',
            queryId: 0n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let balance = (await provider.provider(snGDLottery.address).getState()).balance;
    let attempt = 1;
    while (balance !== toNano('0.1')) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        balance = (await provider.provider(snGDLottery.address).getState()).balance;
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Fees withdrawn successfully!');
}

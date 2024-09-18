import { toNano } from '@ton/core';
import { SnGDLottery } from '../wrappers/SnGDLottery';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const snGDLottery = provider.open(await SnGDLottery.fromInit(
        BigInt(Math.floor(Math.random() * 10000)),
        provider.sender().address!
    ));

    await snGDLottery.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(snGDLottery.address);

    console.log('ID', await snGDLottery.getId());
}

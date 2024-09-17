import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/sng_d_lottery.tact',
    options: {
        debug: true,
    },
};

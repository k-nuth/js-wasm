// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Operation } from './Operation';
import { Program } from './Program';
export declare class Debugger {
    stepNumber?: number;
    programHistory: Map<number, Program>;
    private snapshot?;
    private root?;
    private created;
    get lastProgram(): Program | undefined;
    start(program: Program): number;
    get stepsAvailable(): boolean;
    stepForward(): number;
    end(): number;
    dispose(): void;
}
export declare class Interpreter {
    static run(program: Program): number;
    static runOperation(operation: Operation, program: Program): number;
    static debug(program: Program): Debugger | number;
}
export default Interpreter;

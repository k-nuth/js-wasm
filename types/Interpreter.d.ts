import { Program } from './Program';
import { Operation } from './Operation';
export declare class Debugger {
    stepNumber?: number;
    programHistory: Map<number, Program>;
    get lastProgram(): Program | undefined;
    start(program: Program): number;
    get stepsAvailable(): boolean;
    stepForward(): number;
    end(): number;
}
export declare class Interpreter {
    static run(program: Program): number;
    static runOperation(operation: Operation, program: Program): number;
    static debug(program: Program): Debugger | number;
}
export default Interpreter;

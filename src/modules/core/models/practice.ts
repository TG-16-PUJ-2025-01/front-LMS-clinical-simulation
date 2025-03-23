import Type from "./practiceType";

export default interface Practice{
    id: number;
    name: string;
    description: string;
    type: Type;
    gradeable: boolean;
    simulationDuration: number;
    numberOfGroups: number | null;
    maxStudentsGroup: number | null;
}
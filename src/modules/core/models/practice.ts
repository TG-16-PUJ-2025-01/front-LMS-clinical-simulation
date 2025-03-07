import Type from "./practiceType";

export default interface Practice{
    id: number;
    name: string;
    description: string;
    type: Type;
    gradeable: boolean;
    numberOfGroups: number;
    maxStudentsGroup: number;
}
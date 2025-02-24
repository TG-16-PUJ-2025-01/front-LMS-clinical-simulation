import Course from "./course";
import User from "./user";

export default interface Class {
    id: number;
    javerianaId: number;
    name: string;
    course: Course;
    professor: User;
    beginningDate: Date;
    period: string;
  }
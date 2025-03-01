import Course from "./course";
import User from "./user";

export default interface Class {
    classId: number;
    javerianaId: number;
    name: string;
    course: Course;
    professors: User[];
    beginningDate: Date;
    period: string;
  }
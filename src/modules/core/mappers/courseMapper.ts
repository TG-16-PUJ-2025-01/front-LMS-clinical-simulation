import Course from "../models/course";

export function courseMapper(course): Course {
    return {
        id: course.id,
        name: course.name,
        idJaveriana: course.idJaveriana,
        coordinatorId: course.coordinator.id,
        coordinatorName: course.coordinator.name,
    }
}
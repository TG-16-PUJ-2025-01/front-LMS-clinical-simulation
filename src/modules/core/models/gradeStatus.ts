enum gradeStatus {
    PENDING = 'PENDING',
    REGISTERED = 'REGISTERED',
    NOT_EVALUABLE = 'NOT_EVALUABLE'
}

export const gradeStatusLabels: { [key in gradeStatus]: string } = {
    [gradeStatus.PENDING]: 'Pendiente',
    [gradeStatus.REGISTERED]: 'Calificado',
    [gradeStatus.NOT_EVALUABLE]: 'No evaluable'
};

export default gradeStatus;
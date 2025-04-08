enum GradeStatus {
    PENDING = 'PENDING',
    REGISTERED = 'REGISTERED',
    NOT_EVALUABLE = 'NOT_EVALUABLE'
}

export const GradeStatusLabels: { [key in GradeStatus]: string } = {
    [GradeStatus.PENDING]: 'Pendiente',
    [GradeStatus.REGISTERED]: 'Calificado',
    [GradeStatus.NOT_EVALUABLE]: 'No evaluable'
};

export default GradeStatus;
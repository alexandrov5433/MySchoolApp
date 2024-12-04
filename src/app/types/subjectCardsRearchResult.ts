

type subjectCard = {
    _id: string,
    teacher: string,
    title: string,
    displayId: string,
    backgroundImageNumber: string
};
export type subjectCardsSearchResult = {
    results: Array<subjectCard>
};
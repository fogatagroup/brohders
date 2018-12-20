export const now = () : Date => {
    return new Date();
}

export const addMinutes = (time: Date, amount: number): Date => {
    return new Date(time.getDate() + amount * 60000);
}
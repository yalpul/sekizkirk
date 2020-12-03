const letters = {
    A: 0,
    B: 1,
    C: 2,
    Ç: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    Ğ: 8,
    H: 9,
    I: 10,
    İ: 11,
    J: 12,
    K: 13,
    L: 14,
    M: 15,
    N: 16,
    O: 17,
    Ö: 18,
    P: 19,
    Q: 20,
    R: 21,
    S: 22,
    Ş: 23,
    T: 24,
    U: 25,
    Ü: 26,
    V: 27,
    W: 28,
    X: 29,
    Y: 30,
    Z: 31,
};

const alphabetLength = 32;

export const distance = (firstLetter, secondLetter) => {
    return letters[firstLetter] * alphabetLength + letters[secondLetter];
};

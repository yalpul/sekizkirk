import sha1 from "sha1";

export function scheduleHash(schedule) {
    const inputString = JSON.stringify(schedule);
    return sha1(inputString);
}

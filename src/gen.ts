import { formatDate } from 'date-fns/format';
import { customAlphabet } from 'nanoid';

function generateUniqueRandomNumber(count: number): string {
    const alphabet = '0123456789ABCDKLXZT';
    const nanoid = customAlphabet(alphabet, count);
    return nanoid()
}
function getMinutesAndSecond() {
    const now = new Date()
    const mins = now.getMinutes().toLocaleString().length === 1 ? `0${now.getMinutes()}` : now.getMinutes()
    const secs = now.getSeconds().toLocaleString().length === 1 ? `0${now.getSeconds()}` : now.getSeconds()

    return `${mins}${secs}`
}

export function genTimeBasedId() {
    const uniqueNumStringArray = generateUniqueRandomNumber(16).toString().split('')
    const timePart = getMinutesAndSecond()
    const leftHand = uniqueNumStringArray.filter((_x, y) => y <= uniqueNumStringArray.length / 2 - 1).join('')
    const rightHand = uniqueNumStringArray.filter((_x, y) => y > uniqueNumStringArray.length / 2 - 1).join('')
    const dayPart = formatDate(new Date(), 'eee').toUpperCase()
    return `${dayPart}:${timePart}-${leftHand}-${rightHand}`
}
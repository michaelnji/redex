import { format } from "date-fns";
import { expect, test } from "vitest";
import { genTimeBasedId } from '../src/gen.ts';

test("genTimeBasedId should have the correct length", () => {
    const id = genTimeBasedId();
    expect(id.length).toBe(26);
});

test('genTimeBasedId should start with todays day', () => {
    const id = genTimeBasedId();
    const test = format(new Date(), 'eee').toUpperCase()
    expect(id.startsWith(test)).toBe(true);
});

test('genTimeBasedId should generate 500,000 unique ids"', () => {
    const amount = 500000;
    const ids: string[] = [];
    for (let i = 0; i < amount; i++) {
        ids.push(genTimeBasedId());
        if (i < 10) console.log(ids[i]);
    }
    const finals = new Set(ids);
    expect(finals.size).toBe(amount);
});



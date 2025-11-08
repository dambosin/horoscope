import {PrismaClient} from '@prisma/client';
import {logger} from '../logger.js';

function getDefaultValue(username: string, date: string): [number, boolean] {
    const seed = cyrb128(username + date);
    const rand = sfc32(seed[0], seed[2], seed[2], seed[3]);
    const hash = rand();
    const isInside = rand() > 0.9;
    const cockSize = Math.ceil(hash * 37 + 2);
    return [cockSize, isInside];
}

function applyTemplate(
    template: string,
    size: number,
    username: string
): string {
    return template
        .replace(/{result}/g, size.toString())
        .replace(/{username}/g, username);
}

function formaDate(date: Date): string {
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export async function generateContent(
    prisma: PrismaClient,
    userId: bigint,
    username: string
): Promise<string> {
    const today = formaDate(new Date());
    const [size, isInside] = getDefaultValue(username, today);
    const defaultTemplate = `My cock size is {result}cm ${getEmoji(size)}`;
    const defaultInsideTemplate = `Cock size inside me is {result}cm ${getEmoji(size)}`;
    let finalResult = applyTemplate(
        isInside ? defaultInsideTemplate : defaultTemplate,
        size,
        username
    );
    let wasOverride = false;
    let ruleIdUsed = null;

    let rule = await prisma.overrideRule.findFirst({
        where: {userName: username, date: today},
    });

    if (!rule) {
        rule = await prisma.overrideRule.findFirst({
            where: {userName: username, date: ''},
        });
    }

    if (!rule) {
        rule = await prisma.overrideRule.findFirst({
            where: {userName: '', date: today},
        });
    }

    if (rule) {
        logger.info(`Custom rule was found: ${rule.template}`);
        finalResult = applyTemplate(rule.template, size, username);
        wasOverride = true;
        ruleIdUsed = rule.id;
    }

    prisma.analyticsLog
        .findFirst({
            where: {userId},
            orderBy: {createdAt: 'desc'},
        })
        .then(result => {
            if (
                !result ||
                (!!result &&
                    formaDate(result.createdAt) !== formaDate(new Date()))
            ) {
                logger.info(`Loggin analytics for ${username}`);
                prisma.analyticsLog
                    .create({
                        data: {
                            userId: userId,
                            username: username,
                            rawValue: size.toString(),
                            finalResult: finalResult,
                            wasOverride: wasOverride,
                            ruleIdUsed: ruleIdUsed,
                        },
                    })
                    .catch((err: unknown) =>
                        logger.error('Failed to log analytics:', err)
                    );
            } else {
                logger.info(`Today size already logged`);
            }
        });

    return finalResult;
}

function getEmoji(size: number): string {
    let result = '';
    if (size <= 5) {
        result = '😭';
    } else if (size <= 10) {
        result = '🙁';
    } else if (size <= 15) {
        result = '😐';
    } else if (size <= 20) {
        result = '😏';
    } else if (size <= 30) {
        result = '🥳';
    } else if (size < 40) {
        result = '😨';
    } else {
        result = '😎';
    }
    return result;
}

function cyrb128(str: string) {
    let h1 = 1779033703,
        h2 = 3144134277,
        h3 = 1013904242,
        h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= h2 ^ h3 ^ h4;
    h2 ^= h1;
    h3 ^= h1;
    h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a: number, b: number, c: number, d: number) {
    return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        const t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

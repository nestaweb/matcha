export function roundFrameValue(value: number): number {
    return Math.round(value * 100) / 100;
}

export function roundFrameValues(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => roundFrameValues(item));
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'number') {
            result[key] = roundFrameValue(value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = roundFrameValues(value);
        } else {
            result[key] = value;
        }
    }
    return result;
} 
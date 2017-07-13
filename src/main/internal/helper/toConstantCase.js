export default function toConstantName(str) {
    return str
        .replace(/([a-z0-9])([A-Z])([a-z0-9])/g, '$1_$2$3')
        .toUpperCase();
}

import { readFileSync, writeFile as _writeFile } from 'fs';
import format from 'xml-formatter';
export function readFile(fileName) {
    return readFileSync(fileName, 'utf8');
}
export function formatXml (xml) {
    return format(xml);
}

export function printoutput(output) {
    console.log("\n"+output);
}

export function writeFile(filePath, content) {
    _writeFile(filePath, content, err => {
    if (err) {
        console.error(err);
    }
    });
}
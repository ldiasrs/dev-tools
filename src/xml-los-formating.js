import {readFile, printoutput, writeFile, formatXml} from './commons.js'
import dotenv from 'dotenv';

function normalizeXml(xml){
    const regex = /CDATA\[(.*?)\]\]>/
    const found = regex.exec(xml)
    const match =found ? found[1] : xml
    return match.replaceAll(`\\"`, "\"")
}

function main() {
    dotenv.config()
    const dirBase = process.env.XML_FORMAT_BASE_DIR;
    const sourceFile = `${dirBase}/test.xml`
    const targetFile = `${dirBase}/test2.xml`
    const fileString = readFile(sourceFile)
    const xml = normalizeXml(fileString)
    const formatedXml = formatXml(xml)
    printoutput(formatedXml)
    //writeFile(targetFile, formatedXml)
}

main()

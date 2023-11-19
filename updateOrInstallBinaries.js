const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

let installedVersion = ''

async function exec(command) {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr })
        })
    })
}

async function getZipLink() {
    console.log('Getting bedrock-server.zip link')
    const result = await fetch('https://www.minecraft.net/en-us/download/server/bedrock')
    const body = await result.text()
    const link = body.match(/https:\/\/minecraft\.azureedge\.net\/bin-linux\/bedrock-server-[\d\.]+\.zip/g)[0]
    installedVersion = link.match(/bedrock-server-([\d\.]+)\.zip/)[1]
    return link
}

async function checkUnzip() {
    console.log('Checking unzip')
    const result = await exec('unzip -v')
    if (result.stderr) {
        console.log('Installing unzip')
        await exec('sudo apt-get install unzip')
    }
}

async function downlaodZip(link) {
    console.log('Downloading bedrock-server.zip from ' + link)
    const result = await fetch(link)
    const buffer = await result.arrayBuffer()
    const file = path.join(__dirname, 'bedrock-server.zip')
    fs.writeFileSync(file, Buffer.from(buffer))
    return file
}

async function unzipFileIfNotExists(file, target) {
    console.log('Unzipping ' + target + ' from ' + file)
    if (!fs.existsSync(target)) {
        await exec(`unzip ${file} ${target}`)
    }
}

async function unzipFileAndRemoveIfExists(file, target) {
    console.log('Unzipping ' + target + ' from ' + file)
    if (fs.existsSync(target)) {
        await fs.promises.rm(target)
    }
    await exec(`unzip ${file} ${target}`)
}

async function unzipFolderAndRemoveIfExists(file, target) {
    console.log('Unzipping ' + target + ' from ' + file)
    if (fs.existsSync(target)) {
        await fs.promises.rm(target, { recursive: true })
    }
    await exec(`unzip ${file} ${target}/*`)
}
async function unzipFolderIfNotExists(file, target) {
    console.log('Unzipping ' + target + ' from ' + file)
    if (!fs.existsSync(target)) {
        await exec(`unzip ${file} ${target}/*`)
    }
}

async function unzipFiles() {
    const filesToReplace = [
        'bedrock_server',
        'bedrock_server_symbols.debug',
        'bedrock_server_how_to.html',
        'release-notes.txt',
    ]
    const filesToUnzipIfNotExists = [
        'permissions.json',
        'server.properties',
        'allowlist.json',
    ]
    const foldersToReplace = [
        'behavior_packs',
        'definitions',
        'resource_packs'
    ]
    const foldersToUnzipIfNotExists = [
        'config',
    ]

    console.log('Unzipping files')
    const file = 'bedrock-server.zip'
    for (const target of filesToReplace) {
        await unzipFileAndRemoveIfExists(file, target)
    }
    for (const target of filesToUnzipIfNotExists) {
        await unzipFileIfNotExists(file, target)
    }
    for (const target of foldersToReplace) {
        await unzipFolderAndRemoveIfExists(file, target)
    }
    for (const target of foldersToUnzipIfNotExists) {
        await unzipFolderIfNotExists(file, target)
    }
}

async function showReleaseNotes() {
    console.log('Showing release notes')
    const file = 'release-notes.txt'
    const result = await exec(`cat ${file}`)
    console.log(result.stdout)
}

async function removeZip() {
    console.log('Removing bedrock-server.zip')
    await exec('rm bedrock-server.zip')
}

async function saveInstalledVersion() {
    console.log('Saving installed version')
    const fileName = 'versionHistory.txt'
    if (!fs.existsSync(fileName)) {
        await fs.promises.writeFile(fileName, '')
    }

    const file = fs.readFileSync(fileName, 'utf-8')
    const lines = file.split('\n')
    if (lines[0] !== installedVersion) {
        lines.unshift(installedVersion)
        await fs.promises.writeFile(fileName, lines.join('\n'))
    }
}

checkUnzip()
    .then(getZipLink)
    .then(downlaodZip)
    .then(unzipFiles)
    .then(removeZip)
    .then(showReleaseNotes)
    .then(saveInstalledVersion)
    .then(() => {
        console.log('Done')
    })
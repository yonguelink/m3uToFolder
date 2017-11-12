const fs = require('fs-extra');
const async = require('async');
const yargs = require('yargs');

const {playlistFolder, playlistDestination, musicOriginFolder, overwrite, startOver} = yargs
    .option('playlistFolder', {
        alias: 'f',
        description: 'The folder where your playlists are located',
        type: 'string',
        demandOption: true
    })
    .option('playlistDestination', {
        alias: 'd',
        description: `The folder where you want to copy your playlists' songs`,
        type: 'string',
        demandOption: true
    })
    .option('musicOriginFolder', {
        alias: 'o',
        description: 'Root location of your music library',
        type: 'string',
        demandOption: true
    })
    .option('overwrite', {
        alias: 'O',
        description: 'If you want to overwrite your current files (will not remove files that are no longer in your playlists)',
        type: 'boolean',
        default: false
    })
    .option('startOver', {
        description: 'If you want to delete everything in the destination folder',
        type: 'boolean',
        default: false
    })
    .help()
    .argv;
let allSongs = {};
let copiedCount = 0;

if (startOver) {
    fs.remove(playlistDestination)
        .then(findSongs)
        .catch(error => {
            console.error(error);
        });
}else{
    findSongs();
}

function findSongs() {
    fs.readdir(playlistFolder, (err, playlistFiles) => {
        async.each(playlistFiles, (playlistFile, mainCb) => {
            fs.readFile(`${playlistFolder}/${playlistFile}`, 'utf8', (err, data) => {
                if (err) return mainCb(err);
                let files = data.split(/\n/).map(file => {
                    return file.trim();
                });
                files.forEach((file) => {
                    if (file === "") return;
                    file = file.replace(/\\/g, '/');
                    let destination = file.replace(musicOriginFolder, playlistDestination);
                    let info = destination.split('/');
                    let fileName = info[info.length - 1];
                    allSongs[fileName] = {
                        destination: destination,
                        origin: file
                    };
                });
                mainCb();
            });
        }, (err) => {
            if (err) {
                console.error('Got Error', err);
            } else {
                copySongs();
            }
        });
    });
}

function copySongs() {
    let allSongsNames = Object.keys(allSongs);
    async.each(allSongsNames, (songName, cb) => {
        let info = allSongs[songName];
        let destination = info.destination;
        let file = info.origin;
        fs.copy(file, destination, {overwrite: overwrite})
            .then(() => {
                ++copiedCount;
                console.log(`Successfully copied ${file} to ${destination}`);
                let progress = Math.floor(copiedCount / allSongsNames.length * 100);
                console.log(`${copiedCount}/${allSongsNames.length} (${progress}%)`);
                cb();
            })
            .catch((error) => {
                console.error(`Could not copy ${file} to ${destination}`);
                cb(error);
            });
    }, (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Done!');
        }
    });
}

function defaultReturn(err) {
    if (err) console.error(err);
}
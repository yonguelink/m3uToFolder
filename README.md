# M3Us to Folder

Reads a folder containing playlists definitions (`*.m3u`) and creates a folder following your music library file paths
so you can sync your playlists to other devices.

## Why?

I found myself pissed at iTunes, the only thing I found I could really use to sync music with my devices.
As I wasn't finding any alternatives, I decided to export my playlists and start using a better Music Player (I'm using [Dopamine](http://www.digimezzo.com/software/dopamine/) for now)

The "better" music player wasn't offering any sync'ing with my devices, so I had to improvise and created this tool.

Basically, I manage all the music I want to hear via playlists, so when I'm done, I can run this tool and copy the resulting folder on my devices.

## Usage

Running `node index.js` should tell you enough.

But basically:

```
Options:
  --version                  Show version number                       [boolean]
  --playlistFolder, -f       The folder where your playlists are located
                                                             [string] [required]
  --playlistDestination, -d  The folder where you want to copy your playlists'
                             songs                           [string] [required]
  --musicOriginFolder, -o    Root location of your music library
                                                             [string] [required]
  --overwrite, -O            If you want to overwrite your current files (will
                             not remove files that are no longer in your
                             playlists)               [boolean] [default: false]
  --startOver                If you want to delete everything in the destination
                             folder                   [boolean] [default: false]
  --help                     Show help                                 [boolean]
```

As an example (What I'm running):

`node index.js -f "D:/Users/Isaac/Music/Dopamine/Playlists" -d "M:/Music-Phone" -o "M:/Music" --startOver true`


A word of warning:

This, for now, assumes all your music has the same root AND that you will NOT put the result in said root.
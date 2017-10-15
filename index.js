if(process.platform == 'win32'){
  const _fs = require('fs')
  const _lnk = require('windows-shortcuts')
  const _path = require('path')

  const lnkDirCandidates = ['WoWS Weekend', 'World of Warships']

  for(let lnkDir of lnkDirCandidates){
    let lnkPath = _path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', lnkDir)

    // file guard
    try{
      fs.accessSync(lnkPath, fs.R_OK)
    }
    catch(err){
      continue
    }

    _lnk.query(lnkPath, console.log)
  }
}
else{
  console.log('#ERROR: This is not a Windows platform.')
}

process.stdin.on('data', function(){
  process.exit(0)
})

console.log('Press any keys to return...')

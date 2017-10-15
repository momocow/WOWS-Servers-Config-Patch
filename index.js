if(process.platform == 'win32'){
  const _fs = require('fs')
  const _lnk = require('windows-shortcuts')
  const _path = require('path')

  const lnkDirCandidates = ['WoWS Weekend', 'World of Warships']

  console.log('Auto-detecting WoWS root directory from start menu')
  for(let lnkDir of lnkDirCandidates){
    // let lnkPath = _path.join(
    //   process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu',
    //   'Programs', lnkDir, 'World of Warships.lnk')
    //
    // console.log(`Trying ${lnkPath}`)
    // // file guard
    // try{
    //   // console.log(_fs.lstatSync(lnkPath))
    //   _fs.accessSync(lnkPath, _fs.R_OK)
    // }
    // catch(err){
    //   console.log('The provided symbolic link is not found')
    //   continue
    // }
    let lnkPath = `%APPDATA%/Microsoft/Windows/Start Menu/Programs/${lnkDir}/World of Warships.lnk`
    console.log(`Trying ${lnkPath}`)

    _lnk.query(lnkPath, function(err, result){
      console.log(err)
      // if(err){
      //   console.log('An error occurs when reading the symbolic link')
      //   console.log(err)
      //   return
      // }
      console.log(result)
    })
  }
}
else{
  console.log('#ERROR: This is not a Windows platform.')
}

process.stdin.on('data', function(){
  process.exit(0)
})

console.log('Press enter to return...')

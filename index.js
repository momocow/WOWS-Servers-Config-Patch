if(process.platform == 'win32'){
  const _fs = require('fs-extra')
  const _lnk = require('windows-shortcuts')
  const _path = require('path')

  const NPM_PACKAGE = require('./package.json')
  const IS_STANDALONE_EXE = _path.basename(process.argv[0], ".exe") != "node"

  function initWorkingDir(exeWorkingDir){
    console.log('Preparing shortcut reader')
    let shortcutExe = _fs.readFileSync('./node_modules/windows-shortcuts/lib/shortcut/Shortcut.exe')

    console.log(`Making ${exeWorkingDir}`)
    _fs.ensureDirSync(exeWorkingDir)

    console.log(`> cd ${exeWorkingDir}`)
    process.chdir(exeWorkingDir)

    console.log(`Making shortcut reader\n\n`)
    _fs.outputFileSync('./lib/shortcut/Shortcut.exe', shortcutExe)
  }

  function patchScriptsConfigXML(WoWSRoot){
    const {Parser, Builder} = require('xml2js')

    const scriptsConfigPath = _path.join(WoWSRoot, 'res', 'scripts_config.xml')

    try{
      _fs.readFile(scriptsConfigPath, function(err, result){
        let xmlContentObj = new Parser().parseString(result)
        console.dir(xmlContentObj)
      })
    }
    catch(err){
      console.error(`An Error occurs when trying to read ${scriptsConfigPath}`)
      console.error(err)
    }
  }

  if(IS_STANDALONE_EXE){
    initWorkingDir(_path.join('.', NPM_PACKAGE.name))
  }

  const lnkDirCandidates = ['WoWS Weekend', 'World of Warships']

  console.log('Auto-detecting WoWS root directory from Windows start menu')
  for(let lnkDir of lnkDirCandidates){
    let lnkPath = `%APPDATA%/Microsoft/Windows/Start Menu/Programs/${lnkDir}/World of Warships.lnk`

    console.log(`Trying ${lnkPath}`)
    try{
      _fs.accessSync(lnkPath, _fs.R_OK)
    }
    catch(err){
      console.log("No such .lnk file")
      continue
    }

    _lnk.query(lnkPath, function(err, result){
      if(err){
        console.error('An error occurs when reading the symbolic link')
        console.error(err)
        return
      }
      if(result.expanded.target){
        let wowsRoot = _path.dirname(result.expanded.target)
        console.log(`You WOWS directory is at ${wowsRoot}`)
        patchScriptsConfigXML(wowsRoot)
      }
    })
  }
}
else{
  console.log('#ERROR: This is not a Windows platform.')
}

process.stdin.on('data', function(){
  process.exit(0)
})
console.log("Press ENTER to exit ...")

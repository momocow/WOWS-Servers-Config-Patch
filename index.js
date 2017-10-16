let textLog = ''
process.on('exit', function(){
  if(typeof textLog == 'string' && textLog){
    require('fs').writeFileSync('./app.log', textLog)
  }
})

if(process.platform == 'win32'){
  const _Promise = require('bluebird')
  const _fs = require('fs-extra')
  const _lnk = require('windows-shortcuts')
  const _path = require('path')

  const NPM_PACKAGE = require('./package.json')
  const APP_ROOT = _path.join(process.env.APPDATA, NPM_PACKAGE.name)
  const WOWS_ROOT_FILE = _path.join(APP_ROOT, 'wows-root.dat')
  const IS_STANDALONE_EXE = _path.basename(process.argv[0], ".exe") != "node"

  // mocking console.log and console.error
  const _LOG = console.log
  const _ERROR = console.error
  console.log = function(msg){
    _LOG(msg)

    textLog += msg + '\r\n'
  }
  console.error = function(msg){
    _ERROR(msg)

    textLog += msg + '\r\n'
  }

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

  function patchScriptsConfigXML(WoWSRoot = '.'){
    const _xml = require('xml2js')

    const scriptsConfigPath = _path.join(WoWSRoot, 'res', 'scripts_config.xml')

    try{
      let newServers, newServerSrc
      try{
        _fs.accessSync('./servers.xml', _fs.R_OK)
        newServers = _fs.readFileSync(newServerSrc = './servers.xml')
      }
      catch(err){
        newServers = _fs.readFileSync(newServerSrc = './assets/data/servers.xml')
      }

      _xml.parseString(newServers, function(err1, newServersObj){
        if(err1){
          console.log(`A error occurs when parsing new servers from ${newServerSrc}`)
          pauseBeforeExit()
          return
        }

        if(newServersObj.server && newServersObj.server.host && newServersObj.server.host.length > 0){
          _xml.parseString(_fs.readFileSync(scriptsConfigPath), function(err2, xmlContentObj){
            if(err2){
              console.log(`A error occurs when parsing configs from ${scriptsConfigPath}`)
              pauseBeforeExit()
              return
            }

            for(let newServer of newServersObj.server.host){
              let exist = false
              for(let server of xmlContentObj["scripts_config.xml"].server[0].host){
                if(newServer.$.realm == server.$.realm){
                  console.log(`Server '${server.$.realm}' has already existed.`)
                  exist = true
                  break
                }
              }

              if(!exist){
                console.log(`Adding new server '${newServer.$.realm}'`)
                xmlContentObj["scripts_config.xml"].server[0].host.push(newServer)
              }
            }

            let newScriptsConfigXML = new _xml.Builder({
              headless: true,
              renderOpts:{pretty: true, indent: '  ', newline: '\r\n'}
            }).buildObject(xmlContentObj)

            try{
              _fs.accessSync(scriptsConfigPath, _fs.R_OK | _fs.W_OK)
              _fs.writeFileSync(scriptsConfigPath, newScriptsConfigXML)
              console.log("Success!")
            }
            catch(err3){
              console.error(`An error occurs. Unable to access and write ${scriptsConfigPath}`)
              console.error(err3)
            }
            pauseBeforeExit()
          })
        }
        else{
          console.log("No new server is found.")
          pauseBeforeExit()
        }
      })
    }
    catch(err){
      console.error(err)
      pauseBeforeExit()
    }
  }

  function autoDetectWoWSRoot(){
    return new _Promise(function(resolve, reject){
      const lnkDirCandidates = ['WoWS Weekend', 'World of Warships']

      console.log('Auto-detecting WoWS root directory from Windows start menu')
      let lnkExist = false
      for(let lnkDir of lnkDirCandidates){
        let lnkPath = `${process.env.APPDATA}/Microsoft/Windows/Start Menu/Programs/${lnkDir}/World of Warships.lnk`

        console.log(`Trying ${lnkPath}`)
        try{
          _fs.accessSync(lnkPath, _fs.R_OK)
        }
        catch(err){
          console.log("No such .lnk file")
          continue
        }

        lnkExist = true
        _lnk.query(lnkPath, function(err, result){
          if(err){
            console.error('An error occurs when reading the symbolic link')
            console.error(err)
            pauseBeforeExit()
            return
          }
          if(result.expanded.target){
            let wowsRoot = _path.dirname(result.expanded.target)
            console.log(`You WOWS directory is at ${wowsRoot}`)
            _fs.outputFileSync(WOWS_ROOT_FILE, wowsRoot, {encoding: 'utf8'})
            resolve(wowsRoot)
          }
        })
      }

      if(!lnkExist){
        reject()
      }
    })
  }

  if(IS_STANDALONE_EXE){
    initWorkingDir(APP_ROOT)
  }

  try{
    let wowsRoot = _fs.readFileSync(WOWS_ROOT_FILE, {encoding: 'utf8'})
      .replace('\r', '')
      .replace('\n', '')
      .trim()

    _fs.accessSync(wowsRoot, _fs.R_OK)

    console.log(`Cached WoWS root directory is still effective.`)
    console.log(`You WOWS directory is at ${wowsRoot}`)
    patchScriptsConfigXML(wowsRoot)
  }
  catch(e){
    autoDetectWoWSRoot().then(patchScriptsConfigXML, function(){
      console.error(`Cannot find your WoWS directory. You can define it your self at ${WOWS_ROOT_FILE}`)
      pauseBeforeExit()
    })
  }
}
else{
  console.log('#ERROR: This is not a Windows platform.')
}

function pauseBeforeExit(){
  process.stdin.on('data', function(){
    process.exit(0)
  })
  console.log("Press ENTER to exit ...")
}

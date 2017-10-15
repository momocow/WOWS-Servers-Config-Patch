const _fs = require('fs-extra')
const _gulp = require('gulp')
const _nexe = require('nexe')

_gulp.task('release', function(){
  process.env.PROJECT_ROOT = './'
  _fs.ensureDirSync('./dist')
  return _nexe.compile({
    input: './index.js',
    output: './dist/WoWS-servers-patch.exe',
    build: true,
    target: 'windows-x64-8.5.0',
    ico: './assets/icon/wows.ico',
    loglevel: 'verbose'
  }).then(() => {
    console.log('A release is built for Windows-x64')
  })
})

_gulp.task('default', ['release'])

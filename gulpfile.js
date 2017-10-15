const _gulp = require('gulp')
const _nexe = require('nexe')

_gulp.task('release', ''
)


_nexe.compile({
  input: './index.js',
  output: './dist/WoWS-servers-patch.exe'
}).then(() => {
  console.log('success')
})

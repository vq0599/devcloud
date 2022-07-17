import MarkdownIt from 'markdown-it'
import * as fs from 'fs/promises'
import * as gulp from 'gulp'
import * as through2 from 'through2'
import * as path from 'path'

async function main() {
  const md = new MarkdownIt({ html: true });
  const template = await fs.readFile('./compiler/template.html', { encoding: 'utf-8' })
  const contentFlag = '<!-- [[CONTENT]] -->'
  const titleFlag = '<!-- [[TITLE]] -->'

  gulp.src('./src/*.md')
   .pipe(through2.obj((file, _, cb) => {
      if (file.isBuffer()) {
        const source = file.contents.toString() as string
        const [ titleDoc ] = source.split('\n')
        const matched = /<!-- (.+) -->/.exec(titleDoc)
        const title = matched ? matched[1] : ''
        const body = md.render(source);
        const contents = template
          .replace(contentFlag, body)
          .replace(titleFlag, title)
          
        file.path = (file.path as string).replace(/.md$/, '.html')
        file.contents = Buffer.from(contents)
      }
      cb(null, file)
   }))
   .pipe(gulp.dest('./dist'))
}

main()


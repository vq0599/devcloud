import MarkdownIt from 'markdown-it'
import fs from 'fs/promises'
import gulp from 'gulp'
import through2 from 'through2'
import path from 'path'

async function main() {
  const md = new MarkdownIt({ html: true });
  const template = await fs.readFile('./compiler/template.html', { encoding: 'utf-8' })
  const contentFlag = '<!-- [[CONTENT]] -->'
  const titleFlag = '<!-- [[TITLE]] -->'
  const catalogueFlag = '<!-- [[CATALOGUE]] -->'
  const catalogue = []

  gulp.src('./src/*.md')
   .pipe(through2.obj((file, _, cb) => {
      if (file.isBuffer()) {
        const source = file.contents.toString()
        const [ titleDoc ] = source.split('\n')
        const matched = /<!-- (.+) -->/.exec(titleDoc)
        const title = matched ? matched[1] : ''
        const body = md.render(source);
        const filename = path.basename(file.history[0]).replace(/\.[^/.]+$/, "")
        const contents = template
          .replace(contentFlag, body)
          .replaceAll(titleFlag, title)

        catalogue.push({ path: filename, title })
        file.path = file.path.replace(/.md$/, '.html')
        file.contents = Buffer.from(contents)
      }
      cb(null, file)
   }))
   .pipe(gulp.dest('./dist'))
   .pipe(gulp.src('./compiler/index.html'))
   .pipe(through2.obj((file, _, cb) => {
      // TODO 这里执行了三次，看看怎么优化
      const source = file.contents.toString()
      const html = `<ul>
      ${
        catalogue.reduce((prev, current) => {
          return prev + `<li><a href="/${current.path}">${current.title}</a></li>\n`
        }, '')
      }
      </ul>
      `
      const contents = source.replace(catalogueFlag, html)
      console.log(html);

      file.contents = Buffer.from(contents)
      cb(null, file)
    }))
   .pipe(gulp.dest('./dist'))
}

main()


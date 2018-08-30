const strToStream = require('string-to-stream')
const spawn = require('child_process').spawn
const through = require('through2')
const temp = require('temp')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

/**
 * Generates a ODT or DOCX from a LaTeX document.
 *
 * @param {String} src - The LaTeX document.
 * @param {Object} options - Optional compilation specifications.
 *
 * @return {DestroyableTransform}
 */
export async function latexToOOO(src: string, options?: any): Promise<Buffer> {

  // Pandoc does not recognize tasks

  src = src.replace(/\\dfrac/gmi, "\\, \\dfrac").replace(/\\frac/gmi, "\\, \\frac").
  replace(/\\begin\{tasks\}\(1\)/gmi, "\n \\begin{enumerate}[a)]").replace(/\\begin\{tasks\}\(2\)/gmi, "\\begin{enumerate}[a)]\n")
  .replace(/\\end\{tasks\}/gmi, "\\end{enumerate}\n").replace(/\\task!/gmi, "\\item ").replace(/\\task/gmi, "\\item ").
  replace(/\$\\,\$/gmi, "\\,").replace(/\$\\quad\$/gmi, "\\quad")
  .replace(/=\$/gmi, "={}$").replace(/\$=\$/gmi, "{}={}$");

  console.log(src)

  options.ext = options.ext ||  "odt";


  return new Promise<Buffer>((resolve, reject) => {
    const outputStream = through()
    options = options || {}

    /**
     * Emits the given error to the returned output stream.
     */
    const handleErrors = (err) => {
      outputStream.emit('error', err)
      outputStream.destroy()
    }

    /**
     * Emits errors from logs to output stream, and also gives full log to user if requested.
     */
    const printErrors = (tempPath, userLogPath) => {
      const errorLogPath = path.join(tempPath, 'texput.log')
      const errorLogStream = fs.createReadStream(errorLogPath)

      if (userLogPath) {
        const userLogStream = fs.createWriteStream(userLogPath)
        errorLogStream.pipe(userLogStream)
      }

      const errors = []

      errorLogStream.on('data', (data) => {
        const lines = data.toString().split('\n')
        lines.forEach((line, i) => {
            errors.push(line)      
        })
      })

      errorLogStream.on('end', () => {
        const errMessage = `LaTeX Syntax Error\n${errors.join('\n')}`
        const error = new Error(errMessage)
        //outputStream.emit('error', error);
        console.log(src);
        reject(error);
      })
    }
    const dirname = "node-latex-" + Math.random().toString(32).substring(2);

    temp.mkdir(dirname, (err, tempPath) => {
      if (err) {
        handleErrors(err)
      }

      let inputStream;

      if (!src) {
        handleErrors(new Error('Error: No TeX document provided.'))
      }

    
      inputStream = strToStream(src)
      

      options = options || {}
 

      // The binary command to run.
      const cmd = options.cmd || 'pandoc'

      // The path to where the user wants to save the error log file to.
      const userLogPath = options.errorLogs

      const args = options.args || [
        '-s',
        '--from=latex',
        '--to=' + options.ext,
        '--output=texput.' + options.ext
      ]

      const opts = {
        cwd: tempPath,
        env: Object.assign({}, process.env, {
        })
      }


      /**
       * Returns the DOCX or ODT stream after the run.
       */
      const returnDocument = () => {
        
        const oooPath = path.join(tempPath, 'texput.' + options.ext)
        
        fs.readFile(oooPath, function (err, buffer) {
          if (err) {
            reject(err);
            return;
          }
          fse.removeSync(tempPath);
          //Resolve the promise
          resolve(buffer);
        });
      }



      /**
       * Runs a pandocs child process on the document stream
       * and then decides whether it needs to do it again.
       */
      const pandoc = spawn(cmd, args, opts)

      inputStream.pipe(pandoc.stdin)

      // Prevent Node from crashing on compilation error.
      pandoc.stdin.on('error', handleErrors)

      pandoc.on('error', () => {
        handleErrors(new Error(`Error: Unable to run ${cmd} command.`))
      })

      pandoc.stdout.on('data', (data) => { });

      pandoc.stderr.on('data', (data) => { });

      pandoc.on('close', (code) => { });

      pandoc.on('exit', (code) => {
        if (code !== 0) {
          printErrors(tempPath, userLogPath)
          return
        }
        returnDocument()
      })



    });

    //end promise bloc
  });
}

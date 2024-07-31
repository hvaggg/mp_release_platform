import * as downloadGit from 'download-git-repo'
import * as path from 'path'
import * as fs from 'fs'
import * as shell from 'shelljs'
import simpleGit from 'simple-git'
const git = simpleGit();
const { exec } = require('child_process');


// const simpleGit = require('simple-git') 

// 根据传入的相对跟目录路径计算绝对路径
// @params pathname: 相对路径
// @return 绝对路径
export function fixedToRelativePath (pathname: string): string {
  return path.join(process.cwd(), pathname)
}
 
 
export async function runNpmCommand(command: string, projectPath:string): Promise<void> {
  console.log(process.execPath);
  console.log(__dirname);
  console.log(process.cwd())
  await execPromise(command, projectPath)
  // const childProcess = exec(command);
  // return new Promise(async (resolve, reject) => {
  //   childProcess.on('error', (error) => {
  //     reject(error);
  //     console.error('Command execution error:', error);
  //   });
  //   childProcess.on('exit', (code, signal) => {
  //     if (code !== 0) {
  //       reject(`Command exited with non-zero status code: ${code}`);
  //       console.error(`Command exited with non-zero status code: ${code}`);
  //     } else {
  //       resolve();
  //       console.log('Command executed successfully!');
  //     }
  //   });

  // })
}
 
 
// 示例：执行npm install命令
// 下载项目
export function download (storePath: string, projectPath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    console.log(storePath, projectPath,'storePath, projectPath')
    // downloadGit(storePath, projectPath, null, err => {
    //   if (err) reject(err)
    //   resolve()
    // })http://code.jms.com:jms-mp-month-front.gite#my-branch
//     downloadGit('http://code.jms.com:jms-mp-month-front.gite#my-branch', 'test/tmp', { clone: true }, function (err) {
//     console.log(err,'err2121', simpleGit)
//     if (err) reject(err)
//       resolve()
 
// })
// git.clone('http://code.jms.com:jms-mp-month-front.git', projectPath) 
// .then(() => console.log('Repository cloned!'))
try {
  await git.clone(storePath, projectPath,['--branch', 'masterNew']);
  console.log("克隆完成");
  exec(`npm install --legacy-peer-deps`, { cwd: projectPath }, (error, stdout, stderr) => {
    if (error) {
      console.error("安装依赖过程中出现错误:", error);
      reject(error);
      return;
    }
    console.log("依赖安装完成");
    console.log(stdout);
    console.error(stderr);
    resolve();
  });
} catch (err) {
  console.error("克隆过程中出现错误:", err);
  reject(err);
}

    // downloadgit(repo, destination, { clone: true }, function(err) {
    //   if (err) {
    //     console.error("克隆过程中出现错误:", err);
    //     reject(err)
    //   } else {
    //     console.log("克隆完成");
    //     resolve()
    //   }
    // });
  })
}

// 初始化项目路径
export function initProjectPath (projectPath: string): void {
  if (typeof projectPath !== 'string') throw new TypeError('projectPath is not string')
  console.log(projectPath,'projectPath')
  // 检测路径是否存在，若不存在则创建出路径
  projectPath.split('/').reduce((previous, current) => {
    previous += `${current}`
    console.log(!fs.existsSync(previous),'previous')
    if (!fs.existsSync(previous)) {
      mkdir(previous)
    }
    return previous
  }, '')

  function mkdir(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdir(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
  // 清空当前路径下的所有文件及文件夹
  const removeMkdir = (projectPath) => {
    if (fs.existsSync(projectPath)) {
      fs.readdirSync(projectPath).map(fileName => {
        const currentPath = `${projectPath}/${fileName}`
        if (fs.statSync(currentPath).isDirectory()) {
          removeMkdir(currentPath)
        } else {
          fs.unlinkSync(currentPath)
        }
      })
      fs.rmdirSync(projectPath)
    }
  }

  
  const checkRemoveMkdir = () => {
    try {
      removeMkdir(projectPath)
    } catch (err) {
      //
    }
    
    if (fs.existsSync(projectPath)) {
      checkRemoveMkdir()
    }
  }

  checkRemoveMkdir()
}

// 启用子进程执行shell命令
export function execPromise (command: string, cwd: string): Promise<any> {
  return new Promise((resolve: any) => {
    shell.exec(command, {
      async: true,
      silent: process.env.NODE_ENV !== 'development',
      stdio: 'ignore',
      cwd,
    }, (...rest) => {
      resolve(...rest)
    })
  })
}

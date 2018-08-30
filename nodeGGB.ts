import * as puppeteer from 'puppeteer';
import { EventEmitter } from 'events';
import { worker } from 'cluster';
const path = require("path");
const fs = require("fs");
const dir = path.resolve("./geogebra-math-apps-bundle/GeoGebra/HTML5/5.0/simple2.html");
const DEBUG = true;
let window: any;

// A pool --> browser
// A worker --> is a page browser

export class GGBPool {
  browser: puppeteer.Browser;
  availableWorkers: GGBWorker[];
  usedWorkers: GGBWorker[] = [];
  releasedEmitter: EventEmitter;
  priorityCue: PriorityCue;
  isCreated: boolean;

  availablePages: any[];

  constructor(private numWorkers: number) {
    this.releasedEmitter = new EventEmitter();
    this.priorityCue = new PriorityCue(this.releasedEmitter)
    // Return released workers to the pool
    this.releasedEmitter.on("released", (worker: GGBWorker) => {
      const indx = this.usedWorkers.indexOf(worker);
      this.usedWorkers.splice(indx, 1);
      this.availableWorkers.push(worker);
    });
  }

  async create(): Promise<GGBPool> {
    if (this.isCreated) {
      return this;
    }

    // Wait for browser
    this.browser = await puppeteer.launch();
    let promises = new Array(this.numWorkers ||  5);
    for (var i = 0; i < this.numWorkers; i++) {
      promises[i] = this.browser.newPage();
    }

    // Wait for pages creation
    this.availablePages = await Promise.all(promises);
    this.availableWorkers = this.availablePages.map( (p, i) => new GGBWorker(i+1, p, this.releasedEmitter));
    promises = new Array(this.numWorkers ||  5);
    for (var i = 0; i < this.numWorkers; i++) {
      promises[i] = this.availablePages[i].goto('file://' + dir);
    }

    // Wait for page loading
    await Promise.all(promises);
    // Wait for app ready
    promises = new Array(this.numWorkers ||  5);
    for (var i = 0; i < this.numWorkers; i++) {
      promises[i] = this.availablePages[i].waitForFunction('window.ggbApplet != null');
    }
    await Promise.all(promises);
    return this;
  }

 
  private pickaWorker(): GGBWorker {
    const worker = this.availableWorkers[0];
    this.availableWorkers.splice(0, 1);
    this.usedWorkers.push(worker); 
    return worker;    
  }
 

  async getGGBWorker(): Promise<GGBWorker> {
    if (this.availableWorkers.length) {
      return this.pickaWorker();
    } else {
    const watcher = this.priorityCue.wait();
    watcher.then((worker) => {
      const idx = this.availableWorkers.indexOf(worker);
      this.availableWorkers.splice(idx, 1);
      this.usedWorkers.push(worker);
    });
    return watcher;
    }
  }

  async release() {
    const promises = [];
    for (var i = 0; i < this.numWorkers; i++) {
      promises.push(this.availablePages[i].close());
    }
    await Promise.all(promises);
    await this.browser.close();
  }

}


/**
function listenChangesinArray(arr, callback){
  // Add more methods here if you want to listen to them
 ['push'].forEach((m) => {
     arr[m] = function(){
                  var res = Array.prototype[m].apply(arr, arguments);  // call normal behaviour
                  callback(m, arguments);  // finally call the callback supplied
                  return res;
              }
 });
}
**/

class PriorityCue {
  static counter = 0;
  tasks: CueTask[];
  constructor(public releasedEmitter: EventEmitter) {
    this.tasks = [];
  }

  async wait(): Promise<GGBWorker> {
    PriorityCue.counter += 1;
    const cueTask = new CueTask(PriorityCue.counter, this);
    this.tasks.push(cueTask);
    return cueTask.subscribe();
  }

}

class CueTask {
  isSubscribed: boolean;
  watcher;
  constructor(public id: number, private cue: PriorityCue) {
  }

  subscribe(): Promise<GGBWorker> {
    const self = this;
    return new Promise((resolve, reject) => {
      // Listen to released events from the pool
      self.watcher = self.cue.releasedEmitter.on("released", function (worker) {        
        //check if am i the first in the cue?
        const order = self.cue.tasks.indexOf(self);
        console.log("I am task "+ self.id + " my place is " + order + "; ");
        if (order === 0) {
          //Am taking this worker. Remove me from the cue
          self.cue.tasks.splice(0, 1);
          resolve(worker);
        }
      });
    });
  }


}



class GGBWorker {
  constructor(public id: number, private page: puppeteer.Page, private releasedEmitter: EventEmitter) {
  }
  async eval(script: string[]) {
    const cmd = script.join("\n")
    return this.page.evaluate((x) => window.ggbApplet.evalCommand(x), cmd);
  }
  async exportSVG(): Promise<string> {
    return this.page.evaluate(() => window.ggbApplet.exportSVG());
  }
  async exportPDF(): Promise<string> {
    return this.page.evaluate(() => window.ggbApplet.exportPDF());
  }
  async release() {
    // Get rid of applet contents
    await this.page.evaluate(() => window.ggbApplet.reset());
    // notify to the cue that a worker has been released and must be returned to the pool
    this.releasedEmitter.emit("released", this);
  }
}


(async() => {
  const pool = new GGBPool(3);
  await pool.create();
  console.log("POOL CREATED"); 

  async function doSomething (taskNum: number) {
      const worker = await pool.getGGBWorker();
      console.log(taskNum + ":: OBTAINED WORKER_" + worker.id);
      await worker.eval(["A=("+Math.random()+","+Math.random()+")", "f(x)=cos(x)"]);
      console.log(taskNum + ":: EVAL WORKER_" + worker.id);
      const pdf = await worker.exportPDF();
      console.log(taskNum + ":: PDF WORKER_" + worker.id + " --> "+ pdf.substring(0,100));
      await worker.release();
      console.log(taskNum + ":: RELEASED WORKER_"+ worker.id);
  }

  await Promise.all([doSomething(1), doSomething(2), doSomething(3), doSomething(4), doSomething(5)]);

   
   

  await pool.release();
})()

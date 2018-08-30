const puppeteer = require('puppeteer');
const path = require("path");
const fs = require("fs");
const dir = path.resolve("./geogebra-math-apps-bundle/GeoGebra/HTML5/5.0/simple.html");
// Sample script
const ggbScript = ["f(x)=cos(x)*sin(x)*exp(-x)",  "A=(0,0)", "Tangent(A,f)"]; 

(async () => {
  const browser = await puppeteer.launch(); 
  const page = await browser.newPage();
  await page.goto('file://'+dir);
  await page.waitForFunction('window.ggbApplet != null');
  let svg = await page.evaluate(async (script) => {
            window.ggbApplet.evalCommand(script);
            const svg = window.ggbApplet.exportSVG();            
            return svg;
  }, ggbScript.join("\n"));
  fs.writeFileSync("ggb.svg", svg);
  console.log("Resulting image:", svg)
  await page.close();
  await browser.close();
})();
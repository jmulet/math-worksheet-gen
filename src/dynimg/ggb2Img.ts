 /**
 * Transforms a geogebra script into an image of type optionally converted to base64
 */
import { GGBPool } from 'node-geogebra';
import { parseFormatString } from './gnp2Img';

const ggbPool = new GGBPool({ggb: "local", plotters: 5});
const readyPromise = ggbPool.ready();

export async function ggb2Img(src: string, type: string, toBase64?: boolean): Promise<Buffer | string> {
    await readyPromise;
    const plotter = await ggbPool.getGGBPlotter();  
    const [ext, term, width, height, dpi] = parseFormatString(type);    
    let w, h;
    try {
        w = parseInt(width);
        h = parseInt(height);
    } catch(Ex){}; 
    await plotter.evalGGBScript(src.split("\n"), w, h); 
    let output;
    if (toBase64) {
        output = await plotter.export64(ext);
    } else {
        output = await plotter.export(ext);
    }  
    await plotter.release(); 
    return output;
}
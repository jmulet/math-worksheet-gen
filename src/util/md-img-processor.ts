import { WsDynImg } from "../interfaces/WsDynImg";
import { Token } from "markdown-it";


export function mdImgProcessor(graphics: WsDynImg[]) {

    function findGraph(id: string): WsDynImg {
        return graphics.filter( (g)=> g.id == id)[0];
    }

    return (markdown) => {
        markdown.core.ruler.after('inline', 'replace-src-link', ({ tokens, env }) => {
            tokens.forEach( (token: Token) => {
                // markdown img tag
                if (token.type === 'inline' && token.children.length) {
                    token.children.forEach( (child:Token) => {
                        if (child.tag === 'img') {
                            const src = child.attrGet("src");
                            const graph = findGraph(src);
                            if (graph) {
                                child.attrSet("src", graph.base64);
                                child.attrSet("width", graph.dimensions[0]+"");
                            }
                        }
                    });
                }
            });
        });
    }
}
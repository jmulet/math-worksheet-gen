import { Token } from "markdown-it";
 
// TODO : handle token attrs and images

function renderToken(token: Token, builder: string[]) {
    
    let processChildren = true;
    
    //---------------------------------------------- text
    if (token.type === 'text') {
        builder.push(token.content);
    } 
    //----------------------------------------------- paragraphs
    else if (token.type === 'heading_open') {
        if (token.tag === 'h1') {
            builder.push("\n\n\\vspace{5mm}{\\Huge ");
        } else if (token.tag === 'h2') {
            builder.push("\n\n\\vspace{5mm}{\\huge ");
        } else if (token.tag === 'h3') {
            builder.push("\n\n\\vspace{2mm}{\\Large");
        } else if (token.tag === 'h4') {
            builder.push("\n\n\\vspace{2mm}{\\large \\bf");
        } else if (token.tag === 'h5') {
            builder.push("\n\n{\\large ");
        }       
    } else if (token.type === 'heading_close') {
        builder.push("} \\vspace{2mm} \n\n");
        if (token.tag==="h1" || token.tag === "h2") {
            builder.push("\\hr\n\n");
        }
    } else if (token.type === 'paragraph_open') {
        builder.push("\n\n");        
    } else if (token.type === 'paragraph_close') {
        builder.push("\n\n");        
    }
    else if (token.type === 'hr') {
        builder.push("\n\n\\hr \n\n");
    } 
    else if (token.type === 'blockquote_open') {
        builder.push("\\begin{displayquote}");
    } else if (token.type === 'blockquote_close') {
        builder.push("\\end{displayquote}");
    }
    //----------------------------------------------- styles
    else if (token.type === 'em_open') {
        builder.push("\\textit{");
    } else if (token.type === 'em_close') {
        builder.push("}");
    } else if (token.type === 'strong_open') {
        builder.push("\\textbf{");
    } else if (token.type === 'strong_close') {
        builder.push("}");
    } else if (token.type === 's_open') {
        builder.push("\\cancel{");
    } else if (token.type === 's_close') {
        builder.push("}");
    } 
    //------------------------------------------------- lists
    else if (token.type === 'ordered_list_open') {
        builder.push("\\begin{enumerate}");
    } else if (token.type === 'ordered_list_close') {
        builder.push("\\end{enumerate}");
    } else if (token.type === 'bullet_list_open') {
            builder.push("\\begin{itemize}");
    } else if (token.type === 'bullet_list_close') {
            builder.push("\\end{itemize}");
    } else if (token.type === 'list_item_open') {
        builder.push("\n\\item");
    } else if (token.type === 'list_item_close') {
        builder.push("\n");
    } 
    //-------------------------------------------------- links
    else if (token.type === 'link_open') {
        // \href{https://www.wikibooks.org}{Wikibooks home}
        builder.push("\\href{" + token.attrGet('href') + "}{");
    } else if (token.type === 'link_close') {
        builder.push("}");
    } 
    //-------------------------------------------------- images
    else if (token.type === 'image') {
        processChildren = false;
        const src = token.attrGet("src");
        const search = "wsmath/tikz/svg?cmd=";
        const indx = src.indexOf(search);
        if (indx >= 0) {
            const tikzEncoded = src.substr(indx + search.length);
            let scale = "1";
            if (token.attrGet("scale")) {
                scale = token.attrGet("scale") || "1";
            }
            builder.push(`\n\\begin{tikzpicture}[scale=${scale}]\n`)
            builder.push(decodeURIComponent(tikzEncoded));
            builder.push("\\end{tikzpicture}\n")
        }
    }  
    //-------------------------------------------------- tables
    else if (token.type === 'table_open') {
        builder.push("");
    } else if (token.type === 'table_close') {
        builder.push("");
    }
    else if (token.type === 'thead_open') {
        builder.push("");
    } else if (token.type === 'thead_close') {
        builder.push("");
    }
    else if (token.type === 'tbody_open') {
        builder.push("");
    } else if (token.type === 'tbody_close') {
        builder.push("");
    }
    else if (token.type === 'tr_open') {
        builder.push("");
    } else if (token.type === 'tr_close') {
        builder.push("");
    }
    else if (token.type === 'th_open') {
        builder.push("");
    } else if (token.type === 'th_close') {
        builder.push("");
    }
    else if (token.type === 'td_open') {
        builder.push("");
    } else if (token.type === 'td_close') {
        builder.push("");
    }

    //-------------------------------------------------- code
    else if (token.type === 'code_inline') {
        //Put the content into a gray box        
        builder.push("\\colorbox{light-gray}{"+ token.content + "}");
    } else if (token.type === 'fence') {
        //Put the content into a gray box        
        builder.push("\\quadrecolor{gray}{light-gray}{"+ token.content + "}");
    }

    if (token.children && processChildren) {
        token.children.forEach(childToken => renderToken(childToken, builder));
    }
}

export function latexRenderer(parsed: Token[]) {
    const builder = [];
    //Get rid of the first and last token if they are of type paragraph_open/close
    if (parsed[0].type === "paragraph_open" && parsed[parsed.length-1].type === "paragraph_close") {
        parsed.splice(0,1).splice(parsed.length-1,1);
    }
    parsed.forEach(token => renderToken(token, builder));
    return builder.join(" ");
}
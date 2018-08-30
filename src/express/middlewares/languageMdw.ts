const TRANSLATIONS = require("../../translations.json");
const config = require("../../../../micro-config.json");

function cookieParser(request, name) {
    let list = {};
    const rc = request.headers ? request.headers.cookie : request;

    if (rc) {
        
            rc.toString().split(';').forEach((cookie) => {
                const parts = cookie.split('=');
                let key = parts.shift().trim();
                let value = decodeURI(parts.join('='));
                value = value.replace(/['']/g, '');
                list[key] = value;
            });
       
    }

    if (name) {
        return list[name];
    }
    
    return list;
}

function langInspector(request, response) {
    let lang;

    // First check for queryParameter clang
    lang = (request.query["clang"] || "").toLowerCase();
    if (config.I18n.SUPPORTED_LANGS.indexOf(lang) < 0) {
        lang = null;
    } else if (response) {
        // set a cookie to avoid using queryParameters on future requests
        response.cookie("clang", lang);
    }

    // Second check for a clang cookie
    if (!lang && request.headers.cookie) {
        lang = (cookieParser(request, "clang") || "").toLowerCase();
        if (config.I18n.SUPPORTED_LANGS.indexOf(lang) < 0) {
            lang = null;
        }
    }

    // Finally, look for request header
    if (!lang) {
        lang = (request.acceptsLanguages(config.I18n.SUPPORTED_LANGS) || config.I18n.DEFAULT_LANG).toLowerCase();
        if (config.I18n.SUPPORTED_LANGS.indexOf(lang) < 0) {
            lang = config.I18n.DEFAULT_LANG;
        }
    }

    return lang;
}

  
function translatorFactory(lang) {
    const map = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return function(key) {  
      return map[key] || key;
    };
};
  

 module.exports = function(request, response, next) {
    const lang = langInspector(request, response);            
    response.locals.__ = translatorFactory(lang);
    response.locals.lang = lang;
    next();        
 };
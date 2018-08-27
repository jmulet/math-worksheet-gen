export interface WsGeneratorInterface {
    category: string,
    description?: string,
    parameters: {
        name: string,
        defaults: any,
        typeof?: string,
        description: string
    }[]
}

export const Container = {
}

/**
 * Decorator, dynamically generates the types of generator
 */
 export function WsGenerator(meta: WsGeneratorInterface) {

    meta.parameters.forEach( (p) => p.typeof= typeof(p.defaults) );

    return function(target) {
        Container[meta.category] = {
            meta: meta,
            clazz: target,
            moodleCapable: target.getQuizz !=null
        }
    }

 }
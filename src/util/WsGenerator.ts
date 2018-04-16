export interface WsGeneratorInterface {
    category: string,
    parameters: {
        name: string,
        defaults: any,
        description: string
    }[]
}

export const Container = {

}

/**
 * Decorator, dynamically generates the types of generator
 */
 export function WsGenerator(meta: WsGeneratorInterface) {

    return function(target) {
        Container[meta.category] = {
            meta: meta,
            clazz: target
        }

        console.log(Container);
    }

 }
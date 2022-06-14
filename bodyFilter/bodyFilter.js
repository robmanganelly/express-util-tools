/**
 * takes the request and filters for the needed fields.
 * @param { Object } body 
 * @param { String[] } props 
 * @returns { Object }
 */
const bodyFilter = function(body, props){
    
    let filtered = Object.create({});

    for (let prop of props){
        if (typeof prop !== 'string'){
         
            throw new Error(`Expected type string, but found ${typeof prop}`);
        
        }else if (!!body[prop]){
          
            filtered[prop] = body[prop];
          
        }
    }

    return filtered;
};

module.exports = {bodyFilter};

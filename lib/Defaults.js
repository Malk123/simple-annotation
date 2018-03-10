var Annotations2 = require('./Annotations2');

Annotations2.registerAnnotationValueType(
    'string',
    function(attr){
        return attr.toString();
    }
);

Annotations2.registerAnnotationValueType(
    'object',
    function(attr){
        return JSON.parse(attr);
    }
);

Annotations2.registerAnnotationValueType(
    'array',
    function(attr){
        return JSON.parse(attr);
    }
);

Annotations2.registerAnnotationValueType(
    'int',
    function(attr){
        return parseInt(attr);
    }
);


Annotations2.registerAnnotationReturnType(
    'ES6class',
    function(attr){

        const regex = /^.*class (.*?)$/;
        let a = attr.str.match(regex);

        if(a !== null){
            var s = require(attr.file);
            return new s();
        }

        return null;
    }
);

Annotations2.registerAnnotationReturnType(
    'ES6function',
    function(attr){

        const regex = /^\s*(.*?)\(/;
        let a = attr.str.match(regex);

        if(a !== null){
            var s = require(attr.file);
            var o = new s();


            return o[a[1]];
        }

        return null;
    }
);

Annotations2.registerAnnotationReturnType(
    'function',
    function(attr){

        var regex = [
            /^\s*module\.exports\s*\=\s*function\s*(.*?)\(/,
            /^\s*(?:var|const|let)\s*(.*?)\s*\=\s*/,
            /^\s*exports\.(.*?)\s*\=\s*/
        ];

        for(var i in regex){
            let m;
            m = attr.str.match(regex[i]);

            if(m != null){

                var s = require(attr.file);

                if(typeof s == 'function'){
                    return s;
                }else if(typeof s[m[1]] == 'function'){
                    return s[m[1]];
                }

                break;
            }
        }
        return null;
    }
);

Annotations2.registerAnnotationReturnType(
    'var',
    function(attr){

        const regex = /^\s*var\s*(.*?)\s*\=\s*/;
        let a = attr.str.match(regex);

        if(a !== null){
            var s = require(attr.file);
            return s[a[1]];
        }

        return null;
    }
);

module.exports = Annotations2;
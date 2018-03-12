var assert = require('assert');
var Anno = require('../simple-annotation');


Anno.registerAnnotation(
    'AnnotationES6Function', // Annotation Name
    'string', // Annotation Value Type   {string, int, array, object}
    'ES6function' // Annotation Return Type   {class, function, var, module}
);

Anno.registerAnnotation(
    'AnnotationClassString', // Annotation Name
    'string', // Annotation Value Type   {string, int, array, object}
    'ES6class' // Annotation Return Type   {class, function, var, module}
);

Anno.registerAnnotation(
    'AnnotationClassObject', // Annotation Name
    'object', // Annotation Value Type   {string, int, array, object}
    'ES6class' // Annotation Return Type   {class, function, var, module}
);

Anno.registerAnnotation(
    'AnnotationClassArray', // Annotation Name
    'array', // Annotation Value Type   {string, int, array, object}
    'ES6class' // Annotation Return Type   {class, function, var, module}
);

Anno.registerAnnotation(
    'AnnotationClassInt', // Annotation Name
    'int', // Annotation Value Type   {string, int, array, object}
    'ES6class' // Annotation Return Type   {class, function, var, module}
);

Anno.registerAnnotation(
    'AnnotationFunction', // Annotation Name
    'string', // Annotation Value Type   {string, int, array, object}
    'function' // Annotation Return Type   {class, function, var, module}
);

Anno.registerAnnotation(
    'AnnotationVariable', // Annotation Name
    'string', // Annotation Value Type   {string, int, array, object}
    'var' // Annotation Return Type   {class, function, var, module}
);


var g = new Anno({
    removeDoubleFiles: true
});

g.setPaths([
    '/test/testfolder/es6TestClass.js',
    '/test/*/test.js',
    '/test/*/function*.js',
    '/test/*/var.js'
]);


describe('Annotation Value Check', function() {

    it('String', function(){
        var m = g.find('AnnotationClassString');
        assert.equal(typeof m[0].value, 'string');
    });

    it('Object', function(){
        var m = g.find('AnnotationClassObject');
        assert.equal(typeof m[0].value, 'object');
    });

    it('Array', function(){
        var m = g.find('AnnotationClassArray');
        assert.equal(Array.isArray(m[0].value), true);
    });

    it('Integer', function(){
        var m = g.find('AnnotationClassInt');
        assert.equal(typeof m[0].value, 'number');
    });

});



var m = g.findAll();

describe('Counter check', function() {
    it('Counter check', function(){
        assert.equal(Object.keys(m['AnnotationFunction']).length, 5);
    });
    it('Counter check', function(){
        assert.equal(Object.keys(m).length, 7);
    });
});

for(var i in m){

    if(i == 'AnnotationFunction'){
        describe('AnnotationFunction', function() {
            for(var b in m[i]){
                var tt = m[i][b].return('test123');
                it(m[i][b].value, function(){
                    assert.equal(tt, 'test123');
                });
            }
        });
    }

    if(i == 'AnnotationES6Function'){

        var checkES6Function = m[i][0].return('test123');

        describe('AnnotationES6Function', function() {
            it(m[i][0].value, function(){
                assert.equal(checkES6Function, 'test123');
            });
        });
    }

    if(i == 'AnnotationClassString'){
        var oo = m[i][0].return;


        describe('AnnotationClassString', function() {
            it('isObject', function(){
                assert.equal(typeof oo, 'object');
            });
            it(m[i][0].value, function(){
                assert.equal(oo.myTestFunction1('test123'), 'test123');
            });
        });

    }

    if(i == 'AnnotationVariable'){
        describe('AnnotationVariable', function() {
            it(m[i][0].value, function(){
                assert.equal(m[i][0].return, 'test123Variable');
            });
        });
    }
}
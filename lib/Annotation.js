'use strict';

class Annotations2{

    /**
     * @param options
     */
    constructor(options){
        this.options = {
        };

        this.paths = [];
        this.files = [];
        this.global_annotations_array = [];
        this.global_parsed_annotations = [];

        this.fs = require("fs");
        this.fc = require('./Filecrawler');
        this.path = require('path');
    }

    /**
     *
     * @param name {string}
     * @param type {string}
     * @param returnType {function}
     */
    static registerAnnotation(
        name,
        type,
        returnType
    ){
        Annotations2.registered_annotaions[name] = {
            type: type,
            returnType: returnType
        };
    }

    /**
     *
     * @param name {string}
     * @param func {function}
     */
    static registerAnnotationValueType(
        name,
        func
    ){
        Annotations2.registered_annotaion_value_type[name] = {
            func: func
        };
    }

    /**
     *
     * @param name {string}
     * @param func {function}
     */
    static registerAnnotationReturnType(
        name,
        func
    ){
        Annotations2.registered_annotaion_return_type[name] = {
            func: func
        };
    }

    /**
     * Load all files from given
     * array to the this.files array.
     */
    loadFiles(){
        if(this.paths.length == 0)
            throw 'Set one or more paths.';

        for(var i in this.paths){
            var fc = new this.fc(this.paths[i]);

            var file_array = fc.getFiles();

            for(var i in file_array){
                /**
                 * Ignore double files.
                 */
                if(!this.files.includes(file_array[i])){
                    this.files.push(file_array[i]);
                }
            }
        }
    }

    /**
     * Parse found files.
     */
    getAnnotationsFromFiles(){
        var parsed_annotations = [];
        for(var num in this.files){
            var file = this.fs.readFileSync(this.files[num], "utf8");
            var annotations_array = [];
            var parsed_annotations_array = [];

            /**
             * Get comments from file.
             * @type {RegExp}
             */
            var reg = new RegExp(/^.*(\/\*(?:.|\r\n)*?\*\/(?:.|\r\n)*?)([a-zA-Z0-9]+[^-{;]+)/, 'mg');

            let m;

            while ((m = reg.exec(file)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === reg.lastIndex) {
                    regex.lastIndex++;
                }

                var comment_obj = {};

                m.forEach((match, groupIndex) => {

                    if(groupIndex == 1){

                        /**
                         * Regex to find annotation in comment.
                         * @type {RegExp}
                         */
                        const regex1 = /^\s+\*{1}\s+.*@\s*(.*?)\s+(.*?)$/gm;

                        let annotation_array = [];
                        let m2;
                        while ((m2 = regex1.exec(match)) !== null) {
                            // This is necessary to avoid infinite loops with zero-width matches
                            if (m2.index === regex1.lastIndex) {
                                regex.lastIndex++;
                            }

                            var anontations_obj = {};
                            m2.forEach((match2, groupIndex1) => {

                                if(groupIndex1 == 1){ // Annotation Name
                                    anontations_obj.name = match2;
                                }else if(groupIndex1 == 2){  // Annotation Value
                                    anontations_obj.value = match2;
                                }


                            });
                            annotation_array.push(anontations_obj);
                        }
                        comment_obj.annotations = annotation_array;
                    }

                    /**
                     * Annotation Function/Class/Module
                     */
                    if(groupIndex == 2){
                        comment_obj.function = match;
                    }

                    if(Object.keys(comment_obj).length === 2 && comment_obj.constructor === Object ) {

                        for(var b in comment_obj.annotations){

                            /**
                             * Check if annotation, value type and return type registered.
                             */
                            if(typeof Annotations2.registered_annotaions[comment_obj.annotations[b].name] != 'undefined' && //if annotation registered
                                typeof Annotations2.registered_annotaion_value_type[Annotations2.registered_annotaions[comment_obj.annotations[b].name].type] != 'undefined' &&
                                typeof Annotations2.registered_annotaion_return_type[Annotations2.registered_annotaions[comment_obj.annotations[b].name].returnType] != 'undefined'){

                                if(!Array.isArray(parsed_annotations[comment_obj.annotations[b].name]))
                                    parsed_annotations[comment_obj.annotations[b].name] = [];

                                parsed_annotations[comment_obj.annotations[b].name].push({
                                    file: this.files[num],
                                    value: Annotations2.registered_annotaion_value_type[Annotations2.registered_annotaions[comment_obj.annotations[b].name].type].func(comment_obj.annotations[b].value),
                                    'return': Annotations2.registered_annotaion_return_type[Annotations2.registered_annotaions[comment_obj.annotations[b].name].returnType].func({
                                        str: comment_obj.function,
                                        file: this.files[num]
                                    })
                                });


                            }
                        }

                        if(Object.keys(parsed_annotations).length != 0){
                            parsed_annotations_array.push(parsed_annotations);
                        }

                    }
                });
            }
        }

        this.global_parsed_annotations = parsed_annotations;


    }

    /**
     * Check Path if absolute.
     * @param path {string}
     * @returns {*|string}
     */
    checkPath(path){
        if(this.path.isAbsolute(path)){
            return this.path.normalize(path);
        }
    }

    /**
     *
     * @param path {string}
     */
    setPath(path){
        this.paths.push(this.checkPath(path));
    }

    /**
     *
     * @param paths {array}
     */
    setPaths(paths){
        for(var i in paths){
            this.paths[i] = this.checkPath(paths[i]);
        }
    }

    /**
     *
     * @param str {string}
     * @returns {*}
     */
    find(str){
        this.getAnnotations();
        return this.global_parsed_annotations[str];
    }

    /**
     *
     * @returns {Array|*}
     */
    findAll(){
        this.getAnnotations();
        return this.global_parsed_annotations;
    }

    getAnnotations(){
        this.loadFiles();
        this.getAnnotationsFromFiles();
    }
}

Annotations2.registered_annotaion_value_type = [];
Annotations2.registered_annotaion_return_type = [];
Annotations2.registered_annotaions = [];

module.exports = Annotations2;
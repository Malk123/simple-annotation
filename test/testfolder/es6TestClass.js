/**
 * @AnnotationClassString AnnotationClassString
 * @AnnotationClassObject {"hello": 123}
 * @AnnotationClassArray [1234]
 * @AnnotationClassInt 12345
 * @EmptyAnnotation
 */
class test{

    /**
     * This is a Test comment to check if we can set a comment without an annotation.
     * If it fail. Change the comment regex.
     */

    /**
     * @AnnotationES6Function AnnotationES6Function
     */
    myTestFunction1(str){
        return str;

    }
}
module.exports = test;

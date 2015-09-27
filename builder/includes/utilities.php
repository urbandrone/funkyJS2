<?php
/**
* Utility methods (static)
*/
class Utils
{
    public static function requestParam($name)
    {
        if (is_string($name) and isset($_REQUEST[$name])) {
            return $_REQUEST[$name];
        }
        return null;
    }

    public static function getFiles($selection, $mapping)
    {
        $files = array();
        foreach ($selection as $id) {
            if (isset($mapping[$id])) {
                $files[$id] = file_get_contents(
                    $mapping[$id],
                    FILE_USE_INCLUDE_PATH
                );
            }
        }
        return $files;
    }

    public static function transform($filesArray)
    {
        $transformed = array();
        foreach ($filesArray as $key => $value) {
            $transformed[] = array(
                'id' => $key,
                'text' => $value
            );
        }
        return $transformed;
    }

    public static function getFilesMap()
    {
        $map = array(
            'birds' => 'sources/birds.js',
            'type' => 'sources/type.js',
            'arity' => 'sources/arity.js',
            'decorators' => 'sources/decorators.js',
            'decorators2' => 'sources/ext/decorators.js',
            'combinators' => 'sources/combinators.js',
            'combinators2' => 'sources/ext/combinators.js',
            'arrays' => 'sources/arrays.js',
            'objects' => 'sources/objects.js',
            'strings' => 'sources/ext/strings.js',
            'lenses' => 'sources/lenses.js',
            'trampolines' => 'sources/ext/trampolines.js',
            'advices' => 'sources/ext/advices.js',
            'iterators' => 'sources/ext/iterators.js',
            'functors' => 'sources/ext/functors.js',
            'contracts' => 'sources/ext/contracts.js'
        );
        return $map;
    }
}
?>
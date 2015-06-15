/**
 * Utilities
 * @author Mattakorn Limkool
 * @dependency jQuery, underscore js, ko, ko.mapping, Backbone, momentjs
 *
 */
define(function(reqiure) {
    'use strict';

    var Utils = {
        /**
         * const of util
         */
        const: {
            timeDefault: '00:00',
            timeDefaultFormat: 'HH:mm',
        },

        /**
         * clone javascript object
         * @param obj
         * @returns obj
         */
        cloneObj: function(obj, isDeep){
            if(_.isUndefined(isDeep)){isDeep = true};
            if(isDeep){
                return $.extend(true, {}, obj);
            }else{
                return $.extend({}, obj);
            }

//            return JSON.parse(JSON.stringify(obj));
        },

        /**
         * check javascript object or value is empty or not
         * @param obj | var
         * @returns bool true when obj is empty (true when null, undefined, empty string, empty obj)
         */
        isEmpty: function(obj){

            if(_.isObject(obj)){
                if(_.isEmpty(obj)){
                    return true;
                }else{
                    return false;
                }
            }else{
                if(_.isUndefined(obj) || _.isNull(obj) || obj === ''){
                    return true;
                }
                else{
                    return false;
                }
            }

        },

        isNotEmpty: function(obj){
            return !Utils.isEmpty(obj);
        },

        /**
         * check value in array or not
         * @param arr
         * @param value
         * @returns {boolean}
         */
        inArray: function(arr, value){
            if(_.isArray(arr)){

                if(arr.indexOf(value) == -1){
                    return false;
                }else{
                    return true;
                }
            }
            else{
                return false;
            }

        },
        /**
         * merge array by do not replace duplicated index of both array.
         * @param arr1
         * @param arr2
         * @returns {Array}
         */
        mergeArray: function(arr1, arr2){
            var result = [];
            arr1.forEach(function(item){
                result.push(item);
            });
            arr2.forEach(function(item){
                result.push(item);
            });
            return result;
        },

        redirect: function(route){
            if(Application.config.multiPage){
                window.location = Application.config.rootUrl + route;
//            Application.router.navigate(route);
//            Application.views.mainView.hide();
//            window.location.reload();
            }else{
                Application.router.navigate(route);
            }

        },

        /**
         * - replace url with param property
         * @param url - url/?param=1
         * @param params - {param: 2}
         * @returns {*} -  url/?param=2
         */
        replaceUrlParams: function(url, params){
            var queryParams = Utils.urlQueryParams(url);
            var baseUrl = Utils.baseUrl(url);

            var newParams = Utils.obj.merge(queryParams, params);
            return baseUrl + $.param(newParams);
        },

        /**
         *
         * @param urlString | null = current url
         * @returns {param1: 'val1', param2: 'val2'}
         */
        urlQueryParams : function (urlString) {
            // This function is anonymous, is executed immediately and
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = '';
            if(_.isUndefined(urlString)){
//                query_string['baseUrl'] = window.location.origin + window.location.pathname;
                query = window.location.search.substring(1);
            }else{
                var urlSplit = urlString.split("?");
//                query_string['baseUrl'] = urlSplit[0];
                query = urlSplit[1];
            }

            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]], pair[1] ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        },

        baseUrl: function(urlString){
            var baseUrl = '';
            if(_.isUndefined(urlString)){
                baseUrl = window.location.origin + window.location.pathname;
            }else{
                var urlSplit = urlString.split("?");
                baseUrl = urlSplit[0];
            }
            return baseUrl;
        },

        obj: {
            /**
             *
             * @param obj
             * @param callback (property, value, obj)
             * @returns {*}
             */
            loopProperties: function( obj, callback ){
                if(_.isObject(obj)){
                    var resultObj = _.clone(obj);
                    for(var property in obj){
                        if(obj.hasOwnProperty(property)){
                            var value = obj[property];
                            resultObj[property] = callback(property, value, obj);
                        }
                    }
                }else{
                    Utils.debug("Error, loopProperties(Obj, Callback), please send obj at first parameter.");
                    return;
                }

                return resultObj;
            },
            /**
             * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
             * @param obj1
             * @param obj2
             * @returns obj3 a new object based on obj1 and obj2
             */
            merge: function(obj1,obj2){
                if(_.isObject(obj1) && _.isObject(obj2)){
                    var obj3 = {};
                    for (var attrName in obj1) { obj3[attrName] = obj1[attrName]; }
                    for (var attrName in obj2) { obj3[attrName] = obj2[attrName]; }
                    return obj3;
                }else{
                    Utils.debug('Obj1 and Obj2 must be Object');
                    return;
                }

            }
        },

        debug: function(debugMessage){
            console.info("=========== DEBUG: Utils ==============");
            console.log(debugMessage);
            console.info("=========== END DEBUG: Utils ==========");
        },

        /**
         * Formatter
         */
        format: {
            time: function(dateString, useTimeDefault){
                useTimeDefault = useTimeDefault || false;

                if(!Utils.isEmpty(dateString)){
                    return moment(dateString).format(Utils.const.timeDefaultFormat);
                }else{
                    if(useTimeDefault){
                        return Utils.const.timeDefault;
                    }else{
                        return null;
                    }

                }
            }
        },

        /**
         * for extended backbone model
         */
        Model: {
            initFields: function(model, defaultPropertiesValue){
                if(Utils.isEmpty(model.fields)){
                    console.log("ERROR, model have no 'fields'");
                    return model;
                }else{
                    for(var property in model.fields){
                        if(property != 'primaryKey'){
                            var propertyName = model.fields[property];
                            model.set(propertyName, null);
                            // todo - can set default properties value

                        }
                    }
                    return model;
                }
            },

            isExtendedModel: function(model){
                if(Utils.isEmpty(model.fields)){
                    console.log("ERROR, model have no 'fields'");
                    return false;
                }else{
                    return true;
                }
            },
            mainField: function(){
                return ['primaryKey'];
            }
        },

        ko: {
            cloneObj: function(obj, emptyObj){
//                return ko.mapping.fromJS(ko.mapping.toJS(obj));
                var json = ko.toJSON(obj);
                var js = JSON.parse(json);

                return Utils.ko.extendObservable(emptyObj, js);
            },
            makeChildrenObservables : function (object) {
                if(!ko.isObservable(object)) return;

                // Loop through its children
                for (var child in object()) {
                    if (!ko.isObservable(object()[child])){
                        object()[child] = ko.observable(object()[child])
                    }

                    Utils.ko.makeChildrenObservables(object()[child]);
                }
            },
            extendObservable: function ( target, source ) {
                var prop, srcVal, tgtProp, srcProp,
                    isObservable = false;

                for ( prop in source ) {

                    if ( !source.hasOwnProperty( prop ) ) {
                        continue;
                    }

                    if ( ko.isWriteableObservable( source[prop] ) ) {
                        isObservable = true;
                        srcVal = source[prop]();
                    } else if ( typeof ( source[prop] ) !== 'function' ) {
                        srcVal = source[prop];
                    }

                    if ( ko.isWriteableObservable( target[prop] ) ) {
                        target[prop]( srcVal );
                    } else if ( target[prop] === null || target[prop] === undefined ) {

                        target[prop] = isObservable ? ko.observable( srcVal ) : srcVal;

                    } else if ( typeof ( target[prop] ) !== 'function' ) {
                        target[prop] = srcVal;
                    }

                    isObservable = false;
                }
            },
            addBindingHandlers: function(func, params, funcName){
                // todo - more params
                if(_.isUndefined(params)){

                }
                if(_.isUndefined(funcName)){

                }

                ko.bindingHandlers[func] = Utils.ko.bindingHandlers[func];
            },
            addAllBindingHandlers: function(){
                for(var func in Utils.ko.bindingHandlers){
                    ko.bindingHandlers[func] = Utils.ko.bindingHandlers[func];
                }
            },
            bindingHandlers: {
                // inverse of checked
                inverseChecked : {
                    init: function(element, valueAccessor, allBindingsAccessor) {
                        var value = valueAccessor();
                        var interceptor = ko.computed({
                            read: function() {
                                return !value();
                            },
                            write: function(newValue) {
                                value(!newValue);
                            },
                            disposeWhenNodeIsRemoved: element
                        });

                        var newValueAccessor = function() { return interceptor; };


                        //keep a reference, so we can use in update function
                        ko.utils.domData.set(element, "newValueAccessor", newValueAccessor);
                        //call the real checked binding's init with the interceptor instead of our real observable
                        ko.bindingHandlers.checked.init(element, newValueAccessor, allBindingsAccessor);
                    }
//                    update: function(element, valueAccessor) {
//                        //call the real checked binding's update with our interceptor instead of our real observable
//
////                        ko.bindingHandlers.checked.update(element, ko.utils.domData.get(element, "newValueAccessor"));
//                    }
                },
                // text time format
                time: {
                    update: function(element, valueAccessor, allBindingsAccessor){
                        var val =  ko.utils.unwrapObservable(valueAccessor());
                        return ko.bindingHandlers.text.update(element,function(){
                            return moment(val).format(Utils.const.timeDefaultFormat);
                        });
                    }
                },
                // binding time
                timeValue: {
                    init: function (element, valueAccessor, allBindings) {
                        var self = this;

                        var newAllBindings = function(){
                            // for backwards compatibility w/ knockout  < 3.0
                            return ko.utils.extend(allBindings(), { valueUpdate: 'afterkeydown' });
                        };
                        newAllBindings.get = function(a){
                            return a === 'valueupdate' ? 'afterkeydown' : allBindings.get(a);
                        };
                        newAllBindings.has = function(a){
                            return a === 'valueupdate' || allBindings.has(a);
//                            return a === 'valueupdate' ? 'afterkeydown' : allBindings.has(a);
                        };

                        ko.bindingHandlers.value.init(element, valueAccessor, newAllBindings);
//                        self.update(element, valueAccessor);
                    },
                    update: function(element, valueAccessor){
                        var val =  ko.utils.unwrapObservable(valueAccessor());
                        return ko.bindingHandlers.value.update(element,function(){
                            var time = moment(val).format(Utils.const.timeDefaultFormat);
                            if(time == "Invalid date"){ // input time only
                                return val;
                            }
                            else{
                                return time;
                            }
//                            return moment(val).format('HH:mm');
                        });
                    }
                },
                // show obj to json
                toJSON : {
                    update: function(element, valueAccessor){
                        return ko.bindingHandlers.text.update(element,function(){
                            return ko.toJSON(valueAccessor(), null, 2);
                        });
                    }
                }
            },

            format: {



            },
            toService: {
                check: function(value){
                    if(value == true){
                        return true;
                    }else{
                        return false;
                    }
                }
            }

        },
        Backbone: {
            toJSON: function(model) {
                var json = _.clone(model.attributes);
                for(var attr in json) {
                    if((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
                        json[attr] = json[attr].toJSON();
                    }
                }
                return json;
            }
        }

    };

    return Utils;
});
define(function(require) {
	'use strict';
	var ViewModel = function() {
		this.initialize.apply(this, arguments);
	};
	
	_.extend(ViewModel.prototype, Backbone.Events,  {
        const: {
            loading: 'loading',
            success: 'success',
            error: 'error',
        },

        action: ko.observable(),

        // default message
        loadingMessage: ko.observable('Loading...'),
        successMessage: ko.observable('Successfully'),
        errorMessage: ko.observable('Error!!'),

        initialize:function(){
            var self = this;

            self.action(self.const.loading);
        },

        callLoading: function(msg){
            this.action(this.const.loading);
            if(!Application.Utils.isEmpty(msg)){
                this.loadingMessage(msg);
            }
        },

        callSuccess: function(msg){
            this.action(this.const.success);
            if(!Application.Utils.isEmpty(msg)){
                this.successMessage(msg);
            }
        },

        callError: function(msg){
            this.action(this.const.error);
            if(!Application.Utils.isEmpty(msg)){
                this.errorMessage(msg);
            }
        },


	});
	
	ViewModel.prototype.instance = function() {
		return new ViewModel();
	};
	
	return ViewModel;
});
/** loading stage with popup */
define(function(require) {
	'use strict';
	
	var tpl = require('text!./tpl/main.html');
    var ViewModel = require('./view_model');
	require('css!./css/loading.css');

	var view = Core.Views.DialogView.extend({

        _callback: null,
        viewModel: null,
        config:{
            backdrop: 'static',
        },

        // data
        initialize: function(data) {
			var _this = this;

			_this.template = _.template(tpl);

            _this.viewModel = ViewModel.prototype.instance();

			Core.Views.DialogView.prototype.initialize.apply(_this, arguments);
		},

        events:{
        },

        setCallback: function(cb) {
            this._callback = cb;
        },
		
		render: function() {
			var _this = this;
			Core.Views.PageView.prototype.render.call(_this);

		},
		

		onRendered: function() {
			var _this = this;

            ko.applyBindings(_this.viewModel, _this.$el[0]);
		},

        // public method

        start: function(){
            var _this = this;
//            _this.viewModel.setModel(cellView, mainView);

            this.show();
        },

        stop: function(){

            this.hide();
        },

        // override core when show not close by backdrop
        show: function(){
            this.$el.modal({backdrop: 'static'});
        },

//        showLoading: function(msg){
//            this.show();
//            this.loading(msg);
//        },

        loading: function(msg, isShow){
            this.viewModel.callLoading(msg);
            if(isShow){
                this.show();
            }
        },

        success: function(msg, isShow){
            this.viewModel.callSuccess(msg);
            if(isShow){
                this.show();
            }
        },

        error: function(msg, isShow){
            this.viewModel.callError(msg);
            if(isShow){
                this.show();
            }
        },

        /**
            for overlay loading

        */
        overlayConfig: {
            solidBg: false,
        },
        overlayShow: function(selectorOverlay, elementOverlay){
            var solidBg = ' ';
            if(this.overlayConfig.solidBg){
                solidBg = ' solid-bg';
            }


            $(selectorOverlay, elementOverlay).append(
                '<div class="loading-overlay '+ solidBg +'">' +
                    '<div class="backdrop">' +
                    '</div>' +
                    '<div class="loading-icon">' +
                        '<i class="fa fa-spinner fa-spin"></i>' +
                    '</div>' +
                '</div>'
            );
        },
        overlayHide: function(selectorOverlay, elementOverlay){
            $(selectorOverlay, elementOverlay).find('.loading-overlay').remove();
        }


	});

    view.prototype.instance = function() {
		return new view();
	};
	
	return view;
});
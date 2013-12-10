define([
	"../core",
	"../ajax"
], function( jQuery ) {

// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		css: "text/css"
	},
	contents: {
		css: /css/
	},
	converters: {
		"text css": function( text ) {
			jQuery.globalStyle( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "css", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind link tag hack transport
jQuery.ajaxTransport( "css", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var link, callback;
		return {
			send: function( _, complete ) {
				link = jQuery("<link>").prop({
					rel: "stylesheet",
					type: "text/css",
					href: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( link[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});

});

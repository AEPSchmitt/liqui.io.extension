chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
	  $('.lamp').before($('<li id="favourites"><a class="custom_btn">Favourites</a><ul id="favourites_dropdown" style="display:none;"></ul></li>'));
		$('#favourites').before($('<li id="alert_button"><a class="custom_btn">Set Alert</a></li>'));
		$('#alert_button').click(function(e){toggleMarketList()});
		//Load favourites from localstorage
		var favourites = [];
		var ctrlActive = false;
		function removeFavourite(id){
			var idx = $.inArray(id, favourites);
			if (idx > -1){
			  favourites.splice(idx, 1);
				updateFavourites();
			}
		};
		function addFavourite(id){
			var idx = $.inArray(id, favourites);
			if (idx == -1){
			  favourites.push(id);
				updateFavourites();
			}
		}
		function updateFavourites(){
			chrome.storage.sync.set({'favourites': favourites}, function() {
				loadFavouritesMenu();
			});
		}
		var marketListOpened = false;
		function toggleMarketList(){
			//$('.price-table').prepend('<div class="col-xs-12"></div>');
			if(marketListOpened){
				$('.markets-table > tbody').css({'height':'246px'});
				$('#market_toggle').text('+');
				marketListOpened = false;
			} else {
					$('.markets-table > tbody').css({'height':'1200px'});
					$('#market_toggle').text('-');
					marketListOpened = true;
			}
		}
		function loadFavouritesMenu(){
			/*var fav_menu = $('#favourites');
			while (fav_menu.firstChild) {
			    fav_menu.removeChild(fav_menu.firstChild);
			}*/

			console.log("Initialising favourites menu");
			//$('#favourites').empty();
			chrome.storage.sync.get("favourites", function(favs){
				if(!$.isEmptyObject(favs)){
					favourites = favs.favourites;
					console.log("Favourites loaded from storage as:", favourites);
					favourites.forEach(function(c){
						let url = "https://liqui.io/#/exchange/"+c+"_BTC";
						var fav_btn = $('<li></li>');
						var currency_btn = $('<a class="currency_code">'+c+'</a>');
						currency_btn.click(function(e){
							if (e.ctrlKey){
								addGraph(c);
							} else {
								e.preventDefault();
								console.log("Redirecting to: " + url);
								window.location = url;
								location.reload();
							}
						});
						fav_btn.append(currency_btn);
						var close_btn = $('<a class="close"name="'+c+'"style="float: right; z-index:9999;">x</a>');
						close_btn.click(function(evt){
							removeFavourite(this.name);
							//console.log("HELLO", this.parent.text);
						})
						fav_btn.append(close_btn);
						$("#favourites_dropdown").append(fav_btn);
					})
				}
			});
		}
		function addGraph(currency){
			let src = "https://liqui.io/#/exchange/"+currency+"_BTC";
			let id = 'iframe_' + currency;
			var frame = $('<iframe id="'+id+'" style="display:none; width:1920px; margin-left: -188px;"</iframe>');
			$('.top-statistics > .container').append(frame);
			$('#'+id).attr('src', src);
			$('#'+id).load(function() {
				console.log("Iframe loaded");
				$(this).contents().find('#content > header').remove();
				var offers = $(this).contents().find('.offer-block').detach();
				offers.contents().find('.price-table').css('visibility','hidden');
				$(this).contents().find('#content > div.gray.trade').remove();
				$(this).contents().find('#content > div.gray.main-orders').remove();
				$(this).contents().find('.separator').remove();
				$(this).contents().find('#content').css('padding-bottom', '0px')
				$(this).contents().find('body > footer').remove();
				$('.offer-block').append(offers);
				$(this).show();
				$(this).css({'height' : '440px'});
				$(this).contents().find('.separator').css({'padding-top':'16px'})/*.click(function(e){
					jQuery(this).siblings().toggle();
				});*/
				//$('.top-statistics > .container').append(save);
				cleanIframe(this);
			});

			/*
			$('#emb_frame').contents().find('#content > header').hide();
			console.log($('#emb_frame').contents().find('#content > header'));*/
		}
		function cleanIframe(frame){
			console.log("IFRAME!");
			console.log(frame);
		}
		$('#favourites').click(function(evt){
			$('#favourites_dropdown').toggle();
		});
		$('.price-table').contents().find('h3').prepend('<div id="market_toggle" style="padding:5px;">+</div>');
		$('#market_toggle').click(function(e){
			console.log("Clicked some shit")
			toggleMarketList();
		})
		/*$('#filter_field').change(function(e){
			$('.markets-table > tbody > tr').filter(function (i, v) {
				var data =
		    var $t = $(this);
		    for (var d = 0; d < data.length; ++d) {
		        if ($t.is(":contains('" + data[d] + "')")) {
		            return true;
		        }
		    }
		    return false;
			}).show();
			console.log(e.target.value);
		});*/
		let $rows;
		setTimeout(function(){
			console.log("reloaded rows");
			$rows = $('.markets-table > tbody > tr');
		}, 100)
		$(document).ready(function(){
			console.log("Document Ready")
			$('.price-table').contents().find('h3').append('<input id="filter_field" type="text" placeholder="Filter Search"></input>');
			$rows = $('.markets-table > tbody > tr');
			console.log($rows);
			$('#filter_field').keyup(function() {
			    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

			    $rows.show().filter(function() {
			        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
			        return !~text.indexOf(val);
			    }).hide();
			});
		});

		$('#favourites').prop('tooltipText', 'CTRL + click to add as graph');
		$(".market-name").after($('<div id="add_favourite">Favourite</div>'))
		$("#add_favourite").click( function(evt){
			var currency = $(".market-name")[0].innerHTML.replace("/BTC", "");
			addFavourite(currency);
		});
			/*$(".market-name").after($('<button id="clear_storage">Clear Favourites</button>'))
			$("#clear_storage").click(function(){
				chrome.storage.sync.clear(function(evt){
				  console.log("Cleared storage");
					chrome.storage.sync.get("favourites", function(favs){
						console.log(favs)
					});
				})
			})*/

		$(window).keydown(function(e){
    	if (e.keyCode == 17){
	        ctrlActive = true;
					$('.currency_code').addClass('ctrl')
			}

		});
		$(window).keyup(function(e){
			if (e.keyCode == 17){
				$('.currency_code').removeClass('ctrl');
				ctrlActive = false;
			}
		});
		loadFavouritesMenu();
		// ----------------------------------------------------------

	}
	}, 10);
});

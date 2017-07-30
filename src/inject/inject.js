chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
	  jQuery('.lamp').before(jQuery('<li id="favourites"><a>Favourites</a><ul id="favourites_dropdown" style="display:none;"></ul></li>'));
		//Load favourites from localstorage
		var favourites = [];
		chrome.storage.sync.get("favourites", function(favs){
			if(!jQuery.isEmptyObject(favs)){
				favourites = favs.favourites;
				console.log("Favourites loaded from storage as:", favourites);
				favourites.forEach(function(evt){
					let url = "https://liqui.io/#/exchange/"+evt+"_BTC";
					var fav_btn = jQuery('<li>'+evt+'</li>');
					fav_btn.click(function(e){
						e.preventDefault();
						console.log("Redirecting to: " + url);
						window.location = url;
						location.reload();
					});
					jQuery("#favourites_dropdown").append(fav_btn);
				})
			}
		})
		jQuery('#favourites').click(function(evt){
			jQuery('#favourites_dropdown').toggle();
		})
		jQuery(".market-name").after(jQuery('<button id="add_favourite">Add to Favourites</button>'))
		jQuery("#add_favourite").click( function(evt){
				console.log("Clicked")
					var currency = jQuery(".market-name")[0].innerHTML.replace("/BTC", "");
					console.log(currency, favourites);
					console.log($.inArray(currency, favourites));
					if($.inArray(currency, favourites) < 0){
						favourites.push(currency);
						chrome.storage.sync.set({'favourites': favourites}, function() {
							// Notify that we saved.
							console.log('Added', currency, "to favourites");
							chrome.storage.sync.get("favourites", function(favs){
								console.log(favs);
							})
						});
					}
				})
			/*jQuery(".market-name").after(jQuery('<button id="clear_storage">Clear Favourites</button>'))
			jQuery("#clear_storage").click(function(){
				chrome.storage.sync.clear(function(evt){
				  console.log("Cleared storage");
					chrome.storage.sync.get("favourites", function(favs){
						console.log(favs)
					});
				})
			})*/


		// ----------------------------------------------------------

	}
	}, 10);
});

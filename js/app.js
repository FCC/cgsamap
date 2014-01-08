$(document).ready(function () {	
	$('#goUser').click(function(){
	    getCallSignInput('callsign');
	});
	
	$('#callsign').typeahead([ {
        name: 'callsign',
        //local: ['KNKA206','KNKN260']
		prefetch: 'data/callsign.json',
        limit: 20
      }]);

	
	
});

//$.get( "data/cgsa.txt" ).done(function( data ) {
//    $( "#callsign" ).autocomplete( { source: data.split( "\n" ) } );
//});


//$("#updated_date").text("text");
var cgsaJson;

var layers=[];
var fullExtent = new OpenLayers.Bounds(
		 -17107255, 2910721, -4740355, 6335100
		 
  );

var myJson = {};
//var mySourceJson = {};
//var myCoverageJson = {};

var map = new OpenLayers.Map({
    div: "coveragemap",
    projection: "EPSG:4326",
    displayProjection: "EPSG:4326",
    //numZoomLevels:14,
    maxExtent: new OpenLayers.Bounds(-19726771.406052828, -19006795,16217820.678695908, 12074497.093184782),
	units: "m"
});


var options = {
		'internalProjection': new OpenLayers.Projection("EPSG:900913"),
		'externalProjection': new OpenLayers.Projection("EPSG:4326")};


	var streetMap = new OpenLayers.Layer.XYZ(
	    "street map",
	    [
	    	//"http://a.tiles.mapbox.com/v3/fcc.map-fd8wksyc/${z}/${x}/${y}.png",
			//"http://b.tiles.mapbox.com/v3/fcc.map-fd8wksyc/${z}/${x}/${y}.png",
			//"http://c.tiles.mapbox.com/v3/fcc.map-fd8wksyc/${z}/${x}/${y}.png",
			//"http://d.tiles.mapbox.com/v3/fcc.map-fd8wksyc/${z}/${x}/${y}.png"
			"https://a.tiles.mapbox.com/v3/fcc.Cellular-Market-Areas/${z}/${x}/${y}.png",
			"https://a.tiles.mapbox.com/v3/fcc.Cellular-Market-Areas/${z}/${x}/${y}.png",
			"https://a.tiles.mapbox.com/v3/fcc.Cellular-Market-Areas/${z}/${x}/${y}.png",
			"https://a.tiles.mapbox.com/v3/fcc.Cellular-Market-Areas/${z}/${x}/${y}.png"
		], {
	        sphericalMercator: true,
	        wrapDateLine: true,
	        isBaseLayer:true,
	        transitionEffect: "resize",
	        buffer: 1,
			'displayInLayerSwitcher':false
	    }
	);

	
	//layers.push(mapboxTerrain);
	layers.push(streetMap);


var cgsaStyle = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
        strokeColor: "#A60000",
		//strokeOpacity: 1,
    	strokeWidth: 2,
		fillColor: "#BF3030",
		fillOpacity: 0.5,
		//label: "${CONC}",
        //fontColor: "#A60000",
        //fontFamily: "sans-serif",
        //fontWeight: "normal",
        //labelXOffset: "35",
		//fontSize:12
    })
});

/*
var plssLayer = new OpenLayers.Layer.WMS("PLSS**", 
                                   //"http://165.135.226.69:8080/geoserver/wms?", 
                                   //"http://165.135.239.37:8010/geoserver/wms",
								   geourl,
								   {LAYERS: 'fcc:plss',transparent: 'true',tiled:true,tilesorigin: [map.maxExtent.left, map.maxExtent.bottom]},{maxScale:1/8});

layers.push(plssLayer);
map.addLayers(layers);

var countyLayer = new OpenLayers.Layer.WMS("County", 
                                   //"http://165.135.226.69:8080/geoserver/wms?", 
                                   geourl,
								   //"http://165.135.239.37:8010/geoserver/wms",
								   {LAYERS: 'fcc:county',transparent: 'true',tiled:true,tilesorigin: [map.maxExtent.left, map.maxExtent.bottom]},{maxScale:1/40});

layers.push(countyLayer);
map.addLayers(layers);


var studyAreaLayer = new OpenLayers.Layer.WMS("Study Areas (Blue)", 
                                   //"http://165.135.226.69:8080/geoserver/wms?", 
                                   geourl,
								   //"http://165.135.239.37:8010/geoserver/wms",
								   {LAYERS: 'fcc:study_areas',transparent: 'true', tiled:true,tilesorigin: [map.maxExtent.left, map.maxExtent.bottom]});

layers.push(studyAreaLayer);
map.addLayers(layers);


var overlapLayer = new OpenLayers.Layer.WMS("Overlap Polygons (Red)", 
                                   //"http://165.135.226.69:8080/geoserver/wms?", 
                                   geourl,
								   //"http://165.135.239.37:8010/geoserver/wms",
								   {LAYERS: 'fcc:overlap',transparent: 'true',tiled:true,tilesorigin: [map.maxExtent.left, map.maxExtent.bottom]});

layers.push(overlapLayer);
map.addLayers(layers);
*/

var selectedFeatureLayer = new OpenLayers.Layer.Vector("callsign", {
		styleMap: cgsaStyle,					
		displayInLayerSwitcher:false
	});
layers.push(selectedFeatureLayer);
map.addLayers(layers);


var scaleline = new OpenLayers.Control.ScaleLine();
map.addControl(scaleline);

/*info = new OpenLayers.Control.WMSGetFeatureInfo({
            //url: 'http://165.135.226.69:8080/geoserver/wms?', 
            //url: geourl,
			url: 'http://165.135.239.37:8010/geoserver/wms',
			title: 'Identify features by clicking',
            queryVisible: true,
			eventListeners: {
                getfeatureinfo: function(event) {
                    map.addPopup(new OpenLayers.Popup.FramedCloud(
                        "infowindow", 
                        map.getLonLatFromPixel(event.xy),
                        null,
                        event.text,
                        //'<div style="color:#FF0000">'+   + '</div>',
						null,
                        true
                    ));
                }
            }
        });
map.addControl(info);
info.activate();*/

//beginning of info tool
var selectControl, selectedFeature;
function onPopupClose(evt) {
            selectControl.unselect(selectedFeature);
        }
function onFeatureSelect(feature) {
			//alert("select one feature");
			//alert(feature.geometry.getBounds().getCenterLonLat());
            selectedFeature = feature;
            popup = new OpenLayers.Popup.FramedCloud("chicken", 
                                     feature.geometry.getBounds().getCenterLonLat(),
                                     null,
                                     "<div style='font-size:.8em'><br>CALL SIGN: " + feature.attributes.CALL_SIGN+
									 "<br>MARKET: " + feature.attributes.MARKET+"<br>BLOCK: " + feature.attributes.BLOCK+
									 "<br>Callsign Details: <a href='" + feature.attributes.URL+"' target='blank'>"+feature.attributes.URL+ "</a></div>", null, true, onPopupClose);
            feature.popup = popup;
            map.addPopup(popup);
        }
        function onFeatureUnselect(feature) {
			popup.feature = null;
            feature.popup.destroy();
            feature.popup = null;
        } 
		

selectControl = new OpenLayers.Control.SelectFeature(selectedFeatureLayer,
                {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
map.addControl(selectControl);
selectControl.activate();


		
		
		
//end of info tool		

map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));
document.getElementById("layerswitcher").firstChild.childNodes[2].innerHTML = "Layer Switcher";


function getCallSignInput(type){
	var callsign = '';
	var affiliation = '';
	
	if (type=="callsign"){
        //document.getElementById('results').style.display = "block";
		callsign=$('#callsign').val();
		//alert("callsign: " + callsign);
		//alert("company: " + company);
		//alert($('#company').children(":selected").text());
		if(callsign !=""){
		$("#callsign_lbl").text($('#callsign').val());
    	drawCallsignMap(callsign);
		}
		else
		{
		$("#callsign_lbl").text("CGSA Boundary Query");
		//alert("here")
		//selectedFeatureLayer.removeAllFeatures();
		//map.zoomToExtent(fullExtent);
		location.reload();
		}
	}
}

function drawCallsignMap(callsign){
    //draw overlap layer
	myJson.features=[];
	var p = new OpenLayers.Format.GeoJSON(options);
	
	for (i=0;i<cgsaJson.features.length;i++){
			if (cgsaJson.features[i].properties.CALL_SIGN.toString().indexOf(callsign.toString().toUpperCase())>=0){
				myJson.features.push(cgsaJson.features[i]);
			}
	}
	
	
	if(myJson.features.length>0){
		var feats = p.read(myJson);	
		selectedFeatureLayer.removeAllFeatures();
	  	selectedFeatureLayer.addFeatures(feats);
		map.zoomToExtent(selectedFeatureLayer.getDataExtent());  
	}
	else{
	alert("no overlap found for this carrier");
	}
	
}

$.getJSON("data/cgsa.geojson", function (data) {
				var updated_date;
				cgsaJson=data;
				updated_date=cgsaJson.features[0].properties.date.toString();
				//alert("updated_date: " + updated_date);
				$("#updated_date").text("Cellular Geographic Service Areas as of " + updated_date);
				myJson.type=cgsaJson.type;
				myJson.features=[];
				map.zoomToExtent(fullExtent,true);		
				
	var paras=window.location.href.split("#");
	if (paras.length==1){
		//do nothing
	}
	else{
		if(paras[1].length>0){
			//var parasArray=decodeURIComponent(paras[1]).replace(/\s/g, "").split(",");
			var callsignPara=paras[1];
			drawCallsignMap(callsignPara);
			//console.log("paras: " +parasArray.toString()); 
			//alert("paras: " +callsignPara); 
			$("#callsign_lbl").text(callsignPara);
    	}
	}

				
				
})
	



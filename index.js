function onLoad() {
  //creating the map object
  var mymap = L.map('map');
  //if relative path after ? has no coords, use default map coords.
  let queryString = window.location.href.split("?")[1];
  if(queryString === undefined){
    //default
    //var mymap = defaultMap();
    mymap.setView([30.00001, -50.00001], 5);
    updateURI();
  }else{
    //given a valid relative path (i.e.) ?12.57600,-62.27050,5 use provided input to create map.
    let lat = queryString.split(",")[0];
    let lng = queryString.split(",")[1];
    let zoom = queryString.split(",")[2];
    try{
      mymap.setView([lat, lng], zoom);
    }catch(error){
      //if not valid, use default map
      console.error(error);
      constdefault = mymap.setView([30.00001, -50.00001], 5);
      updateURI();
    }
  }

  //adding map tiles
  L.tileLayer('tiles/{z}/{x}/{y}.png',
    {
      minZoom: 0,
      maxZoom: 10,
      noWrap: true,
      minZoom: 3
    }
  ).addTo(mymap);
  
  //Get map centre Latlng & zoom on offclick and update browser address
  //https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
  function updateURI() {
    //Jesus wept there's a better way to do this, I know there is. This is here as stringifying the a whole lat/lng
    // and then concat the string means on negative coords, it's a shorter length and I'd like these to be ±00.00000.
    // Example: -50.01245 would originally produce -50.0124 and 50.01245 would produce -50.01245.  
    let lat = mymap.getCenter().lat;
    let latStr = lat.toString();
    let latInt = latStr.split(".")[0];
    let latFraction = latStr.split(".")[1];
    latFraction = latFraction.substring(0,5);
    lat = latInt + "." + latFraction;
    
    let lng = mymap.getCenter().lng;
    let lngStr = lng.toString();
    let lngInt = lngStr.split(".")[0];
    let lngFraction = lngStr.split(".")[1];
    lngFraction = lngFraction.substring(0,5);
    lng = lngInt + "." + lngFraction;

    const zoom = mymap.getZoom()
    const URI = (`?${lat},${lng},${zoom}`);

    //unsure if I want to use .pushState() or .replaceState() yet. 
    //push adds to history so could use back/forward in browser and I don't know if that'd be annoying in usage. 
    window.history.replaceState(null,null,URI);
  }
  mymap.on( 'mouseup zoomend' , updateURI );

}

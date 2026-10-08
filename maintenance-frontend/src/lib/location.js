export function requestCurrentLocation(options={}) {
  return new Promise((resolve,reject)=>{
    if(!("geolocation" in navigator)){
      reject(new Error("Location services are not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos=>resolve({
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude,
        accuracy:pos.coords.accuracy,
        capturedAt:new Date().toISOString()
      }),
      err=>{
        const msg=err.code===1
          ?"Location permission was denied. Enable location for this site in your browser settings."
          :err.code===2
          ?"Your location is currently unavailable."
          :"Location request timed out. Please try again.";
        reject(new Error(msg));
      },
      {enableHighAccuracy:true,timeout:12000,maximumAge:30000,...options}
    );
  });
}

## Notes for project
1. Hover features for attribute information
2. Sidebar customisations for hover tooltips   
3. Add in .csv and shapefile upload  
4. Create vertical side tabs for sidebar for graphs and other visual cards - Need active tab css transform. Highlight active tab? push outwards a bit more?
5. Fill and line colours based on attributes
6. Create config download or saving in firebase
7. On upload CRS transformation to 4326
8. GeoParquet support?
9. SQL database connection? BigQuery?
10. Pre-defined or built in layers such as administrative boundaries, census data etc. 
11. Point size, Line vs point layer (see openstreetmap ways query below)


**Example overpass turbo query**
[out:json];
area[name = "Sydney"];
(way(area)["highway"~"^(motorway|trunk|primary|secondary|residential)$"];>;);
out;

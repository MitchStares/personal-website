## Notes for project
1. Hover features for attribute information
2. Sidebar customisations for hover tooltips   
3. Add in .csv and shapefile upload  
~~4. Create vertical side tabs for sidebar for graphs and other visual cards - Need active tab css transform. Highlight active tab? push outwards a bit more?~~
~~5. Fill and line colours based on attributes~~
6. Create config download or saving in firebase
7. On upload CRS transformation to 4326
8. GeoParquet support?
9. SQL database connection? BigQuery?
10. Pre-defined or built in layers such as administrative boundaries, census data etc. 
11. Point size, ~~Line vs point layer (see openstreetmap ways query below)~~
12. Ability to add new sidebar pullout tab for text/markdown editing. Include inline image uploads and display
13. Sidebar Graphs using D3
14. Customisable sidebar widgets. Graphs (bar, chart etc), cards, text
15. On-upload transformation sequence (eventual sql integration) using graphical, no-code editor. Think DAGs, Tableau's data pipeline, ADF etc.

## Utility Tools  
Create a utility tool for querying data quality of datasets. Potentially add a CRS transformation tool, file conversion, clipping etc. 
Does not need to be a flashy Single page app or super complicated in its stack. Just needs to have a very basic front-end UI with some back-end processing or client-side processing. 

**Example overpass turbo query**
[out:json];
area[name = "Sydney"];
(way(area)["highway"~"^(motorway|trunk|primary|secondary|residential)$"];>;);
out;


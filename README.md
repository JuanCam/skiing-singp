# Skiing in Singapore

This is the solution for the skiing in singapore problem.
The steps to run this code are:
- Install nodejs.org (in case you haven't).
- Run `node skiing.js [map-file]` replace map file with the file containing the map you want to use.

This program first finds all the lowest points in the map and then using a DFS algorithm finds the distances between these points and all the other reachable ones, store them in a list and finally gets the one with the longest and steepest vertical drop.
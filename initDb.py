import sys
import requests
import pymongo
from pymongo import MongoClient
from math import pi, sin, cos, asin, sqrt

apiUrl = "http://overpass-api.de/api/interpreter"

def update_db(mongodb_uri, bbox="60.332798, 21.988413, 60.569351, 22.579627"):
  query = f"""
  [out:json];
  way({bbox})
  ["highway"~"cycleway|footway|service|path|pedestrian|residential|steps|living_street|sidewalk"]
  ["area"!~"yes"]
  ["foot"!~"no|use_sidepath"]
  ["maxspeed"!~"40"];
  (._;);
  out geom;
  """

  res = requests.get(apiUrl, params={"data": query})
  data = res.json()["elements"]

  # remove roads where walking is not allowed
  data = list(filter(lambda x: "foot" not in x["tags"] or (x["tags"]["foot"] != "no" and x["tags"]["foot"] != "use_sidewalk"), data))
  # remove private roads
  data = list(filter(lambda x: "access" not in x["tags"] or x["tags"]["access"] != "private", data))

  # only keep id, nodes and coordinates
  ways = list(map(lambda x: {
      "id": x["id"],
      "nodes": x["nodes"],
      "geometry": x["geometry"]
  }, data))

  graph = create_graph(ways)
  graph_as_list = []

  for key, val in graph.items():
      node = val.copy()
      node["_id"] = key
      graph_as_list.append(node)

  client = MongoClient(mongodb_uri)

  with client:
      db = client.street_graph
      db.nodes.drop()
      db.nodes.insert_many(graph_as_list)
      db.nodes.create_index([("coordinates", "2dsphere")])

def deg_to_rad(val):
    return pi * val / 180

def coordinates_to_distance(lat1, lon1, lat2, lon2):
    earth_radius = 6371000
    lat1 = deg_to_rad(lat1)
    lat2 = deg_to_rad(lat2)
    lon1 = deg_to_rad(lon1)
    lon2 = deg_to_rad(lon2)
    
    h = sin((lat2-lat1)/2)**2 + cos(lat1)*cos(lat2)*sin((lon2-lon1)/2)**2
    return round(2*earth_radius*asin(sqrt(h)), 2)
    

def create_edge(current_node, connected_node):
    dist = coordinates_to_distance(
        current_node[1]["lat"],
        current_node[1]["lon"],
        connected_node[1]["lat"],
        connected_node[1]["lon"],
    )
    return {"connected_id": connected_node[0], "distance": dist}

def create_graph(ways):
    nodes = {}
    
    for way in ways:
        maxIdx = len(way["nodes"]) - 1
        node_list = list(zip(way["nodes"], way["geometry"]))
        for node1, node2 in zip(node_list, node_list[1:]):
            if node1[0] not in nodes:
                nodes[node1[0]] = {"coordinates": [node1[1]["lon"], node1[1]["lat"]], "edges": []}
            if node2[0] not in nodes:
                nodes[node2[0]] = {"coordinates": [node2[1]["lon"], node2[1]["lat"]], "edges": []}
            nodes[node1[0]]["edges"].append(create_edge(node1, node2))
            nodes[node2[0]]["edges"].append(create_edge(node2, node1))
    return nodes


if __name__ == "__main__":
  if (len(sys.argv) != 2 and len(sys.argv) != 3):
    print("Give the database uri as the first argument and optionally the bounding box coordinates as the second argument.")
  else:
    update_db(sys.argv[1], sys.argv[2])
/*
 Copyright 2013 Roy Russo

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Latest Builds: https://github.com/royrusso/elasticsearch-HQ
 */

/**
 * Collection of NodeSimple, when we simply need the list of nodes.
 *
 * Leverages the ClusterState api call, allowing for filtering of information needed or not.
 * fetch() will cast all response to NodeSimple
 *
 curl -XGET 'http://localhost:9200/_cluster/state?filter_nodes=false, etc...'
 TODO consider using http://localhost:9200/_cluster/nodes, instead.{
ok: true,
cluster_name: "elasticsearch",
nodes: {
T85nBl4PQwe-wupFiMworw: {
name: "Aardwolf",
transport_address: "inet[192.168.1.129/192.168.1.129:9302]",
hostname: "TYR",
version: "0.90.0",
http_address: "inet[/192.168.1.129:9200]"
}...
 */

var NodeListModel = Backbone.Collection.extend({
    model:NodeSimple,
    masterNode:'',
    initialize:function () {
        console.log("Inside NodeList");
    },
    url:function () {
        return '/_cluster/state?filter_nodes=false&filter_metadata=true&filter_routing_table=true&filter_blocks=true&filter_indices=true'
    },
    parse:function (data) {
        if (data.master_node) {
            console.log('Master Node is: ' + data.master_node);
            this.masterNode = data.master_node;
        }

        // nodes are keyed by their id, so we need to get the key and add it to the value object foreach
        var nodes = data.nodes;
        nodes[this.masterNode].master = true; // all the others appear as false, by default.
        var nodeKeys = _.keys(nodes);
        var nodeValues = _.values(nodes);
        for (var i = 0; i < nodeKeys.length; i++) {
            nodeValues[i].id = nodeKeys[i];
        }
        return nodeValues;
    }
});

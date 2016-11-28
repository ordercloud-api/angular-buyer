angular.module('orderCloud')
    .controller('CategoryTreeCtrl', CategoryTreeController)
    .factory('CategoryTreeService', CategoryTreeService)
    .directive('categoryNode', CategoryNode)
    .directive('categoryTree', CategoryTree)
;

function CategoryTreeController(Tree, CategoryTreeService) {
    var vm = this;
    vm.tree = Tree;

    vm.treeOptions = {
        dropped: function(event) {
            CategoryTreeService.UpdateCategoryNode(event);
        }
    };
}

function CategoryTree() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tree: '='
        },
        template: "<ul><category-node ng-repeat='node in tree' node='node'></category-node></ul>"
    };
}

function CategoryNode($compile) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            node: '='
        },
        template: '<li><a ui-sref="base.adminCategories.edit({id:node.ID})" ng-bind-html="node.Name"></a></li>',
        link: function(scope, element) {
            if (angular.isArray(scope.node.children)) {
                element.append("<category-tree tree='node.children' />");
                $compile(element.contents())(scope);
            }
        }
    };
}

function CategoryTreeService($q, Underscore, OrderCloud) {
    return {
        GetCategoryTree: tree,
        UpdateCategoryNode: update,
        GetMeCategoryTree: getMeCategoryTree
    };

    function tree() {
        var tree = [];
        var deferred = $q.defer();
        OrderCloud.Categories.List(null, 1, 100, null, null, null, 'all')
            .then(function(list) {
                angular.forEach(Underscore.where(list.Items, {ParentID: null}), function(node) {
                    tree.push(getnode(node));
                });

                function getnode(node) {
                    var children = Underscore.where(list.Items, {ParentID: node.ID});
                    if (children.length > 0) {
                        node.children = children;
                        angular.forEach(children, function(child) {
                            return getnode(child);
                        });
                    } else {
                        node.children = [];
                    }
                    return node;
                }

                deferred.resolve(tree);
            });
        return deferred.promise;
    }

    function update(event) {
        var sourceParentNodeList = event.source.nodesScope.$modelValue,
            destParentNodeList = event.dest.nodesScope.$modelValue,
            masterDeferred = $q.defer();

        updateNodeList(destParentNodeList).then(function() {
            if (sourceParentNodeList != destParentNodeList) {
                if (sourceParentNodeList.length) {
                    updateNodeList(sourceParentNodeList).then(function() {
                        updateParentID().then(function() {
                            masterDeferred.resolve();
                        });
                    });
                } else {
                    updateParentID().then(function() {
                        masterDeferred.resolve();
                    });
                }
            }
        });

        function updateNodeList(nodeList) {
            var deferred = $q.defer(),
                nodeQueue = [];
            angular.forEach(nodeList,function(cat, index) {
                nodeQueue.push((function() {
                    return OrderCloud.Categories.Patch(cat.ID, {ListOrder: index});
                }));
            });

            var queueIndex = 0;
            function run(i) {
                nodeQueue[i]().then(function() {
                    queueIndex++;
                    if (queueIndex < nodeQueue.length) {
                        run(queueIndex);
                    } else {
                        deferred.resolve();
                    }
                });
            }
            run(queueIndex);

            return deferred.promise;
        }

        function updateParentID() {
            var deferred = $q.defer(),
                parentID;

            if (event.dest.nodesScope.node) {
                parentID = event.dest.nodesScope.node.ID;
            } else {
                parentID = null;
            }
            event.source.nodeScope.node.ParentID = parentID;
            OrderCloud.Categories.Update(event.source.nodeScope.node.ID, event.source.nodeScope.node)
                .then(function() {
                    deferred.resolve();
                });
            return deferred.promise;
        }

        return masterDeferred.promise;
    }

    function getMeCategoryTree() {
        var tree = [];
        var deferred = $q.defer();
        OrderCloud.Me.ListCategories(null, 1, 100, null, null, null, 'all')
            .then(function(list) {
                angular.forEach(Underscore.where(list.Items, {ParentID: null}), function(node) {
                    tree.push(getnode(node));
                });

                function getnode(node) {
                    var children = Underscore.where(list.Items, {ParentID: node.ID});
                    if (children.length > 0) {
                        node.children = children;
                        angular.forEach(children, function(child) {
                            return getnode(child);
                        });
                    } else {
                        node.children = [];
                    }
                    return node;
                }

                deferred.resolve(tree);
            });
        return deferred.promise;
    }
}
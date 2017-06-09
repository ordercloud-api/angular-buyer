// describe('Directive: ocSpecForm', function () {
//     var element,
//         specs;
//     beforeEach(function () {
//         var defer = q.defer();
//         defer.resolve(specs);
//         spyOn(oc.Me, 'ListSpecs').and.returnValue(defer.promise);
//         //mock.product = {ID: 'MockProductID'};
//         scope.mockProduct = mock.Product;
//         specs = [{
//             "mockSpec": [
//                 "mockOption"
//             ]
//         }];
//         element = compile('<oc-spec-form product="mockProduct"></oc-spec-form>')(scope);
//     });
//     it('should initialize the isolate scope', function () {
//         expect(element.isolateScope().product).toEqual(mock.product);
//     })
//     it('should call Me.ListSpecs with a product ID and parameters', function () {
//         var parameters = {
//             page: 1,
//             pageSize: 100
//         };
//         expect(oc.Me.ListSpecs).toHaveBeenCalledWith(mock.Product.ID, parameters);
//     })
// })

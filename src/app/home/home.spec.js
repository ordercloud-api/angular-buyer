/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
//TODO: this is all commented out because the way it is currently written will break the $ grunt watch task.
/*
describe( 'home section', function() {
  beforeEach( module( 'orderCloud' ) );
  //TODO: this used to be orderCloud.home because it was it's own module but now it is just chained onto orderCloud... how would we write the test for 'home section' in this case?

  it( 'should have a dummy test', function() {
    expect( true ).toBeTruthy();
  });
});
*/


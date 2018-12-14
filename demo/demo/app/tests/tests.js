var DnaNetService = require("nativescript-dna-netservices").DnaNetService;
var dnaNetService = new DnaNetService();

describe("greet function", function() {
    it("exists", function() {
        expect(dnaNetService.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(dnaNetService.greet()).toEqual("Hello, NS");
    });
});
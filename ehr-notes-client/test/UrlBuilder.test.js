import UrlBuilder from "../src/UrlBuilder";

describe("UrlBuilder tests", () => {

    var urlBuilder = new UrlBuilder("http://someurl.com");       
    var urlBuilderWithPort = new UrlBuilder("http://someurl.com:8080");       
    var urlBuilderWithHttps = new UrlBuilder("https://someurl.com");       

    describe("getBaseUrl()", () => {              
        it("with http URL without port returns correct URL", () => {
            var url = urlBuilder.getBaseUrl();
            expect(url).toEqual("http://someurl.com");
        })

        it("with http URL with port returns correct URL", () => {
            var url = urlBuilderWithPort.getBaseUrl();
            expect(url).toEqual("http://someurl.com:8080");
        })

        it("with https URL without port returns correct URL", () => {
            var url = urlBuilderWithHttps.getBaseUrl();
            expect(url).toEqual("https://someurl.com");
        })
    });

    describe("getGraphQLUrl()", () => {              
        it("with http URL without port returns correct URL", () => {
            var url = urlBuilder.getGraphQLUrl();
            expect(url).toEqual("http://someurl.com/graphql");
        })
        
        it("with http URL with port returns correct URL", () => {
            var url = urlBuilderWithPort.getGraphQLUrl();
            expect(url).toEqual("http://someurl.com:8080/graphql");
        })

        it("with https URL without port returns correct URL", () => {
            var url = urlBuilderWithHttps.getGraphQLUrl();
            expect(url).toEqual("https://someurl.com/graphql");
        })
    });

    describe("getSubscriptionsUrl()", () => {
        it("with http URL without port returns correct URL", () => {
            var url = urlBuilder.getSubscriptionsUrl();
            expect(url).toEqual("ws://someurl.com/subscriptions");
        })
        
        it("with http URL with port returns correct URL", () => {
            var url = urlBuilderWithPort.getSubscriptionsUrl()
            expect(url).toEqual("ws://someurl.com:8080/subscriptions");
        })

        it("with https URL without port returns correct URL", () => {
            var url = urlBuilderWithHttps.getSubscriptionsUrl()
            expect(url).toEqual("wss://someurl.com/subscriptions");
        })
    });
})
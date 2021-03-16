export default  class UrlBuilder {
    constructor(baseurl) {
        this.baseurl = baseurl;
    }

    getBaseUrl() {
        return this.baseurl;
    }

    getGraphQLUrl() {
        return `${this.baseurl}/graphql`;              
    }

    getSubscriptionsUrl() {
        if (this.baseurl.startsWith("https"))
        {
            var base = this.baseurl.substring(5);
            return `wss${base}/subscriptions`;
        }

        var base = this.baseurl.substring(4);
        return `ws${base}/subscriptions`;
    }
}
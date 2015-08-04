// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.job("checkRepositories", function(request, status) {
    var urls = [
        "https://api.github.com/search/repositories?q=icfp+15&sort=updated&order=desc",
        "https://api.github.com/search/repositories?q=icfp+2015&sort=updated&order=desc",
        "https://api.github.com/search/repositories?q=icfpc+15&sort=updated&order=desc",
        "https://api.github.com/search/repositories?q=icfpc+2015&sort=updated&order=desc",
    ];

    var promise = Parse.Promise.as();
    urls.forEach(function(url) {
        var nextPromise =
            Parse.Cloud.httpRequest({
                url: url,
                method: 'GET',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10) AppleWebKit/600.1.25 (KHTML, like Gecko) Version/8.0 Safari/600.1.25'
                },
            })
            .then(function(data) {
                console.log("Returned response from Github" + data.text);
                data = JSON.parse(data.text);
                if (data.total_count == 0) {
                    return Parse.Promise.as([])
                }

                var ids = data.items.map(function(item) {
                    return item.id;
                });

                var query = new Parse.Query("Repository")
                    .containedIn("repId", ids)
                    .find()
                    .then(function(reps) {
                        var newReps = data.items.filter(function(item) {
                            var alreadyInStorage = reps.filter(function(rep) {
                                return rep.get("repId") == item.id;
                            }).length > 0;
                            return !alreadyInStorage;
                        })
                        console.log("Found " + newReps.length + "new Repositories")

                        if (newReps.length == 0) {
                            return Parse.Promise.as([]);
                        }

                        var itemsToSave = newReps.map(function(newRep) {
                            var Repository = Parse.Object.extend("Repository");
                            var parseRep = new Repository();
                            parseRep.set("repId", newRep.id);
                            parseRep.set("name", newRep.name);
                            parseRep.set("full_name", newRep.full_name);
                            parseRep.set("html_url", newRep.html_url);
                            return parseRep;
                        });

                        return Parse.Object.saveAll(itemsToSave);

                    });
                return query;
            })
            .then(function(items) {
                // Calling the API
                var requests = items.map(function(item) {
                    var postRequest =
                        Parse.Cloud.httpRequest({
                            url: "https://hooks.slack.com/services/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",
                            method: 'POST',
                            body: "payload=" + JSON.stringify({
                                text: "New repository found\n" + item.get("full_name") + "\n<" + item.get("html_url") + ">"
                            })
                        });
                    return postRequest;
                });
                return Parse.Promise.when(requests);
            })

        promise = promise.then(function() {
            return nextPromise;
        })
    })


    promise.then(function(items) {
            status.success("Success!");
        },
        function(error) {
            console.error(error);
            status.error("Error : " + error);
        })
});